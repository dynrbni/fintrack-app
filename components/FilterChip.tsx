import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius } from "../src/theme";

type FilterChipProps = {
  label: string;
  active?: boolean;
  icon?: string;
  onPress: () => void;
};

export function FilterChip({ label, active = false, icon, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.activeChip : styles.inactiveChip,
        pressed && styles.pressed,
      ]}
    >
      {icon ? <MaterialCommunityIcons name={icon as never} size={14} color={active ? colors.surface : colors.muted} /> : null}
      <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  inactiveChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.94,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
  activeLabel: {
    color: colors.surface,
  },
  inactiveLabel: {
    color: colors.muted,
  },
});