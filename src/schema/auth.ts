import { z } from "zod";

export const SignupSchema = z.object({
    username: z.string().min(1, { message: "Username cannot be empty" }).trim(),
    email: z
        .string()
        .email({ message: "Please enter a valid email address" })
        .trim()
        .transform((val) => val.toLowerCase()),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(128)
        .trim(),
});

export const LoginSchema = z.object({
    email: z
        .string()
        .email({ message: "Please enter a valid email address" })
        .trim()
        .transform((val) => val.toLowerCase()),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(128)
        .trim(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
