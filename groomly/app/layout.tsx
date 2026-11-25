import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en" className={cn("font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
