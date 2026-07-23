import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramNotification } from "@/lib/telegram";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, fatherName, phone, email, address, course, shift, password } = body;

    // Basic validation
    if (!fullName || !fatherName || !phone || !address || !course || !shift || !password) {
      return NextResponse.json({ error: "সব তথ্য পূরণ করুন" }, { status: 400 });
    }

    if (!/^01[3-9]\d{8}$/.test(phone)) {
      return NextResponse.json({ error: "সঠিক মোবাইল নম্বর দিন" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    // Format phone for auth
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith("01") && formattedPhone.length === 11) {
      formattedPhone = "+88" + formattedPhone;
    } else if (formattedPhone.startsWith("8801")) {
      formattedPhone = "+" + formattedPhone;
    }

    const userEmail = email || `${phone}@student.techhat.local`;

    // Check if user already exists with this phone
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const existingUser = existingUsers?.users.find(
      (u) => u.phone === formattedPhone || u.email === userEmail
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "এই মোবাইল নম্বরে আগে থেকেই অ্যাকাউন্ট আছে। অনুগ্রহ করে লগইন করুন।" },
        { status: 409 }
      );
    }

    // 1. Create student record
    const { data: student, error: studentError } = await supabaseAdmin
      .from("students")
      .insert({
        full_name_en: fullName,
        mobile: phone,
        admission_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (studentError) {
      console.error("Student insert error:", studentError);
      return NextResponse.json({ error: "আবেদন সংরক্ষণে সমস্যা হয়েছে" }, { status: 500 });
    }

    // 2. Create address record (non-fatal)
    await supabaseAdmin.from("student_addresses").insert({
      student_id: student.id,
      address_type: "present",
      village: address,
      division: "—",
      district: "—",
      upazila: "—",
    }).catch((e: Error) => console.warn("Address insert skipped:", e.message));

    // 3. Create guardian (father info, non-fatal)
    await supabaseAdmin.from("guardians").insert({
      student_id: student.id,
      guardian_type: "Father",
      name: fatherName,
      relationship: "Father",
      mobile: phone,
    }).catch((e: Error) => console.warn("Guardian insert skipped:", e.message));

    // 4. Create Auth user with their chosen password
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userEmail,
      phone: formattedPhone,
      password: password,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        full_name: fullName,
        student_id: student.id,
        student_code: student.student_code,
        role: "student",
        selected_course: course,
        selected_shift: shift,
      },
    });

    if (authError) {
      console.error("Auth user creation error:", authError);
      // Still consider it a success - student record was saved
      // Admin can manually link later
    } else if (authData?.user) {
      // Link user_id to student record
      await supabaseAdmin
        .from("students")
        .update({ user_id: authData.user.id })
        .eq("id", student.id);
    }

    // 5. Send Telegram notification
    const message = `🎉 *নতুন ভর্তির আবেদন!*\n\n*নাম:* ${fullName}\n*মোবাইল:* ${phone}\n*কোর্স:* ${course}\n*শিফট:* ${shift}\n*ঠিকানা:* ${address}\n*স্ট্যাটাস:* আবেদন জমা হয়েছে`;
    await sendTelegramNotification(message).catch(() => {/* non-fatal */});

    return NextResponse.json({
      success: true,
      studentId: student.id,
      message: "আবেদন সফলভাবে জমা হয়েছে",
    });
  } catch (error) {
    console.error("Public admission error:", error);
    return NextResponse.json({ error: "সার্ভারে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" }, { status: 500 });
  }
}
