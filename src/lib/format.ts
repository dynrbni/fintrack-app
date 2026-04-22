import { TransactionDirection } from "../types";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatCurrency(amount: number, direction?: TransactionDirection) {
  const formatted = Math.abs(Math.round(amount)).toLocaleString("id-ID");
  const prefix = direction === "expense" ? "-Rp " : direction === "income" ? "+Rp " : "Rp ";

  return `${prefix}${formatted}`;
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  const diff = startOfDay(today) - startOfDay(date);

  if (diff === 0) {
    return "Today";
  }

  if (diff === 86_400_000) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}