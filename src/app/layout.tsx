import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academic Interview Pro | Learn. Practice. Perform.",
  description:
    "AI-powered preparation platform for Computer Science lecturer job applicants in Pakistan (PPSC, FPSC, KPPSC, SPSC, BPSC, and HEC University Selection Boards).",
  keywords: [
    "PPSC Lecturer Computer Science",
    "FPSC CS Lecturer Preparation",
    "Computer Science Viva Voce",
    "Pakistan CS Lecturer Mock Test",
    "Academic Interview Pro",
    "Higher Education Commission Pakistan",
    "CS Lecturer BPS-17"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#F2F5FA] text-[#101B36] dark:bg-[#0B1120] dark:text-slate-100 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
