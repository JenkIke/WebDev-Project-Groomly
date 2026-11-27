// Must stay in the project root, next to the app/ folder (Next.js requirement).
// Next.js 16+: file name is proxy.ts
// Next.js 15 or older: rename it to middleware.ts (same contents).
import NextAuth from "next-auth";
import { authConfig } from "./lib/auth/auth.config";

const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  // Protect everything except the auth API, Next.js internals and static images.
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};
