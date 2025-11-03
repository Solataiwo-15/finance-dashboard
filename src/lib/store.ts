// src/lib/store.ts (V2 - Corrected Structure)

import { Models } from "appwrite";
import { create } from "zustand";
import { Invoice } from "@/components/invoice-list";

type UserState = {
  user: Models.User<Models.Preferences> | null;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
};

type InvoiceState = {
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updatedInvoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
    editingInvoice: Invoice | null; // The invoice currently being edited
  setEditingInvoice: (invoice: Invoice | null) => void;
};

// --- THE FIX IS IN THIS SECTION ---
// We combine all properties into a single object returned by the (set) => ({...}) function
export const useAppStore = create<UserState & InvoiceState>((set) => ({
  // UserState properties
  user: null,
  setUser: (user) => set({ user }),

  // InvoiceState properties
  invoices: [],
  setInvoices: (invoices) => set({ invoices }),
  
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [invoice, ...state.invoices] })),

  updateInvoice: (id, updatedFields) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.$id === id ? { ...inv, ...updatedFields } : inv
      ),
    })),

  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.$id !== id),
    })),

    editingInvoice: null,
  setEditingInvoice: (invoice) => set({ editingInvoice: invoice }),
}));