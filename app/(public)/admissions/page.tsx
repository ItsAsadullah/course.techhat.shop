import PublicAdmissionForm from "@/components/home/PublicAdmissionForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ভর্তি হোন | TechHat IT Institute",
  description: "TechHat IT Institute-এ ভর্তির আবেদন করুন। কম্পিউটার প্রশিক্ষণ কোর্সে আজই যোগ দিন।",
};

export default function AdmissionsPage() {
  return <PublicAdmissionForm />;
}
