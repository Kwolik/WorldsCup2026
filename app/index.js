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
    if (!navigationState?.key || !initialized) return;

    if (!isLoggedIn) {
      router.replace("/LoginScreen");
    } else if (isLoggedIn) {
      router.replace("/private/HomeScreen");
    }
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
