export type TransactionDirection = "income" | "expense";

export type TransactionCategory =
  | "food"
  | "shopping"
  | "transport"
  | "income"
  | "salary"
  | "travel"
  | "bills"
  | "subscriptions"
  | "transfer"
  | "other";

export type ParsedEmailStatus = "parsed" | "pending" | "failed";

export type Wallet = {
  id: string;
  name: string;
  institution: string;
  balance: number;
  color: string;
};

export type Transaction = {
  id: string;
  merchant: string;
  category: TransactionCategory;
  direction: TransactionDirection;
  amount: number;
  occurredAt: string;
  source: string;
  referenceId: string;
  walletName?: string;
  note?: string;
  isFromEmail?: boolean;
  emailSubject?: string;
  sender?: string;
};

export type ParsedEmail = {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  parseStatus: ParsedEmailStatus;
  merchant: string;
  category: TransactionCategory;
  direction: TransactionDirection;
  amount: number;
  confidence: number;
  preview: string;
  rawBody: string;
  linkedTransactionId?: string;
};

export type ParsedEmailDraft = {
  merchant: string;
  amount: number | null;
  category: TransactionCategory;
  direction: TransactionDirection;
  confidence: number;
  summary: string;
};