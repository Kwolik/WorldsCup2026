import { StyleSheet, View, ImageBackground } from "react-native";
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

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/LoginScreen");
    } else if (isLoggedIn) {
      router.replace("/HomeScreen");
    }
  }, [segments, navigationState?.key, initialized]);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.jpg")}
        style={styles.image}
        resizeMode="stretch"
      >
        <LoadingScreen />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
});
