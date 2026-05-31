import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { AuthStore } from "../../store";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import LoadingScreen from "../../components/LoadingScreen";

export default function Page() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  // Pobieramy stany z poprawionego store.js
  const { initialized, isLoggedIn } = AuthStore.useState();

  React.useEffect(() => {
    // 1. Blokada bezpieczeństwa: Czekamy, aż Expo Router zbuduje strukturę linków
    // oraz aż Firebase zwróci informację o sesji (initialized: true)
    if (!navigationState?.key || !initialized) {
      return;
    }

    // 2. Sprawdzamy, w jakim folderze/miejscu aktualnie znajduje się użytkownik
    const currentSegment = segments[0];
    const inPrivateGroup = currentSegment === "private";
    const inLoginScreen = currentSegment === "LoginScreen";

    console.log(
      `[Guard] Sesja gotowa. Zalogowany: ${isLoggedIn}, Aktualny segment: /${currentSegment || ""}`,
    );

    // 3. LOGIKA STRAŻNIKA:
    if (!isLoggedIn) {
      // Przypadek A: Użytkownik NIE jest zalogowany, a próbuje wejść do strefy prywatnej
      if (inPrivateGroup || !inLoginScreen) {
        console.log("[Guard] Niezalogowany! Przekierowanie do /LoginScreen");
        router.replace("/LoginScreen");
      }
    } else {
      // Przypadek B: Użytkownik JEST zalogowany, ale utknął na ekranie logowania lub stronie startowej
      if (inLoginScreen || !inPrivateGroup) {
        console.log(
          "[Guard] Zalogowany! Automatyczne przeniesienie do /private/HomeScreen",
        );
        router.replace("/private/HomeScreen");
      }
    }
  }, [isLoggedIn, segments, navigationState?.key, initialized]);

  // Dopóki trwa ładowanie, pokazujemy LoadingScreen
  return (
    <View style={styles.container}>
      <LoadingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
