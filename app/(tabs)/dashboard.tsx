import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { MetricCard } from "../../components/MetricCard";
import { SectionHeader } from "../../components/SectionHeader";
import { TransactionItem } from "../../components/TransactionItem";
import { DonutChart } from "../../components/DonutChart";
import { useAuth } from "../../context/AuthContext";
import { dashboardHighlights, heroBalance, parsedEmails, recentTransactions, spendingBreakdown, wallets } from "../../src/mock";
import { formatCurrency } from "../../src/lib/format";
import { colors, radius, shadows, spacing } from "../../src/theme";

export default function DashboardScreen() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Alex";

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Hi, {displayName}</Text>
            <Text style={styles.subGreeting}>Your money flow at a glance</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.headerPill}>
            <MaterialCommunityIcons name="bell-outline" size={16} color={colors.primary} />
          </View>
        </View>
      </View>

      <LinearGradient colors={[colors.primary, colors.tertiary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />

        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroLabel}>Total balance</Text>
            <Text style={styles.heroBalance}>{formatCurrency(heroBalance)}</Text>
          </View>
          <View style={styles.trendPill}>
            <MaterialCommunityIcons name="trending-up" size={16} color={colors.secondarySoft} />
            <Text style={styles.trendText}>+{dashboardHighlights.monthChange}%</Text>
          </View>
        </View>

        <View style={styles.heroBottomRow}>
          <View>
            <Text style={styles.heroCaption}>vs last month</Text>
            <Text style={styles.heroCaptionValue}>Stable cash flow</Text>
          </View>
          <View style={styles.quickStack}>
            {wallets.slice(0, 3).map((wallet) => (
              <View key={wallet.id} style={[styles.walletBubble, { backgroundColor: wallet.color }]}>
                <Text style={styles.walletLetter}>{wallet.name.slice(0, 1)}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.metricsGrid}>
        <MetricCard
          title="Income"
          value={formatCurrency(dashboardHighlights.income, "income")}
          subtitle="This month"
          icon="arrow-down-bold"
          iconColor={colors.secondary}
          iconBackgroundColor="#D9FCEB"
        />
        <MetricCard
          title="Expense"
          value={formatCurrency(dashboardHighlights.expense, "expense")}
          subtitle="This month"
          icon="arrow-up-bold"
          iconColor={colors.error}
          iconBackgroundColor={colors.errorSoft}
        />
      </View>

      <View style={styles.card}>
        <SectionHeader title="Spending overview" actionLabel="Insights" onAction={() => router.push("/insights")} />
        <View style={styles.donutRow}>
          <DonutChart
            segments={spendingBreakdown}
            centerLabel="Aug"
            centerValue={formatCurrency(4_200_000)}
          />
          <View style={styles.legendColumn}>
            {spendingBreakdown.map((segment) => (
              <View key={segment.label} style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
                  <Text style={styles.legendLabel}>{segment.label}</Text>
                </View>
                <Text style={styles.legendValue}>{segment.value}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Recent transactions" actionLabel="See all" onAction={() => router.push("/transactions")} />
        <View style={styles.transactionList}>
          {recentTransactions.slice(0, 4).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() => router.push(`/transaction/${transaction.id}`)}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Email parser" actionLabel="Open" onAction={() => router.push("/email-parser")} />
        <View style={styles.parserHero}>
          <View style={styles.parserIcon}>
            <MaterialCommunityIcons name="email-fast-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.parserCopy}>
            <Text style={styles.parserTitle}>Inbound email receipts are ready</Text>
            <Text style={styles.parserBody}>
              Use Supabase Edge Functions to parse bank and wallet notifications into clean transactions.
            </Text>
          </View>
        </View>
        <View style={styles.parserStats}>
          <View style={styles.parserStatItem}>
            <Text style={styles.parserStatValue}>{parsedEmails.length}</Text>
            <Text style={styles.parserStatLabel}>parsed emails</Text>
          </View>
          <View style={styles.parserStatDivider} />
          <View style={styles.parserStatItem}>
            <Text style={styles.parserStatValue}>96%</Text>
            <Text style={styles.parserStatLabel}>confidence</Text>
          </View>
          <View style={styles.parserStatDivider} />
          <View style={styles.parserStatItem}>
            <Text style={styles.parserStatValue}>1 tap</Text>
            <Text style={styles.parserStatLabel}>to review</Text>
          </View>
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
    gap: spacing.md,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },
  greeting: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
  },
  subGreeting: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    minHeight: 190,
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: "hidden",
    justifyContent: "space-between",
    ...shadows.medium,
  },
  heroGlowOne: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  heroGlowTwo: {
    position: "absolute",
    bottom: -40,
    left: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(111,251,190,0.14)",
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heroLabel: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  heroBalance: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.9,
    marginTop: 6,
  },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  trendText: {
    color: colors.secondarySoft,
    fontSize: 12,
    fontWeight: "800",
  },
  heroBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heroCaption: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: "700",
  },
  heroCaptionValue: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },
  quickStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    marginLeft: -8,
  },
  walletLetter: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
  },
  metricsGrid: {
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
  donutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  legendColumn: {
    flex: 1,
    gap: 12,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  legendValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  transactionList: {
    gap: 12,
  },
  parserHero: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  parserIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  parserCopy: {
    flex: 1,
    gap: 4,
  },
  parserTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  parserBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  parserStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  parserStatItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  parserStatValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  parserStatLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  parserStatDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: colors.border,
  },
});