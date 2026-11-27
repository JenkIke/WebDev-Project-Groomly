"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_SERVICES } from "@/lib/default-services";

const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Please enter your name."),
    email: z.string().trim().email("Please enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    inviteCode: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function register(
  _previousState: string | undefined,
  formData: FormData
) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    inviteCode: formData.get("inviteCode") ?? undefined,
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const { name, password, inviteCode } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  // Optional: only enforced when SIGNUP_CODE is set in .env
  const requiredCode = process.env.SIGNUP_CODE;
  if (requiredCode && inviteCode !== requiredCode) {
    return "Invalid invite code.";
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: "STAFF", // new sign-ups are never admins
        // every account starts with its own editable price list
        services: { create: DEFAULT_SERVICES },
      },
    });
  } catch (error) {
    // P2002 = unique constraint (email already used)
    if ((error as { code?: string }).code === "P2002") {
      return "An account with that email already exists.";
    }
    console.error("Sign-up error:", error);
    return "Could not create your account. Please try again.";
  }

  // Log them in straight away.
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Account created. Please sign in.";
    }
    // A successful sign-in redirects by throwing, so it must be re-thrown.
    throw error;
  }
}
