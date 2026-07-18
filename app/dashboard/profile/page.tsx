import { createClient } from "@/lib/admin/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, CheckCircle2, Edit3, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let studentId = user.user_metadata?.student_id;

  // Force-fetch fresh metadata to bypass stale JWT cookies
  try {
    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: adminUser } = await supabaseAdmin.auth.admin.getUserById(user.id);
    if (adminUser?.user?.user_metadata?.student_id) {
      studentId = adminUser.user.user_metadata.student_id;
    }
  } catch (err) {
    console.error("Error fetching fresh user metadata", err);
  }

  // Fallback: Check if there's a student record with matching email or phone
  if (!studentId) {
    const { data: matchedStudent } = await supabase
      .from("students")
      .select("id")
      .or(`email.eq.${user.email},mobile.eq.${user.phone?.replace('+88', '')},mobile.eq.${user.phone}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (matchedStudent) {
      studentId = matchedStudent.id;
    }
  }

  if (!studentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Profile Found</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          You have not completed your admission form yet. Please fill it out to create your student profile.
        </p>
        <Link 
          href="/dashboard/admission"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-500/25"
        >
          <CheckCircle2 className="w-5 h-5" />
          Fill Admission Form
        </Link>
      </div>
    );
  }

  // Fetch student data
  const { data: rawStudent, error } = await supabase
    .from("students")
    .select("*, admissions(*), student_addresses(*), guardians(*), student_documents(*), student_education(*)")
    .eq("id", studentId)
    .single();

  if (error || !rawStudent) {
    return (
      <div className="p-8 text-center text-red-500">Error loading profile data: {error?.message}</div>
    );
  }

  const presentAddr = rawStudent.student_addresses?.find((a: any) => a.address_type === "present") || {};
  const permanentAddr = rawStudent.student_addresses?.find((a: any) => a.address_type === "permanent") || {};
  
  const student = {
    ...rawStudent,
    present_village: presentAddr.village,
    present_union: presentAddr.union_municipality,
    present_thana: presentAddr.upazila,
    present_district: presentAddr.district,
    permanent_village: permanentAddr.village,
    permanent_union: permanentAddr.union_municipality,
    permanent_thana: permanentAddr.upazila,
    permanent_district: permanentAddr.district,
  };

  const photoDoc = rawStudent.student_documents?.find((doc: any) => doc.document_type === "photo");
  const photoUrl = photoDoc?.file_url;
  const educationList = rawStudent.student_education || [];
  const guardiansList = rawStudent.guardians || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        <div className="h-32 md:h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 -mt-16 md:-mt-20">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-5xl font-bold shadow-lg text-slate-400 overflow-hidden relative">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                student.full_name_en?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="text-center md:text-left mb-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{student.full_name_en}</h1>
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-2">{student.full_name_bn}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">Student ID: {student.id.substring(0,8).toUpperCase()}</Badge>
                {student.blood_group && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">Blood Group: {student.blood_group}</Badge>
                )}
              </div>
            </div>
          </div>
          
          <Link 
            href="/dashboard/admission"
            className="shrink-0 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-colors w-full md:w-auto"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Contact & Basic Info */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> Basic Information
            </h3>
            <ul className="space-y-5">
              <li>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Father's Name</span>
                <span className="font-semibold text-slate-900 dark:text-white">{student.father_name || "N/A"}</span>
              </li>
              <li>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Mother's Name</span>
                <span className="font-semibold text-slate-900 dark:text-white">{student.mother_name || "N/A"}</span>
              </li>
              <li>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Gender & Religion</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">{student.gender || "N/A"} • {student.religion || "N/A"}</span>
              </li>
              <li>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Birth</span>
                <span className="font-semibold text-slate-900 dark:text-white">{student.dob || "N/A"}</span>
              </li>
              <li>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Marital Status</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">{student.marital_status || "N/A"}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-500" /> Contact Details
            </h3>
            <ul className="space-y-5">
              <li>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Mobile</span>
                <span className="font-semibold text-slate-900 dark:text-white">{student.mobile || "N/A"}</span>
              </li>
              <li>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Guardian Mobile</span>
                <span className="font-semibold text-slate-900 dark:text-white">{student.guardian_mobile || "N/A"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Addresses, Education, Documents */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" /> Address Information
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Address Type</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Village / Area</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Union / Municipality</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Upazila / Thana</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">District</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider">Present Address</td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{student.present_village || "N/A"}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{student.present_union || "N/A"}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{student.present_thana || "N/A"}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{student.present_district || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Identity Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">NID Number</span>
                <span className="font-bold text-slate-900 dark:text-white">{student.nid || "Not provided"}</span>
              </div>
            </div>
          </div>

          {educationList.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500" /> Educational Qualifications
              </h3>
              <div className="space-y-4">
                {educationList.map((edu: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{edu.exam_name}</h4>
                        <p className="text-sm font-medium text-slate-500">{edu.board}</p>
                      </div>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 self-start md:self-auto">
                        Passing Year: {edu.passing_year}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Group/Subject</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{edu.group_subject || "N/A"}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Result</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{edu.result_value} ({edu.result_type})</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Roll No</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{edu.roll_no || "N/A"}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Reg No</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{edu.registration_no || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {guardiansList.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" /> Guardian Information
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Relationship</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guardiansList.map((guardian: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {guardian.name}
                          {guardian.guardian_type && (
                            <Badge variant="outline" className="ml-2 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20 capitalize text-[10px] px-1.5">
                              {guardian.guardian_type}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{guardian.relationship || "N/A"}</td>
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{guardian.mobile || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
