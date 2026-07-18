import { z } from "zod";

const money = z.coerce.number().finite().min(0, "Amount cannot be negative");

export const enrollmentStatusSchema = z.enum([
  "pending",
  "active",
  "completed",
  "suspended",
  "cancelled",
]);

export const adminEnrollmentSchema = z
  .object({
    studentId: z.string().uuid(),
    courseId: z.string().uuid(),
    batchId: z.string().uuid().nullable().optional(),
    shiftId: z.string().uuid().nullable().optional(),
    enrollmentDate: z.string().min(1, "Enrollment date is required"),
    startDate: z.string().nullable().optional(),
    status: enrollmentStatusSchema,
    courseFee: money,
    overrideCourseFee: z.boolean().default(false),
    feeOverrideReason: z.string().trim().nullable().optional(),
    certificateType: z.enum(["none", "institute", "board"]).default("none"),
    boardRegistrationRequired: z.boolean().optional(),
    instituteCertificateFee: money.optional(),
    boardRegistrationFee: money.optional(),
    boardCertificateFee: money.optional(),
    discountType: z.enum(["fixed", "percentage"]),
    discountValue: money,
    initialPaidAmount: money,
    paymentMethod: z.string().trim().nullable().optional(),
    paymentDate: z.string().nullable().optional(),
    transactionId: z.string().trim().max(120).nullable().optional(),
    reference: z.string().trim().max(250).nullable().optional(),
    remarks: z.string().trim().max(1000).nullable().optional(),
  })
  .superRefine((value, context) => {
    if (value.discountType === "percentage" && value.discountValue > 100) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%",
      });
    }

    const discountAmount =
      value.discountType === "percentage"
        ? (value.courseFee * value.discountValue) / 100
        : value.discountValue;

    let certFee = 0;
    if (value.certificateType === "institute") {
      certFee = value.instituteCertificateFee || 0;
    } else if (value.certificateType === "board") {
      certFee = (value.boardRegistrationFee || 0) + (value.boardCertificateFee || 0);
    }
    const finalFee = value.courseFee + certFee - discountAmount;

    if (discountAmount > value.courseFee) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Discount cannot exceed course fee",
      });
    }

    if (value.initialPaidAmount > finalFee) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["initialPaidAmount"],
        message: "Paid amount cannot exceed final fee",
      });
    }

    if (value.initialPaidAmount > 0) {
      if (!value.paymentMethod) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentMethod"],
          message: "Payment method is required when recording a payment",
        });
      }
      if (!value.paymentDate) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentDate"],
          message: "Payment date is required when recording a payment",
        });
      }
    }

    if (value.overrideCourseFee && !value.feeOverrideReason) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["feeOverrideReason"],
        message: "Reason is required when overriding the default course fee",
      });
    }

    if (value.certificateType === "none" && value.boardRegistrationRequired) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["certificateType"],
        message: "Board Registration is required for this course",
      });
    }
  });

export type AdminEnrollmentFormValues = z.infer<typeof adminEnrollmentSchema>;
