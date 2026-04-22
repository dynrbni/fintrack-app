import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getCategoryMeta } from "../src/lib/categories";
import { formatCurrency, formatTime } from "../src/lib/format";
import { colors, radius, spacing } from "../src/theme";
import { Transaction } from "../src/types";

type TransactionItemProps = {
  transaction: Transaction;
  onPress?: () => void;
};

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const category = getCategoryMeta(transaction.category);
  const amountLabel = formatCurrency(transaction.amount, transaction.direction);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconBubble, { backgroundColor: category.backgroundColor }]}>
        <MaterialCommunityIcons name={category.icon as never} size={20} color={category.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.merchant} numberOfLines={1}>
            {transaction.merchant}
          </Text>
          <Text style={[styles.amount, transaction.direction === "income" ? styles.income : styles.expense]} numberOfLines={1}>
            {amountLabel}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.category} numberOfLines={1}>
            {category.label}
          </Text>
          <View style={styles.dot} />
          <Text style={styles.source} numberOfLines={1}>
            {transaction.source}
          </Text>
          <Text style={styles.time}>{formatTime(transaction.occurredAt)}</Text>
        </View>

        {transaction.note ? (
          <Text style={styles.note} numberOfLines={1}>
            {transaction.note}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  merchant: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  amount: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  income: {
    color: colors.success,
  },
  expense: {
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  category: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  source: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: "hidden",
  },
  time: {
    color: colors.muted,
    fontSize: 12,
  },
  note: {
    color: colors.muted,
    fontSize: 12,
  },
});