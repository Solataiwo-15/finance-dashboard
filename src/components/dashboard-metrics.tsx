"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wallet, Landmark, Banknote } from "lucide-react";
import { format } from "date-fns";

export function DashboardMetrics() {
  const { invoices } = useAppStore();

  const metrics = useMemo(() => {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
    const unpaidInvoices = invoices.filter((inv) => inv.status === "Unpaid");
    const totalAmountPaid = paidInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const pendingPayments = unpaidInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const totalVatCollected = paidInvoices.reduce(
      (sum, inv) => sum + inv.amount * (inv.vat / 100),
      0
    );
    const chartData = [
      { name: "Paid", count: paidInvoices.length },
      { name: "Unpaid", count: unpaidInvoices.length },
    ];

    const monthlyVatSummary: { [month: string]: number } = {};

    paidInvoices.forEach((invoice) => {
      const monthKey = format(new Date(invoice.dueDate), "MMMM yyyy");
      const vatAmount = invoice.amount * (invoice.vat / 100);

      if (monthlyVatSummary[monthKey]) {
        monthlyVatSummary[monthKey] += vatAmount;
      } else {
        monthlyVatSummary[monthKey] = vatAmount;
      }
    });

    const sortedMonthlyVat = Object.entries(monthlyVatSummary).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );

    return {
      totalInvoices,
      totalAmountPaid,
      pendingPayments,
      totalVatCollected,
      chartData,
      sortedMonthlyVat,
    };
  }, [invoices]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-800 text-white shadow-lg rounded-xl col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <div className="bg-lime-400/20 p-2 rounded-full">
                <Wallet className="h-4 w-4 text-lime-300" />
              </div>
              Total invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                metrics.totalAmountPaid + metrics.pendingPayments
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <Landmark className="h-4 w-4 text-gray-600" />
              </div>
              Amount Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(metrics.totalAmountPaid)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <Banknote className="h-4 w-4 text-gray-600" />
              </div>
              Pending Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(metrics.pendingPayments)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Invoice Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => `${value} invoices`} />
                <Bar dataKey="count" fill="#C8EE44" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Monthly VAT Summary</CardTitle>
            <CardDescription>
              Total VAT collected from paid invoices each month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.sortedMonthlyVat.length > 0 ? (
              <div className="space-y-4">
                {metrics.sortedMonthlyVat.map(([month, totalVat]) => (
                  <div
                    key={month}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      {month}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(totalVat)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No paid invoices yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
