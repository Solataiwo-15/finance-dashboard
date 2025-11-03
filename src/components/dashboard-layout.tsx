// src/components/dashboard-layout.tsx (V6 - Smart & Dynamic)

"use client"; // This component now needs to be a client component for the hook

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // <-- Import the hook
import {
  Home,
  LineChart,
  Package,
  Settings,
  HelpCircle,
  LogOut as LogoutIcon,
  Search,
  Bell,
  Wallet,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { UserNav } from "./user-nav";
import { cn } from "@/lib/utils"; // For combining class names

// --- UPDATED: Now accepts a 'title' prop ---
export function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname(); // Get the current URL path (e.g., '/', '/invoices')
  const handleLogout = () => {
    alert("Logout clicked!");
  };

  // Define our navigation links in an array for easier mapping
  const navLinks = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "#", label: "Transactions", icon: LineChart },
    { href: "/invoices", label: "Invoices", icon: Package },
    { href: "#", label: "My Wallets", icon: Wallet },
    { href: "#", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-full">
      <aside className="hidden md:flex h-full w-[220px] lg:w-[280px] flex-col fixed inset-y-0 left-0 z-10 bg-gray-50">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src="/logo.png" alt="Maglo Logo" width={100} height={20} />
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {/* --- Map over the links to create them dynamically --- */}
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                      isActive
                        ? "bg-[#C8EE44] text-primary font-semibold" // Active styles
                        : "text-muted-foreground hover:text-primary" // Inactive styles
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
            {/* ... Help and Logout section (no change) ... */}
            <nav className="grid items-start text-sm font-medium">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <HelpCircle className="h-4 w-4" /> Help
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogoutIcon className="mr-2 h-4 w-4" /> Logout
              </Button>
            </nav>
          </div>
        </div>
      </aside>

      <div className="flex flex-col md:pl-[220px] lg:pl-[280px]">
        <header className="flex h-14 items-center justify-between gap-4 bg-white px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10 shadow-sm">
          {/* Left Side: Contains Mobile Menu and the (conditionally hidden) Title */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <Image
                      src="/logo.png"
                      alt="Maglo Logo"
                      width={100}
                      height={20}
                    />
                  </Link>
                </div>
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                          isActive
                            ? "bg-[#C8EE44] text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="hidden text-xl font-semibold md:block">{title}</h1>
          </div>

          {/* Right Side: Contains Icons and UserNav */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <UserNav />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
