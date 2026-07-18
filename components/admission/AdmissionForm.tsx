"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { admissionSchema, AdmissionFormValues } from "@/lib/schema/admission.schema";
import { useLang } from "@/context/GlobalLangContext";
import { admissionTranslations, AdmissionTKey } from "@/lib/i18n/admission";
import StickySidebar from "./StickySidebar";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import AddressSection from "./sections/AddressSection";
import EducationSection from "./sections/EducationSection";
import GuardianSection from "./sections/GuardianSection";
import DocumentsSection from "./sections/DocumentsSection";

import DeclarationSection from "./sections/DeclarationSection";

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { submitAdmissionForm } from "@/lib/actions/admission";
import { toast } from "sonner";

const SECTIONS = [
  { id: "personal", key: "sec_personal" as AdmissionTKey, fields: ["fullNameEn", "fullNameBn", "fatherName", "motherName", "gender", "religion", "dob", "maritalStatus", "mobile"] },
  { id: "present-address", key: "sec_present_addr" as AdmissionTKey, fields: ["presentDivision", "presentDistrict", "presentUpazila", "presentVillage"] },
  { id: "education", key: "sec_education" as AdmissionTKey, fields: ["education.0.exam", "education.0.board", "education.0.resultType"] },
  { id: "guardian", key: "sec_guardian" as AdmissionTKey, fields: ["guardianType", "guardianName", "guardianMobile", "guardianRelationship"] },
  { id: "documents", key: "sec_docs" as AdmissionTKey, fields: ["photoUrl"] },
  { id: "declaration", key: "sec_declaration" as AdmissionTKey, fields: ["termsAccepted"] },
];

export default function AdmissionForm({ initialData }: { initialData?: any }) {
  const { lang } = useLang();
  const t = (key: AdmissionTKey) => admissionTranslations[lang][key];
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const methods = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema) as any,
    defaultValues: {
      nationality: "Bangladeshi",
      education: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      // Map initialData (which is Supabase DB format) to form format
      methods.reset({
        fullNameEn: initialData.full_name_en || "",
        fullNameBn: initialData.full_name_bn || "",
        fatherName: initialData.father_name || "",
        motherName: initialData.mother_name || "",
        gender: initialData.gender as any || undefined,
        religion: initialData.religion as any || undefined,
        dob: initialData.dob || "",
        bloodGroup: initialData.blood_group as any || undefined,
        nationality: initialData.nationality || "Bangladeshi",
        nid: initialData.nid || "",
        birthCertNo: initialData.birth_cert_no || "",
        passportNo: initialData.passport_no || "",
        maritalStatus: initialData.marital_status as any || undefined,
        mobile: initialData.mobile || "",
        guardianMobile: initialData.guardian_mobile || "",
        email: initialData.email || "",
        emergencyContact: initialData.emergency_contact || "",
        
        education: initialData.student_education?.length > 0 
          ? initialData.student_education.map((edu: any) => ({
              exam: edu.exam_name || "",
              board: edu.board || "",
              group: edu.group_subject || "",
              passingYear: Number(edu.passing_year) || new Date().getFullYear(),
              rollNumber: edu.roll_no || "",
              registrationNumber: edu.registration_no || "",
              resultType: edu.result_type || "",
              resultValue: edu.result_value || "",
            }))
          : [],
        
        // Mocking address and other relations since we didn't fetch them all deep
        presentDivision: initialData.present_division || "",
        presentDistrict: initialData.present_district || "",
        presentUpazila: initialData.present_upazila || "",
        presentUnion: initialData.present_union || "",
        presentVillage: initialData.present_village || "",
        presentPostOffice: initialData.present_post_office || "",
        presentPostCode: initialData.present_post_code || "",
        courseId: initialData.admissions?.[0]?.course_id || "",
        batchId: initialData.admissions?.[0]?.batch_id || "",
        shift: initialData.admissions?.[0]?.shift || undefined,
        sourceOfAdmission: initialData.admissions?.[0]?.source_of_admission as any || undefined,
        
        guardianName: initialData.guardian_name || "",
        guardianOccupation: initialData.guardian_occupation || "",
        guardianType: "Father",
        guardianRelationship: "Father",
        
        photoUrl: initialData.student_documents?.find((doc: any) => doc.document_type === "photo")?.file_url || "",
        nidUrl: initialData.student_documents?.find((doc: any) => doc.document_type === "nid")?.file_url || "",
        termsAccepted: true,
        courseMode: "offline",
      });
    }
  }, [initialData, methods]);

  // Intersection Observer to update active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -40% 0px", threshold: 0 } 
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    // Fallback for bottom of page
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onSubmit = async (data: AdmissionFormValues) => {
    try {
      let result;
      if (initialData && initialData.id) {
        const { updateAdmissionForm } = await import("@/lib/actions/admission");
        result = await updateAdmissionForm(initialData.id, data);
      } else {
        result = await submitAdmissionForm(data);
      }

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          if (pathname.startsWith("/admin")) {
            router.push(`/admin/students/${initialData?.id}`);
          } else if (initialData) {
            router.push("/dashboard/profile");
          } else {
            router.push("/dashboard");
          }
        }, 2000);
      } else {
        toast.error(result.error || "Failed to submit form");
      }
    } catch (e: any) {
      toast.error("An unexpected error occurred");
      console.error(e);
    }
  };

  const onError = (errors: any) => {
    console.log("Validation Errors:", errors);
    
    // Extract error messages from the nested errors object
    const getErrorMessages = (obj: any, prefix = ""): string[] => {
      let messages: string[] = [];
      for (const key in obj) {
        if (obj[key] && obj[key].message) {
          messages.push(`${prefix}${key}: ${obj[key].message}`);
        } else if (typeof obj[key] === "object") {
          messages = [...messages, ...getErrorMessages(obj[key], `${prefix}${key}.`)];
        }
      }
      return messages;
    };
    
    const errorMessages = getErrorMessages(errors);
    const details = errorMessages.join(", ");
    
    toast.error("Validation failed! Missing or invalid fields.", {
      description: details,
      duration: 10000,
    });
  };

  return (
    <div className="w-full mx-auto">
      <FormProvider {...methods}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sticky Sidebar Navigation */}
          <StickySidebar sections={SECTIONS} activeSection={activeSection} />

          {/* Main Form Content */}
          <div className="flex-1 min-w-0">
            <form onSubmit={methods.handleSubmit(onSubmit as any, onError)} className="space-y-8">
              
              <PersonalInfoSection id="personal" />
              
              <AddressSection id="present-address" />
              
              <EducationSection id="education" />
              
              <GuardianSection id="guardian" />
              
              <DocumentsSection id="documents" />
              
              <DeclarationSection id="declaration" />

              {/* Submit Buttons */}
              <div className="sticky bottom-4 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <Button type="button" variant="outline" className="rounded-xl px-6">
                  {t("save_draft")}
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={methods.formState.isSubmitting}
                  className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  {methods.formState.isSubmitting ? t("submitting") : t("submit")}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </FormProvider>

      {/* Success Popup Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center max-w-sm w-full border border-slate-200 dark:border-slate-800"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {initialData ? "প্রোফাইল আপডেট সফল!" : "আবেদন সফল!"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {initialData ? "আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে। রিডাইরেক্ট করা হচ্ছে..." : "আপনার আবেদনটি সফলভাবে জমা দেওয়া হয়েছে। রিডাইরেক্ট করা হচ্ছে..."}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
