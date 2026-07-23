"use server";

import { createServerClient } from "@/lib/supabase-server";
import { AdmissionFormValues } from "@/lib/schema/admission.schema";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramNotification } from "@/lib/telegram";

export async function submitAdmissionForm(data: AdmissionFormValues) {
  try {
    const supabase = await createServerClient();

    // 1. Create Admission Record
    const admissionId = `ADM-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Check if courseId is a valid UUID
    const isValidUUID = (id?: string) => id ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) : false;
    const safeCourseId = isValidUUID(data.courseId) ? data.courseId : null;
    const fallbackSource = !isValidUUID(data.courseId) ? data.courseId : data.sourceOfAdmission;

    const { data: admission, error: admissionError } = await supabase
      .from("admissions")
      .insert({
        admission_id: admissionId,
        course_id: safeCourseId,
        batch_id: data.batchId || null,
        shift: data.shift || null,
        discount: data.discount || 0,
        scholarship: data.scholarship || 0,
        referral: data.referral || null,
        source_of_admission: fallbackSource || null,
        status: "pending_payment",
        admission_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (admissionError) throw new Error(`Admission Error: ${admissionError.message}`);

    // 2. Create Student Record
    const { data: student, error: studentError } = await supabase
      .from("students")
      .insert({
        admission_id: admission.id,
        full_name_en: data.fullNameEn,
        full_name_bn: data.fullNameBn,
        father_name: data.fatherName,
        mother_name: data.motherName,
        gender: data.gender,
        religion: data.religion,
        dob: data.dob,
        blood_group: data.bloodGroup || null,
        nationality: data.nationality || 'Bangladeshi',
        nid: data.nid || null,
        birth_cert_no: data.birthCertNo || null,
        passport_no: data.passportNo || null,
        marital_status: data.maritalStatus,
        mobile: data.mobile,
        guardian_mobile: data.guardianMobile,
        email: data.email || null,
        emergency_contact: data.emergencyContact || null,
      })
      .select()
      .single();

    if (studentError) throw new Error(`Student Error: ${studentError.message}`);

    // Auto-Registration Logic (Create User Account)
    try {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const userEmail = data.email || `${data.mobile}@student.techhat.local`;
      // Use the user-provided password if available (public form), otherwise default to mobile
      const defaultPassword = (data.password && data.password.trim().length >= 6) ? data.password : data.mobile;

      // Check if user is currently logged in
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      let targetUserId = currentUser?.id;

      if (!targetUserId) {
        // If not logged in, check if user exists by email/phone
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const userExists = existingUsers?.users.find(u => u.email === userEmail || u.phone === data.mobile);
        targetUserId = userExists?.id;
      }

      if (!targetUserId) {
        let formattedPhone = data.mobile.trim();
        if (formattedPhone.startsWith("01") && formattedPhone.length === 11) {
          formattedPhone = "+88" + formattedPhone;
        } else if (formattedPhone.startsWith("8801")) {
          formattedPhone = "+" + formattedPhone;
        }

        const { error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userEmail,
          phone: formattedPhone,
          password: defaultPassword,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: {
            full_name: data.fullNameEn,
            student_id: student.id,
            role: "student"
          }
        });

        if (authError) {
          console.error("Auto-Registration Auth Error:", authError);
          // Non-fatal, admission still succeeds
        }
      } else {
        // User already exists (either they logged in or already registered)
        // Update their user_metadata to link this new student_id
        const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(targetUserId);
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          targetUserId,
          {
            user_metadata: {
              ...(existingUser?.user?.user_metadata || {}),
              student_id: student.id,
              role: existingUser?.user?.user_metadata?.role || "student" // preserve role
            }
          }
        );

        if (updateError) {
          console.error("Failed to link student_id to existing user:", updateError);
        }
      }
    } catch (autoRegErr) {
      console.error("Auto-registration exception:", autoRegErr);
    }

    // 3. Create Addresses
    const { error: addressError } = await supabase
      .from("student_addresses")
      .insert({
        student_id: student.id,
        address_type: "present",
        division: data.presentDivision,
        district: data.presentDistrict,
        upazila: data.presentUpazila,
        union_municipality: data.presentUnion || null,
        post_office: data.presentPostOffice || null,
        post_code: data.presentPostCode || null,
        village: data.presentVillage,
      });

    if (addressError) console.error("Address Error:", addressError); // Non-fatal

    // 4. Create Education Records
    if (data.education && data.education.length > 0) {
      const educationPayload = data.education.map(edu => ({
        student_id: student.id,
        exam_name: edu.exam,
        board: edu.board,
        passing_year: edu.passingYear,
        roll_no: edu.rollNumber || null,
        registration_no: edu.registrationNumber || null,
        group_subject: edu.group || null,
        result_type: edu.resultType,
        result_value: edu.resultValue,
      }));

      const { error: eduError } = await supabase
        .from("student_education")
        .insert(educationPayload);

      if (eduError) console.error("Education Error:", eduError);
    }

    // 5. Create Guardian
    const { error: guardianError } = await supabase
      .from("guardians")
      .insert({
        student_id: student.id,
        guardian_type: data.guardianType,
        name: data.guardianName,
        occupation: data.guardianOccupation || null,
        monthly_income: data.guardianIncome || null,
        mobile: data.guardianMobile,
        relationship: data.guardianRelationship,
      });

    if (guardianError) console.error("Guardian Error:", guardianError);

    // 6. Create Documents
    const docsPayload = [];
    if (data.photoUrl) {
      docsPayload.push({
        student_id: student.id,
        document_type: "photo",
        file_url: data.photoUrl
      });
    }
    if (data.nidUrl) {
      docsPayload.push({
        student_id: student.id,
        document_type: "nid",
        file_url: data.nidUrl
      });
    }

    if (docsPayload.length > 0) {
      const { error: docError } = await supabase
        .from("student_documents")
        .insert(docsPayload);

      if (docError) console.error("Document Error:", docError);
    }

    // 7. Skip medical info — fields removed from form schema
    // Medical info can be collected separately if needed

    // 8. Declaration
    const { error: decError } = await supabase
      .from("declarations")
      .insert({
        admission_id: admission.id,
        terms_accepted: data.termsAccepted,
        privacy_accepted: data.termsAccepted,
      });

    if (decError) console.error("Declaration Error:", decError);

    // Legacy dual-write removed — unified students table is now the single source of truth

    revalidatePath("/admin/students");

    // Send Telegram Notification
    const message = `🎉 *New Admission Submitted!*\n\n*Name:* ${data.fullNameEn}\n*Course:* ${data.courseId}\n*Mobile:* ${data.mobile}\n*Status:* Pending - Will proceed to checkout`;
    await sendTelegramNotification(message);

    return { success: true, admissionId: admission.admission_id, studentId: student.id };
  } catch (error: any) {
    console.error("Submit Form Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAdmissionForm(studentId: string, data: AdmissionFormValues) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Update Student Record
    const { error: studentError } = await supabase
      .from("students")
      .update({
        full_name_en: data.fullNameEn,
        full_name_bn: data.fullNameBn,
        father_name: data.fatherName,
        mother_name: data.motherName,
        gender: data.gender,
        religion: data.religion,
        dob: data.dob,
        blood_group: data.bloodGroup || null,
        nationality: data.nationality || 'Bangladeshi',
        nid: data.nid || null,
        birth_cert_no: data.birthCertNo || null,
        passport_no: data.passportNo || null,
        marital_status: data.maritalStatus,
        mobile: data.mobile,
        guardian_mobile: data.guardianMobile,
        email: data.email || null,
        emergency_contact: data.emergencyContact || null,
      })
      .eq("id", studentId);

    if (studentError) throw new Error(`Student Error: ${studentError.message}`);

    // 2. Update Education Records (Delete and Recreate)
    if (data.education && data.education.length > 0) {
      // First delete existing
      await supabase.from("student_education").delete().eq("student_id", studentId);

      // Then insert new
      const educationPayload = data.education.map(edu => ({
        student_id: studentId,
        exam_name: edu.exam,
        board: edu.board,
        passing_year: edu.passingYear,
        roll_no: edu.rollNumber || null,
        registration_no: edu.registrationNumber || null,
        group_subject: edu.group || null,
        result_type: edu.resultType,
        result_value: edu.resultValue,
      }));

      const { error: eduError } = await supabase
        .from("student_education")
        .insert(educationPayload);

      if (eduError) console.error("Education Update Error:", eduError);
    }

    // 3. Update Address Records
    await supabase.from("student_addresses").delete().eq("student_id", studentId);

    const { error: addressError } = await supabase
      .from("student_addresses")
      .insert({
        student_id: studentId,
        address_type: "present",
        division: data.presentDivision,
        district: data.presentDistrict,
        upazila: data.presentUpazila,
        village: data.presentVillage,
        union_municipality: data.presentUnion || null,
        post_office: data.presentPostOffice || null,
        post_code: data.presentPostCode || null,
      });

    if (addressError) {
      console.error("Address Update Error:", addressError);
      throw new Error(`Address Update Error: ${addressError.message}`);
    }

    // 4. Update Guardian Records
    await supabase.from("guardians").delete().eq("student_id", studentId);

    const { error: guardianError } = await supabase
      .from("guardians")
      .insert({
        student_id: studentId,
        guardian_type: data.guardianType,
        name: data.guardianName,
        occupation: data.guardianOccupation || null,
        monthly_income: data.guardianIncome || null,
        mobile: data.guardianMobile,
        relationship: data.guardianRelationship,
      });

    if (guardianError) console.error("Guardian Update Error:", guardianError);

    // 5. Update Documents Records
    await supabase.from("student_documents").delete().eq("student_id", studentId);
    
    const docsPayload = [];
    if (data.photoUrl) {
      docsPayload.push({
        student_id: studentId,
        document_type: "photo",
        file_url: data.photoUrl
      });
    }
    if (data.nidUrl) {
      docsPayload.push({
        student_id: studentId,
        document_type: "nid",
        file_url: data.nidUrl
      });
    }

    if (docsPayload.length > 0) {
      const { error: docError } = await supabase
        .from("student_documents")
        .insert(docsPayload);
      if (docError) console.error("Document Update Error:", docError);
    }

    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { success: false, error: error.message };
  }
}

export async function enrollExistingStudent(studentId: string, courseId: string, courseMode: string, shift: string) {
  try {
    const supabase = await createServerClient();

    // 1. Fetch current student record
    const { data: student, error: fetchError } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single();

    if (fetchError || !student) throw new Error("Student not found");

    // 2. Create Admission Record
    const admissionId = "ADM-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0");

    const { data: admission, error: admissionError } = await supabase
      .from("admissions")
      .insert({
        admission_id: admissionId,
        course_id: courseId,
        shift: shift || null,
        status: "pending_payment",
        admission_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (admissionError) throw new Error("Admission Error: " + admissionError.message);

    // 3. Create a NEW Students record for this admission, copying old data
    const newStudentData = { ...student };
    delete newStudentData.id;
    delete newStudentData.created_at;
    delete newStudentData.updated_at;
    newStudentData.admission_id = admission.id;

    const { error: newStudentError } = await supabase
      .from("students")
      .insert(newStudentData);

    if (newStudentError) throw new Error("Student Copy Error: " + newStudentError.message);

    revalidatePath("/dashboard/courses");

    return { success: true };
  } catch (error: any) {
    console.error("Enroll existing student error:", error);
    return { success: false, error: error.message };
  }
}
