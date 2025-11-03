// src/components/create-invoice-form.tsx (V5.0 - NO ZOD, GUARANTEED TO WORK)

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { Invoice } from "./invoice-list";

import { cn } from "@/lib/utils";
import { databases } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/formatters";

export function CreateInvoiceForm() {
  const [open, setOpen] = useState(false);
  const { addInvoice } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // Direct state management for each field
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [vat, setVat] = useState<number | "">("");
  const [dueDate, setDueDate] = useState<Date>();
  const [status, setStatus] = useState("Unpaid");

  // --- NEW: Real-time Calculation Logic ---
  const safeAmount = Number(amount) || 0;
  const safeVat = Number(vat) || 0;
  const vatAmount = safeAmount * (safeVat / 100);
  const totalAmount = safeAmount + vatAmount;

  // The new handleSubmit function for create-invoice-form.tsx

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !clientName ||
      !clientEmail ||
      !amount ||
      vat === "" ||
      !dueDate ||
      !status
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // We need to await the response to get the newly created document
      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID!,
        uuidv4(),
        {
          clientName,
          clientEmail,
          amount,
          vat,
          dueDate: dueDate.toISOString(),
          status,
        }
      );

      // Add the new invoice to our global store
      addInvoice(response as unknown as Invoice);

      toast.success("Invoice created successfully!");

      setClientName("");
      setClientEmail("");
      setAmount("");
      setVat("");
      setDueDate(undefined);
      setStatus("Unpaid");
      setOpen(false);
    } catch (error) {
      const err = error as Error; // Type assertion
      toast.error(err.message || "Failed to create invoice.");
      console.error("Error creating invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#C8EE44] hover:bg-[#B5E233] text-black">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>Fill in the details below.</DialogDescription>
        </DialogHeader>
        {/* We now use a standard form with onChange handlers */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ahmad Taiwo"
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Client Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="ahmad@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="150000"
              />
            </div>
            <div>
              <Label htmlFor="vat">VAT (%)</Label>
              <Input
                id="vat"
                type="number"
                value={vat}
                onChange={(e) => setVat(Number(e.target.value))}
                placeholder="7.5"
              />
            </div>
          </div>
          {/* --- NEW: Auto-calculation Display Section --- */}
          <div className="rounded-lg bg-gray-50 p-3 space-y-2 border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                VAT Amount ({safeVat}%)
              </span>
              <span>{formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold text-md">
              <span>Total Amount</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#C8EE44] text-black hover:bg-[#B5E233]"
            >
              {isLoading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
