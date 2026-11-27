import type { NextAuthConfig } from "next-auth";

// How long a login lasts. Change this one number to adjust it.
const SESSION_HOURS = 8; // roughly one work day

// Pages anyone can open without being logged in.
const PUBLIC_PATHS = ["/login", "/signup"];

// Edge-safe part of the auth setup: no database or bcrypt imports here,
// because proxy.ts / middleware.ts loads this file.
export const authConfig = {
  pages: { signIn: "/login" },
  session: {
    strategy: "jwt", // required for the Credentials provider
    maxAge: 60 * 60 * SESSION_HOURS,
    updateAge: 60 * 60, // active users get their session extended hourly
  },
  providers: [], // real providers are added in auth.ts
  callbacks: {
    // Runs in proxy.ts on every request that matches its matcher.
    // true = allow, false = redirect to /login.
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = !!auth?.user;
      if (PUBLIC_PATHS.includes(nextUrl.pathname)) {
        // Already signed in? Skip the login / sign-up pages.
        return loggedIn ? Response.redirect(new URL("/", nextUrl)) : true;
      }
      return loggedIn;
    },
    // Copy id + role from the user row into the token, then into the session.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
