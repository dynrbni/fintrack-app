import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { FilterChip } from "../../components/FilterChip";
import { SectionHeader } from "../../components/SectionHeader";
import { TransactionItem } from "../../components/TransactionItem";
import { groupTransactionsByDay } from "../../src/lib/transactions";
import { recentTransactions } from "../../src/mock";
import { colors, radius, shadows, spacing } from "../../src/theme";
import { Transaction } from "../../src/types";

const quickFilters = ["All", "Income", "Expenses", "Food"];

export default function TransactionsScreen() {
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredTransactions = useMemo(() => {
    const textQuery = query.trim().toLowerCase();

    return recentTransactions.filter((transaction) => {
      const matchesQuery =
        !textQuery ||
        transaction.merchant.toLowerCase().includes(textQuery) ||
        transaction.category.toLowerCase().includes(textQuery) ||
        transaction.source.toLowerCase().includes(textQuery);

      const matchesFilter =
        selectedFilter === "All" ||
        (selectedFilter === "Income" && transaction.direction === "income") ||
        (selectedFilter === "Expenses" && transaction.direction === "expense") ||
        (selectedFilter === "Food" && transaction.category === "food");

      return matchesQuery && matchesFilter;
    });
  }, [query, selectedFilter]);

  const groupedTransactions = useMemo(() => groupTransactionsByDay(filteredTransactions), [filteredTransactions]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <View style={styles.iconButton}>
            <MaterialCommunityIcons name="tune-variant" size={18} color={colors.text} />
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={18} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search merchants, categories, sources"
              placeholderTextColor={colors.faint}
            />
          </View>
        </View>

        <View style={styles.filterRow}>
          {quickFilters.map((filter) => (
            <FilterChip key={filter} label={filter} active={selectedFilter === filter} onPress={() => setSelectedFilter(filter)} />
          ))}
        </View>

        <View style={styles.summaryCard}>
          <SectionHeader title="Ledger" actionLabel="Email parser" onAction={() => router.push("/email-parser")} />
          <Text style={styles.summaryText}>
            These entries are wired to mock data now, but the same shape can be populated from a Supabase table with the edge parser.
          </Text>
        </View>

        <View style={styles.groupList}>
          {groupedTransactions.map((group) => (
            <View key={group.label} style={styles.groupBlock}>
              <Text style={styles.groupLabel}>{group.label}</Text>
              <View style={styles.groupCard}>
                <View style={styles.groupItems}>
                  {group.items.map((transaction, index) => (
                    <View key={transaction.id} style={index > 0 ? styles.itemSpacer : undefined}>
                      <TransactionItem transaction={transaction} onPress={() => router.push(`/transaction/${transaction.id}`)} />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}

          {groupedTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="alert-outline" size={24} color={colors.primary} />
              <Text style={styles.emptyTitle}>No transactions found</Text>
              <Text style={styles.emptyCopy}>Try a different query or switch filters.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 112,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  searchRow: {
    gap: spacing.md,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
    paddingHorizontal: 16,
    ...shadows.soft,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.soft,
  },
  summaryText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  groupList: {
    gap: spacing.lg,
  },
  groupBlock: {
    gap: spacing.sm,
  },
  groupLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 2,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  groupItems: {
    gap: 0,
  },
  itemSpacer: {
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 13,
  },
});