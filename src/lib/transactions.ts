import { Transaction } from "../types";
import { formatDayLabel } from "./format";

export type TransactionGroup = {
  label: string;
  items: Transaction[];
};

export function groupTransactionsByDay(transactions: Transaction[]) {
  const sortedTransactions = [...transactions].sort((left, right) => {
    return new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime();
  });

  const groups = new Map<string, Transaction[]>();

  for (const transaction of sortedTransactions) {
    const label = formatDayLabel(transaction.occurredAt);
    const items = groups.get(label) ?? [];
    items.push(transaction);
    groups.set(label, items);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}