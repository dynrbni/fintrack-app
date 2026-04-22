import { colors } from "./theme";
import { ParsedEmail, Transaction, Wallet } from "./types";

export const heroBalance = 24_560_000;
export const incomeBalance = 8_240_000;
export const expenseBalance = 3_120_000;

export const wallets: Wallet[] = [
  {
    id: "wallet-gopay",
    name: "GoPay",
    institution: "Digital Wallet",
    balance: 4_650_000,
    color: colors.primary,
  },
  {
    id: "wallet-bca",
    name: "BCA Flexi",
    institution: "Bank",
    balance: 12_800_000,
    color: colors.tertiary,
  },
  {
    id: "wallet-mandiri",
    name: "Mandiri",
    institution: "Bank",
    balance: 7_110_000,
    color: colors.secondary,
  },
];

export const spendingBreakdown = [
  { label: "Food & Dining", value: 45, color: colors.primary },
  { label: "Shopping", value: 25, color: colors.tertiary },
  { label: "Transport", value: 15, color: colors.secondary },
  { label: "Others", value: 15, color: colors.surfaceMuted },
];

export const cashFlowSeries = [62, 59, 68, 74, 66, 82, 88, 96];

export const topCategoryCard = {
  label: "Dining & Food",
  amount: 4_200_000,
  change: 12,
};

export const outflowCard = {
  label: "Total Outflow",
  amount: 12_800_000,
  change: 4,
};

export const recentTransactions: Transaction[] = [
  {
    id: "trx-1",
    merchant: "Starbucks",
    category: "food",
    direction: "expense",
    amount: 65_000,
    occurredAt: "2026-04-22T02:41:00.000Z",
    source: "BCA",
    referenceId: "TRX-99012410",
    walletName: "BCA Flexi",
    note: "Coffee before standup.",
    isFromEmail: true,
    emailSubject: "Starbucks purchase approved",
    sender: "alerts@bca.co.id",
  },
  {
    id: "trx-2",
    merchant: "Tokopedia",
    category: "shopping",
    direction: "expense",
    amount: 450_000,
    occurredAt: "2026-04-21T21:20:00.000Z",
    source: "GoPay",
    referenceId: "TRX-99012322",
    walletName: "GoPay",
    note: "Desk lamp and laptop sleeve.",
  },
  {
    id: "trx-3",
    merchant: "PLN Token",
    category: "bills",
    direction: "expense",
    amount: 200_000,
    occurredAt: "2026-04-20T03:00:00.000Z",
    source: "OVO",
    referenceId: "TRX-99009004",
    walletName: "GoPay",
    note: "Electricity top up.",
  },
  {
    id: "trx-4",
    merchant: "Netflix",
    category: "subscriptions",
    direction: "expense",
    amount: 186_000,
    occurredAt: "2026-04-19T13:30:00.000Z",
    source: "BCA",
    referenceId: "TRX-99004711",
    walletName: "BCA Flexi",
    note: "Monthly plan.",
  },
  {
    id: "trx-5",
    merchant: "Shell Fuel",
    category: "transport",
    direction: "expense",
    amount: 350_000,
    occurredAt: "2026-04-18T09:45:00.000Z",
    source: "Mandiri",
    referenceId: "TRX-98993420",
    walletName: "Mandiri",
    note: "Fuel for weekend trip.",
  },
  {
    id: "trx-6",
    merchant: "Tech Corp Salary",
    category: "salary",
    direction: "income",
    amount: 25_000_000,
    occurredAt: "2026-04-15T01:00:00.000Z",
    source: "BCA",
    referenceId: "TRX-98980110",
    walletName: "BCA Flexi",
    note: "Monthly payroll.",
  },
  {
    id: "trx-7",
    merchant: "McDonald's",
    category: "food",
    direction: "expense",
    amount: 50_000,
    occurredAt: "2026-04-14T07:30:00.000Z",
    source: "GoPay",
    referenceId: "TRX-98974415",
    walletName: "GoPay",
    note: "Lunch with the team.",
    isFromEmail: true,
    emailSubject: "McDonald's purchase details",
    sender: "noreply@gopay.co.id",
  },
];

export const parsedEmails: ParsedEmail[] = [
  {
    id: "email-1",
    subject: "Starbucks purchase approved",
    sender: "alerts@bca.co.id",
    receivedAt: "2026-04-22T02:42:00.000Z",
    parseStatus: "parsed",
    merchant: "Starbucks",
    category: "food",
    direction: "expense",
    amount: 65_000,
    confidence: 0.96,
    preview: "Card payment for coffee and snacks at the office.",
    rawBody: "Your BCA card was charged Rp 65.000 at Starbucks Senayan City.",
    linkedTransactionId: "trx-1",
  },
  {
    id: "email-2",
    subject: "Monthly payroll processed",
    sender: "payroll@techcorp.com",
    receivedAt: "2026-04-15T01:02:00.000Z",
    parseStatus: "parsed",
    merchant: "Tech Corp Salary",
    category: "salary",
    direction: "income",
    amount: 25_000_000,
    confidence: 0.91,
    preview: "Payroll moved to your primary bank account.",
    rawBody: "Salary of Rp 25.000.000 has been transferred to your account.",
    linkedTransactionId: "trx-6",
  },
  {
    id: "email-3",
    subject: "McDonald's receipt",
    sender: "noreply@gopay.co.id",
    receivedAt: "2026-04-14T07:31:00.000Z",
    parseStatus: "parsed",
    merchant: "McDonald's",
    category: "food",
    direction: "expense",
    amount: 50_000,
    confidence: 0.94,
    preview: "Lunch purchase recorded from GoPay email notification.",
    rawBody: "Payment of Rp 50.000 was made to McDonald's with GoPay.",
    linkedTransactionId: "trx-7",
  },
];

export const dashboardHighlights = {
  totalBalance: heroBalance,
  income: incomeBalance,
  expense: expenseBalance,
  monthChange: 12.5,
};