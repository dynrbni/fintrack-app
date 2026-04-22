import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { formatDraftAmount, parseEmailDraft } from "../src/lib/email-parser";
import { formatCurrency, formatDateTime } from "../src/lib/format";
import { isSupabaseConfigured, supabase } from "../src/lib/supabase";
import { parsedEmails } from "../src/mock";
import { colors, radius, shadows, spacing } from "../src/theme";
import { ParsedEmailDraft } from "../src/types";

const defaultSubject = "Card payment at Starbucks";
const defaultSender = "alerts@bank.co.id";
const defaultBody = "Your debit card was charged Rp 65.000 at Starbucks Senayan City.";

export default function EmailParserScreen() {
  const [subject, setSubject] = useState(defaultSubject);
  const [sender, setSender] = useState(defaultSender);
  const [body, setBody] = useState(defaultBody);
  const [parsedDraft, setParsedDraft] = useState<ParsedEmailDraft>(() => parseEmailDraft(defaultSubject, defaultBody, defaultSender));
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const latestEmail = useMemo(() => parsedEmails[0], []);

  async function handleParse() {
    const localDraft = parseEmailDraft(subject, body, sender);
    setParsedDraft(localDraft);
    setStatusMessage("Parsed locally from the sample email.");

    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    setLoading(true);

    try {
      const response = await supabase.functions.invoke("parse-email", {
        body: {
          subject,
          sender,
          body,
        },
      });

      if (response.error) {
        throw response.error;
      }

      const remoteDraft = response.data?.parsedEmail ?? response.data;
      if (remoteDraft) {
        setParsedDraft({
          merchant: remoteDraft.merchant ?? localDraft.merchant,
          amount: remoteDraft.amount ?? localDraft.amount,
          category: remoteDraft.category ?? localDraft.category,
          direction: remoteDraft.direction ?? localDraft.direction,
          confidence: remoteDraft.confidence ?? localDraft.confidence,
          summary: remoteDraft.summary ?? localDraft.summary,
        });
        setStatusMessage("Parsed through Supabase Edge Function.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Edge parsing failed.";
      setStatusMessage(`Supabase parse failed: ${message}`);
      Alert.alert("Supabase parse failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="arrow-left" size={18} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Email parser</Text>
        <View style={styles.iconButton}>
          <MaterialCommunityIcons name="email-fast-outline" size={18} color={colors.text} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.heroTop}>
          <Text style={styles.heroTitle}>Turn raw inbox noise into transactions</Text>
          <Text style={styles.heroCopy}>
            This workspace previews the parsing heuristics locally, then optionally hands the payload off to a Supabase Edge Function.
          </Text>
        </View>
        <View style={styles.banner}>
          <MaterialCommunityIcons name="shield-check-outline" size={16} color={colors.primary} />
          <Text style={styles.bannerText}>{isSupabaseConfigured ? "Supabase is connected." : "Set Supabase env vars to enable remote parsing."}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sample email</Text>
        <Field label="Subject" value={subject} onChangeText={setSubject} placeholder="Email subject" />
        <Field label="Sender" value={sender} onChangeText={setSender} placeholder="sender@example.com" />
        <Field label="Body" value={body} onChangeText={setBody} placeholder="Paste the email body here" multiline />
        <Pressable onPress={handleParse} disabled={loading} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>{loading ? "Parsing..." : "Parse email"}</Text>
        </Pressable>
        {statusMessage ? <Text style={styles.statusMessage}>{statusMessage}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Parsed output</Text>
        <View style={styles.outputCard}>
          <View style={styles.outputHeader}>
            <View>
              <Text style={styles.outputMerchant}>{parsedDraft.merchant}</Text>
              <Text style={styles.outputSummary}>{parsedDraft.summary}</Text>
            </View>
            <View style={styles.outputBadge}>
              <Text style={styles.outputBadgeText}>{Math.round(parsedDraft.confidence * 100)}%</Text>
            </View>
          </View>

          <View style={styles.outputGrid}>
            <OutputItem label="Amount" value={formatDraftAmount(parsedDraft.amount)} />
            <OutputItem label="Category" value={parsedDraft.category} />
            <OutputItem label="Direction" value={parsedDraft.direction} />
            <OutputItem label="Confidence" value={`${Math.round(parsedDraft.confidence * 100)}%`} />
          </View>

          <Text style={styles.outputNote}>
            The same parsed structure can be saved into a Supabase table and linked to a transaction record later.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent parsed emails</Text>
          <Text style={styles.sectionMeta}>{parsedEmails.length} entries</Text>
        </View>
        <View style={styles.emailList}>
          {parsedEmails.map((email) => (
            <View key={email.id} style={styles.emailRow}>
              <View style={styles.emailIcon}>
                <MaterialCommunityIcons name="email-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.emailCopy}>
                <Text style={styles.emailSubject} numberOfLines={1}>
                  {email.subject}
                </Text>
                <Text style={styles.emailPreview} numberOfLines={2}>
                  {email.preview}
                </Text>
              </View>
              <View style={styles.emailMeta}>
                <Text style={styles.emailAmount}>{formatCurrency(email.amount, email.direction)}</Text>
                <Text style={styles.emailTime}>{formatDateTime(email.receivedAt)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        multiline={multiline}
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
      />
    </View>
  );
}

function OutputItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.outputItem}>
      <Text style={styles.outputLabel}>{label}</Text>
      <Text style={styles.outputValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 112,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.soft,
  },
  heroTop: {
    gap: 6,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  heroCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  bannerText: {
    flex: 1,
    color: colors.primary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  fieldInput: {
    minHeight: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  fieldInputMultiline: {
    minHeight: 112,
    textAlignVertical: "top",
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800",
  },
  statusMessage: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  outputCard: {
    gap: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  outputHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  outputMerchant: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  outputSummary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  outputBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  outputBadgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "800",
  },
  outputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  outputItem: {
    flexBasis: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  outputLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  outputValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  outputNote: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  emailList: {
    gap: 12,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  emailIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emailCopy: {
    flex: 1,
    gap: 4,
  },
  emailSubject: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  emailPreview: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  emailMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  emailAmount: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  emailTime: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});