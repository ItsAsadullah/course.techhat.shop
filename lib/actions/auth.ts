"use server";

import { createClient } from "@supabase/supabase-js";

export async function lookupEmailByPhone(phone: string): Promise<string | null> {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First try querying the students table which we have full control over via admin
    const { data: student, error } = await supabaseAdmin
      .from("students")
      .select("email, mobile")
      .eq("mobile", phone)
      .single();

    if (student) {
      if (student.email) return student.email;
      // If student has no email in DB, it was auto-generated during auth creation
      return `${phone}@student.techhat.local`;
    }

    // Fallback: search auth users (less efficient but catches edges)
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users?.users.find(u => u.phone === phone);
    
    if (user && user.email) {
      return user.email;
    }

    return null;
  } catch (error) {
    console.error("Failed to lookup email by phone:", error);
    return null;
  }
}

export async function registerUser(name: string, mobile: string, email: string, password: string) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const userEmail = email.trim() !== "" ? email : `${mobile}@student.techhat.local`;

    const authPayload: any = {
      email: userEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        role: "student"
      }
    };

    if (mobile && mobile.trim() !== "") {
      // Supabase requires E.164 format for phone numbers (e.g., +88017...)
      let formattedPhone = mobile.trim();
      if (formattedPhone.startsWith("01") && formattedPhone.length === 11) {
        formattedPhone = "+88" + formattedPhone;
      } else if (formattedPhone.startsWith("8801")) {
        formattedPhone = "+" + formattedPhone;
      }
      
      authPayload.phone = formattedPhone;
      authPayload.phone_confirm = true;
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser(authPayload);

    if (authError) {
      return { success: false, error: authError.message };
    }

    // Insert into students table for consistency — but check for duplicates first
    const { data: existingStudent } = await supabaseAdmin
      .from("students")
      .select("id")
      .or(`mobile.eq.${mobile},email.eq.${userEmail}`)
      .maybeSingle();

    if (!existingStudent) {
      const { error: studentError } = await supabaseAdmin
        .from("students")
        .insert({
          full_name_en: name,
          mobile: mobile,
          email: userEmail,
          user_id: authData.user?.id || null,
        });

      if (studentError) {
        console.error("Failed to insert student record during registration:", studentError);
      }
    } else {
      // Link existing student record to auth user
      if (authData.user) {
        await supabaseAdmin
          .from("students")
          .update({ user_id: authData.user.id })
          .eq("id", existingStudent.id);

        await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
          user_metadata: {
            full_name: name,
            student_id: existingStudent.id,
            role: "student",
          },
        });
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Registration Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(userId: string, studentId: string, name: string, mobile: string, email: string) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Format phone if provided
    let formattedPhone = mobile.trim();
    if (formattedPhone) {
      if (formattedPhone.startsWith("01") && formattedPhone.length === 11) {
        formattedPhone = "+88" + formattedPhone;
      } else if (formattedPhone.startsWith("8801")) {
        formattedPhone = "+" + formattedPhone;
      }
    }

    // 1. Update Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: email.trim() !== "" ? email : undefined,
      phone: formattedPhone || undefined,
      user_metadata: {
        full_name: name,
        // preserve other metadata
      }
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    // 2. Update Student Record
    if (studentId) {
      const { error: studentError } = await supabaseAdmin
        .from("students")
        .update({
          full_name_en: name,
          mobile: mobile, // Unformatted mobile for DB consistency
          email: email,
        })
        .eq("id", studentId);

      if (studentError) {
        console.error("Failed to update student table:", studentError);
        // non-fatal
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return { success: false, error: error.message };
  }
}
