import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ToasterProvider } from "@/components/toaster-provider";
import { SessionProvider } from "@/components/session-provider";

const kumbh = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        <ToasterProvider />
        <SessionProvider> {children} </SessionProvider>
      </body>
    </html>
  );
}
