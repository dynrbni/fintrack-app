import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { FilterChip } from "../../components/FilterChip";
import { LineChart } from "../../components/LineChart";
import { MetricCard } from "../../components/MetricCard";
import { SectionHeader } from "../../components/SectionHeader";
import { TransactionItem } from "../../components/TransactionItem";
import { cashFlowSeries, outflowCard, recentTransactions, topCategoryCard } from "../../src/mock";
import { formatCurrency } from "../../src/lib/format";
import { colors, radius, shadows, spacing } from "../../src/theme";

const filters = ["This month", "Last 3 months", "All accounts"];

export default function InsightsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <View style={styles.iconButton}>
          <MaterialCommunityIcons name="dots-horizontal" size={18} color={colors.text} />
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((filter, index) => (
          <FilterChip key={filter} label={filter} active={index === 0} onPress={() => undefined} />
        ))}
      </View>

      <View style={styles.summaryGrid}>
        <MetricCard
          title="Top category"
          value={topCategoryCard.label}
          subtitle={`${topCategoryCard.change}% from last month`}
          icon="food"
          iconColor={colors.primary}
          iconBackgroundColor={colors.primarySoft}
        />
        <MetricCard
          title="Total outflow"
          value={formatCurrency(outflowCard.amount, "expense")}
          subtitle="Across all accounts"
          icon="trending-down"
          iconColor={colors.error}
          iconBackgroundColor={colors.errorSoft}
        />
      </View>

      <View style={styles.card}>
        <SectionHeader title="Cash flow" actionLabel="Open" onAction={() => router.push("/transactions")} />
        <View style={styles.chartWrap}>
          <View style={styles.axisColumn}>
            <Text style={styles.axisLabel}>15M</Text>
            <Text style={styles.axisLabel}>10M</Text>
            <Text style={styles.axisLabel}>5M</Text>
            <Text style={styles.axisLabel}>0</Text>
          </View>
          <View style={styles.chartSurface}>
            <LineChart data={cashFlowSeries} width={280} height={170} />
          </View>
        </View>
        <View style={styles.weekRow}>
          <Text style={styles.weekLabel}>W1</Text>
          <Text style={styles.weekLabel}>W2</Text>
          <Text style={styles.weekLabel}>W3</Text>
          <Text style={styles.weekLabel}>W4</Text>
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Spending snapshot" />
        <View style={styles.snapshotRow}>
          <View style={styles.snapshotBadge}>
            <MaterialCommunityIcons name="chart-donut" size={20} color={colors.primary} />
          </View>
          <View style={styles.snapshotCopy}>
            <Text style={styles.snapshotTitle}>Food still drives the biggest spend</Text>
            <Text style={styles.snapshotBody}>
              Use this area to wire category filters, wallet breakdowns, or monthly goals from Supabase data.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Top transactions" actionLabel="Transactions" onAction={() => router.push("/transactions")} />
        <View style={styles.transactionList}>
          {recentTransactions.slice(0, 3).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() => router.push(`/transaction/${transaction.id}`)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
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
  filterRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: spacing.md,
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
  chartWrap: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.sm,
    marginTop: 4,
  },
  axisColumn: {
    width: 42,
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  axisLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
  },
  chartSurface: {
    flex: 1,
    minHeight: 170,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 42,
    paddingTop: 6,
  },
  weekLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  snapshotRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  snapshotBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  snapshotCopy: {
    flex: 1,
    gap: 4,
  },
  snapshotTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  snapshotBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  transactionList: {
    gap: 12,
  },
});