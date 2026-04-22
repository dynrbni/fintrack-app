import { ParsedEmailDraft, TransactionCategory, TransactionDirection } from "../types";

const categoryRules: Array<{ test: RegExp; category: TransactionCategory }> = [
  { test: /mcd|mcdonald|restaurant|cafe|coffee|food|dining/i, category: "food" },
  { test: /tokopedia|shopee|shopping|mall|store|marketplace/i, category: "shopping" },
  { test: /grab|gojek|taxi|ride|fuel|shell|pertamina|parking|transport/i, category: "transport" },
  { test: /airline|flight|hotel|travel|trip|booking/i, category: "travel" },
  { test: /pln|electric|water|internet|telkom|bill|utility/i, category: "bills" },
  { test: /netflix|spotify|subscription|membership/i, category: "subscriptions" },
  { test: /salary|payroll|gaji|income|deposit/i, category: "salary" },
];

const merchantRules: Array<{ test: RegExp; merchant: string }> = [
  { test: /mcd|mcdonald/i, merchant: "McDonald's" },
  { test: /starbucks/i, merchant: "Starbucks" },
  { test: /tokopedia/i, merchant: "Tokopedia" },
  { test: /shopee/i, merchant: "Shopee" },
  { test: /grab/i, merchant: "Grab" },
  { test: /gojek/i, merchant: "Gojek" },
  { test: /shell/i, merchant: "Shell" },
  { test: /pln/i, merchant: "PLN" },
  { test: /netflix/i, merchant: "Netflix" },
  { test: /spotify/i, merchant: "Spotify" },
];

function sanitizeDigits(value: string) {
  return Number.parseInt(value.replace(/[^\d]/g, ""), 10);
}

function extractAmount(text: string) {
  const amountMatch = text.match(/(?:rp|idr)\s*([0-9][0-9.,]*)/i) ?? text.match(/\b([0-9][0-9.,]{3,})\b/);

  if (!amountMatch?.[1]) {
    return null;
  }

  const digits = sanitizeDigits(amountMatch[1]);
  return Number.isFinite(digits) && digits > 0 ? digits : null;
}

function detectDirection(text: string): TransactionDirection {
  return /(salary|payroll|refund|cashback|deposit|credit|incoming|earned)/i.test(text) ? "income" : "expense";
}

function detectCategory(text: string, direction: TransactionDirection): TransactionCategory {
  if (direction === "income") {
    return "income";
  }

  const rule = categoryRules.find((candidate) => candidate.test.test(text));
  return rule?.category ?? "other";
}

function detectMerchant(text: string, subject: string, sender: string) {
  const rule = merchantRules.find((candidate) => candidate.test.test(text) || candidate.test.test(subject));

  if (rule) {
    return rule.merchant;
  }

  const senderLabel = sender.split("@")[0]?.replace(/[._-]/g, " ").trim();
  if (senderLabel) {
    return senderLabel.replace(/\b\w/g, (character) => character.toUpperCase());
  }

  return "Unknown merchant";
}

export function parseEmailDraft(subject: string, body: string, sender: string): ParsedEmailDraft {
  const normalizedText = `${subject}\n${body}\n${sender}`.toLowerCase();
  const direction = detectDirection(normalizedText);
  const category = detectCategory(normalizedText, direction);
  const amount = extractAmount(normalizedText);
  const merchant = detectMerchant(normalizedText, subject, sender);
  const confidence = amount && merchant !== "Unknown merchant" ? 0.9 : amount || merchant ? 0.68 : 0.45;

  return {
    merchant,
    amount,
    category,
    direction,
    confidence,
    summary: subject.trim() || body.trim().slice(0, 80) || "Incoming email",
  };
}

export function formatDraftAmount(amount: number | null) {
  if (!amount) {
    return "Amount not detected yet";
  }

  return `Rp ${amount.toLocaleString("id-ID")}`;
}