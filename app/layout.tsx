import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        {session ? (
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
              <SidebarTrigger className="md:hidden" />
              {children}
            </main>
          </SidebarProvider>
        ) : (
          // Logged out: only /login and /signup are reachable, so no sidebar.
          <main className="flex-1">{children}</main>
        )}
      </body>
    </html>
  );
}