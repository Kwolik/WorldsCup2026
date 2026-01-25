import { Stack } from "expo-router";
import { View, StyleSheet, Text } from "react-native";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="LoginScreen/index"
        options={() => ({
          title: "Logowanie",
          headerBackVisible: false,
          headerTitle: (props) => (
            <View style={styles.header}>
              <Text style={styles.title}>{props.children}</Text>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="RegistrationScreen/index"
        options={() => ({
          title: "Rejestracja",
          headerBackVisible: false,
          headerTitle: (props) => (
            <View style={styles.header}>
              <Text style={styles.title}>{props.children}</Text>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="private"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 60,
    marginTop: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
