import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HapticTab } from "@/components/haptic-tab";

export function MaterialTabBar(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props;
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? "light"].tint;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const descriptor = descriptors[route.key];
          const label = descriptor.options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            } as any);
            const prevented = (event as any)?.defaultPrevented;
            if (!focused && !prevented) {
              navigation.navigate(route.name as any);
            }
          };

          return (
            <HapticTab
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress as any}
              style={styles.tabButton}
            >
              <IconSymbol
                size={22}
                name={getIconName(route.name)}
                color={focused ? tint : "#999"}
              />
              <Text style={[styles.label, { color: focused ? tint : "#999" }]}>
                {label}
              </Text>
            </HapticTab>
          );
        })}
      </View>
    </View>
  );
}

function getIconName(routeName: string) {
  switch (routeName) {
    case "index":
      return "house.fill";
    case "explore":
      return "paperplane.fill";
    default:
      return "square.grid.2x2";
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Platform.OS === "android" ? 8 : 12,
    paddingHorizontal: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  label: { fontSize: 12, marginTop: 2 },
});
