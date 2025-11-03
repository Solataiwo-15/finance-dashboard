// src/app/invoices/page.tsx (V3 - With Filtering Logic)

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { account, databases } from "@/lib/appwrite";
import toast from "react-hot-toast";

import { DashboardLayout } from "@/components/dashboard-layout";
import { InvoiceList, Invoice } from "@/components/invoice-list";
import { CreateInvoiceForm } from "@/components/create-invoice-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type FilterStatus = "All" | "Paid" | "Unpaid";

export default function InvoicesPage() {
  const router = useRouter();
  const { user, setUser, invoices, setInvoices } = useAppStore();
  const [filter, setFilter] = useState<FilterStatus>("All");

  useEffect(() => {
    /* ... same session logic ... */
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
    /* ... same fetch logic ... */
    const fetchInvoices = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID!
        );
        setInvoices(response.documents as unknown as Invoice[]);
      } catch (error) {
        toast.error("Failed to fetch invoices.");
      }
    };

    if (user && invoices.length === 0) {
      fetchInvoices();
    }
  }, [user, invoices.length, setInvoices]);

  // useMemo will efficiently re-calculate the filtered list only when invoices or the filter changes
  const filteredInvoices = useMemo(() => {
    if (filter === "All") return invoices;
    return invoices.filter((invoice) => invoice.status === filter);
  }, [invoices, filter]);

  if (!user) {
    return (
      <p className="flex h-screen items-center justify-center">
        Loading session...
      </p>
    );
  }

  return (
    <DashboardLayout title="Invoices">
      <div className="space-y-4">
        {/* --- Header with Search and Create Button --- */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="pl-8 sm:w-[300px] bg-white"
            />
          </div>
          <CreateInvoiceForm />
        </div>

        {/* --- NEW: Filter Toggle Group --- */}
        <div className="flex items-center justify-between">
          <ToggleGroup
            type="single"
            defaultValue="All"
            onValueChange={(value: FilterStatus) => value && setFilter(value)}
          >
            <ToggleGroupItem value="All">All</ToggleGroupItem>
            <ToggleGroupItem value="Paid">Paid</ToggleGroupItem>
            <ToggleGroupItem value="Unpaid">Unpaid</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          {/* --- Pass the filtered list to the component --- */}
          <InvoiceList invoices={filteredInvoices} />
        </div>
      </div>
    </DashboardLayout>
  );
}
