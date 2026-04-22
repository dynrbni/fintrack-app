import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { colors, radius, shadows, spacing } from "../../src/theme";

export default function SignUpScreen() {
  const { signUp, configured } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignUp() {
    setErrorMessage(null);
    setLoading(true);

    try {
      await signUp(email.trim(), password, fullName.trim());
      Alert.alert("Account created", "Check your email or continue signing in.");
      router.replace("/sign-in");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account.";
      setErrorMessage(message);
      Alert.alert("Sign up failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#FCF8FF", "#F7F1FF", "#EEF6FF"]} style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.heroCard}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <MaterialCommunityIcons name="account-plus-outline" size={20} color={colors.surface} />
              </View>
              <View>
                <Text style={styles.kicker}>Get started</Text>
                <Text style={styles.heroTitle}>Build your money dashboard.</Text>
              </View>
            </View>
            <Text style={styles.heroCopy}>
              The signup flow stays inside Supabase, so email auth, session persistence, and profile creation all share the same backend.
            </Text>
            {!configured ? (
              <View style={styles.demoBanner}>
                <MaterialCommunityIcons name="information-outline" size={16} color={colors.primary} />
                <Text style={styles.demoText}>Supabase is offline. Configure your env vars before using live auth.</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>Create account</Text>

            <View style={styles.inputWrap}>
              <MaterialCommunityIcons name="account-outline" size={18} color={colors.muted} />
              <TextInput
                style={styles.input}
                autoCapitalize="words"
                placeholder="Full name"
                placeholderTextColor={colors.faint}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputWrap}>
              <MaterialCommunityIcons name="email-outline" size={18} color={colors.muted} />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email address"
                placeholderTextColor={colors.faint}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrap}>
              <MaterialCommunityIcons name="lock-outline" size={18} color={colors.muted} />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="Password"
                placeholderTextColor={colors.faint}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Pressable
              onPress={handleSignUp}
              disabled={loading}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>{loading ? "Creating account..." : "Create account"}</Text>
            </Pressable>

            <Pressable onPress={() => router.replace("/sign-in")} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </Pressable>

            {!configured ? (
              <Pressable onPress={() => router.replace("/dashboard")} style={({ pressed }) => [styles.demoButton, pressed && styles.pressed]}>
                <Text style={styles.demoButtonText}>Preview app in demo mode</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: "center",
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  kicker: {
    color: colors.tertiary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginTop: 2,
  },
  heroCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  demoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  demoText: {
    flex: 1,
    color: colors.primary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    minHeight: 54,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.tertiary,
    borderRadius: radius.pill,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  demoButton: {
    minHeight: 50,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  demoButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});