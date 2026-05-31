import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { LogBox } from "react-native";
import React, { useEffect } from "react";
import { AuthStore } from "../store";

LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications",
  "`expo-notifications` functionality is not fully supported in Expo Go",
]);

export default function _layout() {
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  // Pobieramy stany logowania ze store
  const { initialized, isLoggedIn } = AuthStore.useState();

  useEffect(() => {
    // KLUCZOWA ZMIANA: Sprawdzamy czy stan nawigacji głównej jest w pełni załadowany i gotowy
    const isNavigationReady = rootNavigationState?.key;

    if (!isNavigationReady || !initialized) {
      return;
    }

    // Używamy setTimeout(..., 0), aby wrzucić nawigację na koniec kolejki zdarzeń (Event Loop).
    // Daje to Expo Routerowi czas na stuprocentowe zamontowanie komponentu Stack.
    const timeout = setTimeout(() => {
      const currentSegment = segments[0];
      const inPrivateGroup = currentSegment === "private";
      const inAuthGroup =
        currentSegment === "LoginScreen" ||
        currentSegment === "RegistrationScreen";

      if (!isLoggedIn) {
        // Jeśli użytkownik jest niezalogowany i próbuje wejść w private lub jest na root index
        if (inPrivateGroup || !inAuthGroup) {
          router.replace("/LoginScreen");
        }
      } else {
        // Jeśli użytkownik jest zalogowany, a siedzi na logowaniu/rejestracji lub root index
        if (inAuthGroup || currentSegment === undefined) {
          router.replace("/private/HomeScreen");
        }
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [isLoggedIn, initialized, segments, rootNavigationState?.key]);

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
