"use client";

import { format, formatDistanceToNow, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";

export function DueDate({ dueDate }: { dueDate: string }) {
  const date = new Date(dueDate);
  const isOverdue = isPast(date) && !isToday(date);
  const isDueToday = isToday(date);

  let message: string;
  if (isOverdue) {
    message = `${formatDistanceToNow(date, { addSuffix: true })} (Overdue)`;
  } else if (isDueToday) {
    message = "Due today";
  } else {
    message = formatDistanceToNow(date, { addSuffix: true });
  }

  const textClassName = cn("text-sm", {
    "text-red-600 font-medium": isOverdue,
    "text-amber-600 font-medium": isDueToday,
    "text-muted-foreground": !isOverdue && !isDueToday,
  });

  return (
    <div>
      <div>{format(date, "PPP")}</div>
      <div className={textClassName}>{message}</div>
    </div>
  );
}
