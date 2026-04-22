import { createClient } from "npm:@supabase/supabase-js@2";

type ParseEmailBody = {
  subject: string;
  sender: string;
  body: string;
  receivedAt?: string;
};

type ParsedPayload = {
  merchant: string;
  category: string;
  direction: "income" | "expense";
  amount: number;
  confidence: number;
  preview: string;
  summary: string;
};

const categoryRules: Array<{ test: RegExp; category: string }> = [
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
    return 0;
  }

  const digits = sanitizeDigits(amountMatch[1]);
  return Number.isFinite(digits) && digits > 0 ? digits : 0;
}

function detectDirection(text: string) {
  return /(salary|payroll|refund|cashback|deposit|credit|incoming|earned)/i.test(text) ? "income" : "expense";
}

function detectCategory(text: string, direction: "income" | "expense") {
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

function parseEmail(subject: string, body: string, sender: string): ParsedPayload {
  const normalizedText = `${subject}\n${body}\n${sender}`.toLowerCase();
  const direction = detectDirection(normalizedText);
  const category = detectCategory(normalizedText, direction);
  const amount = extractAmount(normalizedText);
  const merchant = detectMerchant(normalizedText, subject, sender);
  const confidence = amount && merchant !== "Unknown merchant" ? 0.9 : amount || merchant ? 0.68 : 0.45;

  return {
    merchant,
    category,
    direction,
    amount,
    confidence,
    preview: body.slice(0, 140),
    summary: subject.trim() || body.trim().slice(0, 80) || "Incoming email",
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const authHeader = request.headers.get("Authorization");

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json(
      { error: "Missing Supabase env vars for the edge function." },
      { status: 500, headers: corsHeaders }
    );
  }

  if (!authHeader) {
    return Response.json({ error: "Missing Authorization header." }, { status: 401, headers: corsHeaders });
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: userData, error: userError } = await client.auth.getUser();

  if (userError || !userData.user) {
    return Response.json({ error: userError?.message ?? "Unable to identify user." }, { status: 401, headers: corsHeaders });
  }

  const payload = (await request.json()) as ParseEmailBody;

  const userId = userData.user.id;

  const parsedEmail = parseEmail(payload.subject, payload.body, payload.sender);

  const { data: parsedEmailRow, error: insertParsedEmailError } = await client
    .from("parsed_emails")
    .insert({
      user_id: userId,
      subject: payload.subject,
      sender: payload.sender,
      received_at: payload.receivedAt ?? new Date().toISOString(),
      parse_status: "parsed",
      merchant: parsedEmail.merchant,
      category: parsedEmail.category,
      direction: parsedEmail.direction,
      amount: parsedEmail.amount,
      confidence: parsedEmail.confidence,
      preview: parsedEmail.preview,
      raw_body: payload.body,
    })
    .select()
    .single();

  if (insertParsedEmailError) {
    return Response.json({ error: insertParsedEmailError.message }, { status: 500, headers: corsHeaders });
  }

  let transactionId: string | null = null;

  if (parsedEmail.amount > 0) {
    const { data: transactionRow, error: transactionError } = await client
      .from("transactions")
      .insert({
        user_id: userId,
        merchant: parsedEmail.merchant,
        category: parsedEmail.category,
        direction: parsedEmail.direction,
        amount: parsedEmail.amount,
        source: "Email parser",
        occurred_at: payload.receivedAt ?? new Date().toISOString(),
        from_email: true,
        email_subject: payload.subject,
        email_sender: payload.sender,
        raw_payload: {
          subject: payload.subject,
          sender: payload.sender,
          body: payload.body,
        },
      })
      .select()
      .single();

    if (!transactionError && transactionRow) {
      transactionId = transactionRow.id;

      await client
        .from("parsed_emails")
        .update({ linked_transaction_id: transactionRow.id })
        .eq("id", parsedEmailRow.id);
    }
  }

  return Response.json(
    {
      parsedEmail: {
        ...parsedEmailRow,
        linkedTransactionId: transactionId,
        summary: parsedEmail.summary,
      },
    },
    { status: 200, headers: corsHeaders }
  );
});