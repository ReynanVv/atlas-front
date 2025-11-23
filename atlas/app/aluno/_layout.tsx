import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function AlunoLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF4D00",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 64, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="personais"
        options={{
          title: "Personais",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="treinos"
        options={{
          title: "Treinos",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fitness-center" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="plano"
        options={{
          title: "Plano",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="calendar-today" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />

      {/* Additional screens kept accessible via navigation (not shown as tabs) */}
      <Tabs.Screen
        name="workout"
        options={{ href: null, headerShown: false, title: "Treino" }}
      />
      <Tabs.Screen
        name="personal/[id]"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}
