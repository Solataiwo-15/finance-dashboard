// src/app/layout.tsx

import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google"; // Import the Inter font
import "./globals.css";
import { cn } from "@/lib/utils"; // cn is a utility for merging class names
import { ToasterProvider } from "@/components/toaster-provider"; // <-- IMPORT
import { SessionProvider } from "@/components/session-provider"; // <-- IMPORT

// Initialize the font with the 'latin' subset
const kumbh = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // '600' is for SemiBold, '700' is for Bold
});
export const metadata: Metadata = {
  title: "Maglo - Finance Dashboard",
  description: "Manage your finances with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(kumbh.className, "antialiased")}>
        <ToasterProvider /> {/* <-- ADD PROVIDER HERE */}
        <SessionProvider> {children} </SessionProvider>
      </body>
    </html>
  );
}
