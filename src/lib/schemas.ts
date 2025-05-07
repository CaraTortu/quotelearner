import { z } from "zod";

/**
 * This file contains shared schemas across the client and server
 * This is useful in form validation
 */

/**
 * Schema for password verification of requirements
 * - It must be at least 8 characters long
 * - It must contain at least one number
 * - It must contain at least one uppercase letter
 * - It must contain at least one lowercase letter
 */
export const passwordVerificationSchema = z
    .string()
    .min(1, "Password is required")
    .superRefine((data, ctx) => {
        // Check length
        if (data.length < 8) {
            ctx.addIssue({
                code: "custom",
                message: "Password must be at least 8 characters",
            });
        }

        // Check numbers
        if (!/[0-9]/.test(data)) {
            ctx.addIssue({
                code: "custom",
                message: "Password must contain at least one number",
            });
        }

        // Check uppercase letters
        if (!/[A-Z]/.test(data)) {
            ctx.addIssue({
                code: "custom",
                message: "Password must contain at least one uppercase letter",
            });
        }

        // Check lowercase letters
        if (!/[a-z]/.test(data)) {
            ctx.addIssue({
                code: "custom",
                message: "Password must contain at least one lowercase letter",
            });
        }
    });

/**
 * Schema for user registration form validation
 * - Contains an email, name and password
 */
export const registrationSchema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    password: passwordVerificationSchema,
});

/**
 * Schema for updating users
 */
export const updateUserSchema = z.object({
    id: z.string().nonempty("ID is required"),
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email address"),
    emailVerified: z.boolean(),
    image: z.string().url("Image URL is invalid").nullable(),
    role: z.enum(["user", "admin"]),
});
