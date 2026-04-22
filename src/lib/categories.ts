import { colors } from "../theme";
import { TransactionCategory } from "../types";

export type CategoryMeta = {
  label: string;
  icon: string;
  color: string;
  backgroundColor: string;
};

export const categoryMeta: Record<TransactionCategory, CategoryMeta> = {
  food: {
    label: "Food & Drink",
    icon: "food",
    color: colors.primary,
    backgroundColor: "#F1ECFF",
  },
  shopping: {
    label: "Shopping",
    icon: "shopping",
    color: "#C026D3",
    backgroundColor: "#FAE8FF",
  },
  transport: {
    label: "Transport",
    icon: "car",
    color: "#0EA5E9",
    backgroundColor: "#E0F2FE",
  },
  income: {
    label: "Income",
    icon: "arrow-down-bold",
    color: colors.secondary,
    backgroundColor: "#D9FCEB",
  },
  salary: {
    label: "Salary",
    icon: "cash",
    color: colors.secondary,
    backgroundColor: "#D9FCEB",
  },
  travel: {
    label: "Travel",
    icon: "airplane",
    color: "#EA580C",
    backgroundColor: "#FFEDD5",
  },
  bills: {
    label: "Bills",
    icon: "flash",
    color: "#F59E0B",
    backgroundColor: "#FEF3C7",
  },
  subscriptions: {
    label: "Subscriptions",
    icon: "television",
    color: colors.tertiary,
    backgroundColor: colors.tertiarySoft,
  },
  transfer: {
    label: "Transfer",
    icon: "swap-horizontal",
    color: "#0284C7",
    backgroundColor: "#E0F2FE",
  },
  other: {
    label: "Other",
    icon: "dots-horizontal",
    color: colors.muted,
    backgroundColor: colors.surfaceMuted,
  },
};

export function getCategoryMeta(category: TransactionCategory) {
  return categoryMeta[category] ?? categoryMeta.other;
}