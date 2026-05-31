import { StyleSheet, View } from "react-native";
import React from "react";
import { AuthStore } from "../store.js";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import LoadingScreen from "../components/LoadingScreen";

export default function Page() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { initialized, isLoggedIn } = AuthStore.useState();

  React.useEffect(() => {
    // 1. Jeśli nawigacja nie jest jeszcze podpięta lub Firebase nie odpowiedział, czekamy
    if (!navigationState?.key || !initialized) return;

    const currentSegment = segments[0];
    const inPrivateGroup = currentSegment === "private";
    
    // Sprawdzamy czy na pewno jesteśmy w folderze logowania (bierzemy pod uwagę różne warianty Expo)
    const inLoginScreen = currentSegment === "LoginScreen" || currentSegment === "(LoginScreen)";

    // Używamy setTimeout, aby dać Expo Routerowi 100ms na upewnienie się, że drzewo widoków jest stabilne
    const navigationTimeout = setTimeout(() => {
      if (!isLoggedIn) {
        // JEŚLI NIEZALOGOWANY:
        if (inPrivateGroup || !inLoginScreen) {
          console.log("[Guard] Niezalogowany. Próba przekierowania do logowania...");
          
          try {
            // Próba A: Standardowa ścieżka bez ukośnika
            router.replace("/LoginScreen");
          } catch (err) {
            // Próba awaryjna B: Jeśli Expo Router upiera się przy pełnej ścieżce do indexu
            router.replace("/LoginScreen/index");
          }
        }
      } else {
        // JEŚLI ZALOGOWANY:
        if (inLoginScreen || !inPrivateGroup) {
          console.log("[Guard] Zalogowany. Przekierowanie do HomeScreen...");
          try {
            router.replace("/private/HomeScreen");
          } catch (err) {
            router.replace("/private/HomeScreen/index");
          }
        }
      }
    }, 100);

    return () => clearTimeout(navigationTimeout);
  }, [isLoggedIn, segments, navigationState?.key, initialized]);

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