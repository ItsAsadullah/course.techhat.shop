export interface Course {
  id: string;
  name: string;
  title?: string;
  duration?: string;
  fee?: number;
  created_at: string;
  updated_at?: string;
}

export interface Student {
  id: string;
  full_name_en: string | null;
  full_name_bn?: string | null;
  mobile: string;
  email?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  gender?: string | null;
  religion?: string | null;
  dob?: string | null;
  blood_group?: string | null;
  nationality?: string | null;
  nid?: string | null;
  birth_cert_no?: string | null;
  marital_status?: string | null;
  guardian_mobile?: string | null;
  admission_id?: string | null;
  admission_date?: string | null;
  total_course_fee: number;
  user_id?: string | null;
  created_at: string;
  updated_at?: string;

  student_code?: string | null;
  // Computed / joined
  name?: string; // alias for full_name_en for backward compat
  phone?: string; // alias for mobile
  address?: string | null;
  photo_url?: string | null;
  registration_no?: string | null;
  course?: { name: string; thumbnail?: string | null } | null;
  batch_name?: string | null;
  status?: string | null;
  guardian_name?: string | null;
  student_id?: string | null;
  total_paid?: number;
  current_due?: number;
  payments?: Payment[];
  enrollments?: AdminEnrollment[];
  financial_summary?: StudentFinancialSummary;

  // Deep relations (for detail views)
  student_addresses?: any[];
  guardians?: any[];
  student_education?: any[];
  student_documents?: any[];
}

export interface Payment {
  id: string;
  student_id: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  remarks: string | null;
  order_id?: string | null;
  enrollment_id?: string | null;
  transaction_id?: string | null;
  reference?: string | null;
  received_by?: string | null;
  created_at: string;
  updated_at?: string;
  student?: Student | null;
  enrollment?: AdminEnrollment | null;
}

export type EnrollmentStatus = "pending" | "active" | "completed" | "suspended" | "cancelled";
export type EnrollmentSource = "public_checkout" | "admin_direct" | "admission" | "manual_import";

export interface AdminEnrollment {
  id: string;
  student_id: string;
  user_id: string | null;
  course_id: string;
  batch_id: string | null;
  shift_id?: string | null;
  certificate_type?: string | null;
  enrollment_code?: string | null;
  status: EnrollmentStatus;
  source: EnrollmentSource | string | null;
  enrolled_at: string;
  start_date: string | null;
  completed_at: string | null;
  course_fee: number;
  discount_amount: number;
  final_fee: number;
  progress: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  total_paid: number;
  current_due: number;
  payment_progress: number;
  course_name?: string;
  course_name_bn?: string | null;
  batch_name?: string | null;
}

export interface AdminEnrollmentListItem extends AdminEnrollment {
  student_name: string;
  student_mobile: string | null;
  student_photo?: string | null;
  student_reg_no?: string | null;
  course_thumbnail?: string | null;
}

export interface EnrollmentPayment extends Payment {
  enrollment?: AdminEnrollment | null;
}

export interface StudentFinancialSummary {
  total_enrollment_fees: number;
  total_paid: number;
  current_due: number;
  payment_progress: number;
  active_enrollment_count: number;
}

export interface EnrollmentPaymentOption {
  id: string;
  student_id: string;
  course_name: string;
  batch_name: string | null;
  status: EnrollmentStatus;
  final_fee: number;
  total_paid: number;
  current_due: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalRevenue: number;
  totalDues: number;
}
