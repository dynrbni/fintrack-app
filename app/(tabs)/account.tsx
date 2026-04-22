import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { parsedEmails, wallets } from "../../src/mock";
import { colors, radius, shadows, spacing } from "../../src/theme";

export default function AccountScreen() {
  const { user, configured, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Alex";

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out.";
      Alert.alert("Sign out failed", message);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
        <View style={styles.iconButton}>
          <MaterialCommunityIcons name="cog-outline" size={18} color={colors.text} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? "demo@fintrack.app"}</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <MaterialCommunityIcons
              name={configured ? "check-circle-outline" : "alert-circle-outline"}
              size={16}
              color={configured ? colors.secondary : colors.warning}
            />
            <Text style={[styles.statusText, configured ? styles.statusOk : styles.statusWarn]}>
              {configured ? "Supabase connected" : "Demo mode"}
            </Text>
          </View>
          <Text style={styles.statusCopy}>
            {configured
              ? "Authentication, transactions, and email parsing can all use the same project."
              : "Add your Supabase env vars to enable live auth and backend sync."}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionTop}>
          <Text style={styles.sectionTitle}>Wallets</Text>
          <Text style={styles.sectionMeta}>{wallets.length} connected</Text>
        </View>
        <View style={styles.walletList}>
          {wallets.map((wallet) => (
            <View key={wallet.id} style={styles.walletRow}>
              <View style={[styles.walletDot, { backgroundColor: wallet.color }]} />
              <View style={styles.walletCopy}>
                <Text style={styles.walletName}>{wallet.name}</Text>
                <Text style={styles.walletMeta}>{wallet.institution}</Text>
              </View>
              <Text style={styles.walletAmount}>Rp {wallet.balance.toLocaleString("id-ID")}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionTop}>
          <Text style={styles.sectionTitle}>Email parsing</Text>
          <Text style={styles.sectionMeta}>{parsedEmails.length} samples</Text>
        </View>
        <View style={styles.parserCard}>
          <MaterialCommunityIcons name="email-fast-outline" size={20} color={colors.primary} />
          <View style={styles.parserCopy}>
            <Text style={styles.parserTitle}>Supabase edge function ready</Text>
            <Text style={styles.parserBody}>
              Feed inbound receipt notifications into a parse-email function and save structured transactions.
            </Text>
          </View>
        </View>
        <Pressable onPress={() => router.push("/email-parser")} style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
          <Text style={styles.linkButtonText}>Open parser workspace</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Session</Text>
        <Text style={styles.sessionCopy}>
          {configured
            ? "You are signed in through Supabase Auth."
            : "This screen is in demo mode until the Supabase environment variables are filled in."}
        </Text>
        <Pressable
          onPress={handleSignOut}
          disabled={!configured || signingOut}
          style={({ pressed }) => [styles.signOutButton, (!configured || signingOut) && styles.disabled, pressed && styles.pressed]}
        >
          <Text style={styles.signOutText}>{signingOut ? "Signing out..." : "Sign out"}</Text>
        </Pressable>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.soft,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900",
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  profileEmail: {
    color: colors.muted,
    fontSize: 13,
  },
  statusRow: {
    gap: 10,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  statusOk: {
    color: colors.secondary,
  },
  statusWarn: {
    color: colors.warning,
  },
  statusCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  walletList: {
    gap: 12,
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  walletDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  walletCopy: {
    flex: 1,
    gap: 2,
  },
  walletName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  walletMeta: {
    color: colors.muted,
    fontSize: 12,
  },
  walletAmount: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  parserCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  parserCopy: {
    flex: 1,
    gap: 4,
  },
  parserTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  parserBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  linkButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  linkButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  sessionCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  signOutButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.errorSoft,
    borderWidth: 1,
    borderColor: "#F5B7B0",
  },
  signOutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "800",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});