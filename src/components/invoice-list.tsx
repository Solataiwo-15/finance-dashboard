// src/components/invoice-list.tsx (V7 - As a Presentational Component)

"use client";

// NO LONGER IMPORTS from the global store
import { Models } from "appwrite";
import { databases } from "@/lib/appwrite";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DueDate } from "./due-date";
import { MoreHorizontal, CheckCircle, Trash2, Pencil } from "lucide-react"; // <-- Add Pencil

// We still need the main store for UPDATE and DELETE actions
import { useAppStore } from "@/lib/store";

export interface Invoice extends Models.Document {
  clientName: string;
  clientEmail: string;
  amount: number;
  vat: number;
  dueDate: string;
  status: "Paid" | "Unpaid";
}

const StatusBadge = ({ status }: { status: "Paid" | "Unpaid" }) => {
  /* ... no changes here ... */
  const isPaid = status === "Paid";
  return (
    <Badge
      className={
        isPaid
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80"
          : "bg-amber-100 text-amber-700 hover:bg-amber-100/80"
      }
    >
      {status}
    </Badge>
  );
};

// --- UPDATED: Accepts invoices as a prop ---
export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  // We only get the action functions from the store now
  const { updateInvoice, deleteInvoice, setEditingInvoice } = useAppStore();

  const handleMarkAsPaid = async (invoiceId: string) => {
    /* ... no changes here ... */
    const promise = databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID!,
      invoiceId,
      { status: "Paid" }
    );
    toast.promise(promise, {
      loading: "Updating status...",
      success: "Invoice marked as paid!",
      error: "Failed to update status.",
    });
    updateInvoice(invoiceId, { status: "Paid" });
  };

  const handleDelete = async (invoiceId: string) => {
    /* ... no changes here ... */
    const promise = databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID!,
      invoiceId
    );
    toast.promise(promise, {
      loading: "Deleting invoice...",
      success: "Invoice deleted!",
      error: "Failed to delete invoice.",
    });
    deleteInvoice(invoiceId);
  };

  return (
    <Table>
      <TableHeader>
        {/* ... table header (no changes) ... */}
        <TableRow>
          <TableHead className="text-xs uppercase text-gray-500">
            Client
          </TableHead>
          <TableHead className="text-xs uppercase text-gray-500">
            Status
          </TableHead>
          <TableHead className="text-xs uppercase text-gray-500">
            Due Date
          </TableHead>
          <TableHead className="text-xs uppercase text-gray-500 text-right">
            Amount
          </TableHead>
          <TableHead className="text-xs uppercase text-gray-500 text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* --- We now use the 'invoices' prop directly --- */}
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-8 text-center text-gray-500">
              No invoices match the current filter.
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow key={invoice.$id} className="border-b">
              {/* ... All TableCell content (no changes) ... */}
              <TableCell className="py-4">
                <div className="font-medium">{invoice.clientName}</div>
                <div className="text-sm text-muted-foreground">
                  {invoice.clientEmail}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="py-4">
                <DueDate dueDate={invoice.dueDate} />
              </TableCell>
              <TableCell className="py-4 text-right font-medium">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(invoice.amount)}
              </TableCell>
              <TableCell className="py-4 text-right">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* --- ADD THE EDIT BUTTON HERE --- */}
                      <DropdownMenuItem
                        onClick={() => setEditingInvoice(invoice)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {invoice.status === "Unpaid" && (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsPaid(invoice.$id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as paid
                        </DropdownMenuItem>
                      )}
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this invoice. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(invoice.$id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
