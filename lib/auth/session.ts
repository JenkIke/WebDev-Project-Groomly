import { redirect } from "next/navigation";
import { auth } from "./auth";

// For pages and server components: returns the logged-in user,
// or sends the visitor to /login.
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

// For API route handlers: returns the user's id, or null.
// Always filter queries with it:  where: { ownerId: userId }
export async function getUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}
