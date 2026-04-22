import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getCategoryMeta } from "../../src/lib/categories";
import { formatCurrency, formatDateTime } from "../../src/lib/format";
import { colors, radius, shadows, spacing } from "../../src/theme";
import { recentTransactions } from "../../src/mock";

export default function TransactionDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const transaction = recentTransactions.find((item) => item.id === params.id);

  if (!transaction) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyTitle}>Transaction not found</Text>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const category = getCategoryMeta(transaction.category);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="arrow-left" size={18} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Transaction</Text>
        <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="dots-horizontal" size={18} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <View style={[styles.iconBubble, { backgroundColor: category.backgroundColor }]}>
          <MaterialCommunityIcons name={category.icon as never} size={26} color={category.color} />
        </View>
        <Text style={styles.merchant}>{transaction.merchant}</Text>
        <Text style={[styles.amount, transaction.direction === "income" ? styles.amountIncome : styles.amountExpense]}>
          {formatCurrency(transaction.amount, transaction.direction)}
        </Text>
        <View style={styles.categoryPill}>
          <MaterialCommunityIcons name="tag-outline" size={14} color={colors.primary} />
          <Text style={styles.categoryText}>{category.label}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <DetailRow label="Date" value={formatDateTime(transaction.occurredAt)} />
        <DetailRow label="Source" value={transaction.source} icon="wallet-outline" />
        <DetailRow label="Reference ID" value={transaction.referenceId} />
        <DetailRow label="Wallet" value={transaction.walletName ?? "Primary wallet"} icon="bank-outline" />
      </View>

      <View style={styles.card}>
        <View style={styles.noteHeader}>
          <Text style={styles.sectionTitle}>Note</Text>
          <Pressable onPress={() => Alert.alert("Edit note", "Hook this to Supabase update logic when you are ready.")} style={({ pressed }) => [styles.inlineButton, pressed && styles.pressed]}>
            <Text style={styles.inlineButtonText}>Edit</Text>
          </Pressable>
        </View>
        <Text style={styles.noteCopy}>{transaction.note ?? "No note has been added yet."}</Text>
      </View>

      <View style={styles.actionsCard}>
        <Pressable onPress={() => Alert.alert("Delete transaction", "Wire this to a Supabase delete mutation.")} style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="delete-outline" size={18} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete Transaction</Text>
        </Pressable>

        <Pressable onPress={() => Alert.alert("Report issue", "Send the transaction id to your support flow.")} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.muted} />
          <Text style={styles.secondaryButtonText}>Report an issue</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValueRow}>
        {icon ? <MaterialCommunityIcons name={icon as never} size={16} color={colors.primary} /> : null}
        <Text style={styles.detailValue}>{value}</Text>
      </View>
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
  emptyScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
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
    letterSpacing: -0.4,
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
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  iconBubble: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: "center",
    justifyContent: "center",
  },
  merchant: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.8,
    textAlign: "center",
  },
  amount: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  amountExpense: {
    color: colors.error,
  },
  amountIncome: {
    color: colors.secondary,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
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
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: 6,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  detailValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-end",
  },
  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  inlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
  },
  inlineButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  noteCopy: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  actionsCard: {
    gap: spacing.md,
  },
  deleteButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.errorSoft,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
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
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});