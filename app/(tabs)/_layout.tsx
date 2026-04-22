import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { colors } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: {
          height: 72,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: "rgba(255,255,255,0.98)",
          shadowColor: colors.primary,
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 18,
          elevation: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconName =
            route.name === "dashboard"
              ? focused
                ? "home"
                : "home-outline"
              : route.name === "transactions"
                ? focused
                  ? "receipt-text"
                  : "receipt-text-outline"
                : route.name === "insights"
                  ? focused
                    ? "chart-line"
                    : "chart-line-variant"
                  : focused
                    ? "account"
                    : "account-outline";

          return <MaterialCommunityIcons name={iconName as never} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Home" }} />
      <Tabs.Screen name="transactions" options={{ title: "History" }} />
      <Tabs.Screen name="insights" options={{ title: "Insights" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}