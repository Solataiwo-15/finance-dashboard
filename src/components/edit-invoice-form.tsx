"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { databases } from "@/lib/appwrite";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

export function EditInvoiceForm() {
  const { editingInvoice, setEditingInvoice, updateInvoice } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [vat, setVat] = useState<number | "">("");
  const [dueDate, setDueDate] = useState<Date>();
  const [status, setStatus] = useState<"Paid" | "Unpaid">("Unpaid");

  useEffect(() => {
    if (editingInvoice) {
      setClientName(editingInvoice.clientName);
      setClientEmail(editingInvoice.clientEmail);
      setAmount(editingInvoice.amount);
      setVat(editingInvoice.vat);
      setDueDate(new Date(editingInvoice.dueDate));
      setStatus(editingInvoice.status);
    }
  }, [editingInvoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    setIsLoading(true);

    const updatedData = {
      clientName,
      clientEmail,
      amount: Number(amount) || 0,
      vat: Number(vat) || 0,
      dueDate: dueDate?.toISOString(),
      status,
    };

    try {
      const promise = databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID!,
        editingInvoice.$id,
        updatedData
      );

      await toast.promise(promise, {
        loading: "Saving changes...",
        success: "Invoice updated successfully!",
        error: "Failed to update invoice.",
      });

      updateInvoice(editingInvoice.$id, updatedData);
      setEditingInvoice(null);
    } catch (error) {
      console.error("Error updating invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOpen = editingInvoice !== null;
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setEditingInvoice(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>
            Make changes to the invoice below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-clientName">Client Name</Label>
            <Input
              id="edit-clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-clientEmail">Client Email</Label>
            <Input
              id="edit-clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-amount">Amount (₦)</Label>
              <Input
                id="edit-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="edit-vat">VAT (%)</Label>
              <Input
                id="edit-vat"
                type="number"
                value={vat}
                onChange={(e) => setVat(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start",
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
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "Paid" | "Unpaid")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingInvoice(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#C8EE44] text-black hover:bg-[#B5E233]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
