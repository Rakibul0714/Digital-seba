import { z } from 'zod';

export const applicationStatus = z.enum(['PENDING', 'IN_REVIEW', 'APPROVED', 'ISSUED', 'REJECTED']);
export const applicantSchema = z.object({
  nid: z.string().min(1, 'এনআইডি নম্বর দিন'),
  fullName: z.string().min(2, 'পূর্ণ নাম দিন'),
  guardianName: z.string().min(2, 'পিতা/স্বামীর নাম দিন'),
  mobile: z.string().regex(/^01[3-9]\d{8}$/, 'সঠিক মোবাইল নম্বর দিন'),
  holdingNo: z.string().optional(),
  unionId: z.string().min(1),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  mobile: z.string().min(11),
  message: z.string().min(5),
});

export type ApplicationStatus = z.infer<typeof applicationStatus>;
export type Applicant = z.infer<typeof applicantSchema>;
export type ContactMessage = z.infer<typeof contactSchema>;
