import { z } from "zod";

// Helper for exact digit validation
const exactDigits = (length: number, message: string) =>
  z.string().regex(new RegExp(`^\\d{${length}}$`), message).optional().or(z.literal(""));

export const educationSchema = z.object({
  exam: z.string().min(1, "Exam is required"),
  board: z.string().min(1, "Board / University is required"),
  group: z.string().optional(),
  passingYear: z
    .number()
    .min(1990, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  rollNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  resultType: z.string().min(1, "Result type is required"),
  resultValue: z.string().optional(),
}).superRefine((data, ctx) => {
  // GPA max 5.00 for SSC/HSC/BTEB
  if (data.resultType === "Grade" && data.resultValue) {
    const val = parseFloat(data.resultValue);
    const isGpa = ["SSC", "HSC", "BTEB"].includes(data.exam);
    const max = isGpa ? 5.0 : 4.0;
    if (isNaN(val) || val < 0 || val > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${isGpa ? "GPA" : "CGPA"} must be between 0 and ${max}`,
        path: ["resultValue"],
      });
    }
  }
});

export const admissionSchema = z.object({
  // Step 1: Personal Info
  fullNameEn: z.string().min(3, "Full name is required").regex(/^[a-zA-Z\s.-]+$/, "Only English characters are allowed"),
  fullNameBn: z.string().min(3, "Bangla name is required"),
  fatherName: z.string().min(3, "Father name is required"),
  motherName: z.string().min(3, "Mother name is required"),
  gender: z.string().min(1, "Gender is required"),
  religion: z.string().min(1, "Religion is required"),
  dob: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().optional(),
  nationality: z.string().default("Bangladeshi"),
  nid: z.string().optional(),
  birthCertNo: z.string().optional(),
  passportNo: z.string().optional(),
  maritalStatus: z.string().min(1, "Marital status is required"),
  mobile: z.string().min(11, "Valid mobile number is required"),
  guardianMobile: z.string().min(11, "Valid guardian mobile is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  emergencyContact: z.string().optional(),

  // Step 2: Address
  presentDivision: z.string().min(1, "Division is required"),
  presentDistrict: z.string().min(1, "District is required"),
  presentUpazila: z.string().min(1, "Upazila/Thana is required"),
  presentUnion: z.string().optional(),
  presentPostOffice: z.string().optional(),
  presentPostCode: z.string().optional(),
  presentVillage: z.string().min(1, "Village/Road/House is required"),

  // Step 3: Education
  education: z.array(educationSchema).optional(),

  // Step 5: Course Info
  courseId: z.string().optional(),
  courseMode: z.string().optional(),
  batchId: z.string().optional(),
  shift: z.string().optional(),
  wantsCertificate: z.boolean().optional(),
  discount: z.number().optional(),
  scholarship: z.number().optional(),
  referral: z.string().optional(),
  sourceOfAdmission: z.string().optional(),

  // Step 6: Guardian Info
  guardianType: z.string().min(1, "Guardian type is required"),
  guardianName: z.string().min(1, "Guardian name is required"),
  guardianOccupation: z.string().optional(),
  guardianIncome: z.number().optional(),
  guardianRelationship: z.string().min(1, "Relationship is required"),

  // Step 7: Documents
  photoUrl: z.string().min(1, "Student photo is required"),
  nidUrl: z.string().optional(),
  certificateUrl: z.string().optional(),
  signatureUrl: z.string().optional(),

  // Step 9: Declaration
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
});

export type AdmissionFormValues = z.infer<typeof admissionSchema>;
export type EducationFormValues = z.infer<typeof educationSchema>;
