// src/app/page.tsx (V5 - Using Smart Layout)

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { account, databases } from "@/lib/appwrite";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/dashboard-layout";
import { InvoiceList, Invoice } from "@/components/invoice-list";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, invoices, setInvoices } = useAppStore();

  useEffect(() => {
    /* ... same session check logic ... */
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
        router.push("/login");
      }
    };
    checkSession();
  }, [setUser, router]);

  useEffect(() => {
    /* ... same invoice fetch logic ... */
    const fetchInvoices = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID!
        );
        setInvoices(response.documents as unknown as Invoice[]);
      } catch (error) {
        toast.error("Failed to fetch initial invoices.");
      }
    };

    if (user && invoices.length === 0) {
      fetchInvoices();
    }
  }, [user, invoices.length, setInvoices]);

  if (!user) {
    return (
      <p className="flex h-screen items-center justify-center">Loading...</p>
    );
  }

  // --- PASS THE TITLE PROP & REMOVE THE H1 ---
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <DashboardMetrics />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
            <Link
              href="/invoices"
              className="flex items-center text-sm font-semibold text-blue-600 hover:underline"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-lg bg-white shadow-sm">
            <InvoiceList invoices={invoices.slice(0, 3)} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
