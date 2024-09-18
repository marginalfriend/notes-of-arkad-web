import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import Loading from "@/loading";
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arkad",
  description: "Personal finance and budgeting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <AuthProvider>
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
