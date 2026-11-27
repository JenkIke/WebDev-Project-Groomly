"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth/auth";

export async function authenticate(
  _previousState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === "CredentialsSignin"
        ? "Invalid email or password."
        : "Something went wrong. Please try again.";
    }
    // A successful sign-in redirects by throwing, so it must be re-thrown.
    throw error;
  }
}
