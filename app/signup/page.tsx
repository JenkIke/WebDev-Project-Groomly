import { SignupForm } from "./signup-form";

export default function SignupPage() {
  // Server component: reads .env, so the code itself never reaches the browser.
  const needsCode = Boolean(process.env.SIGNUP_CODE);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <SignupForm needsCode={needsCode} />
    </main>
  );
}
