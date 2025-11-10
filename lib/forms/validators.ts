import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  date: z.string().min(1, "Date is required"),
  guests: z
    .string()
    .min(1, "Number of guests is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Guests must be a positive number",
    }),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

