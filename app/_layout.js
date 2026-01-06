import { Stack } from "expo-router";
import { Image, View, StyleSheet, Text } from "react-native";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="LoginScreen/index"
        options={() => ({
          title: "Logowanie",
          headerTitle: (props) => (
            <View style={styles.header}>
              <Text style={styles.title}>{props.children}</Text>
            </View>
          ),
          headerBackground: () => (
            <Image
              style={styles.image}
              source={require("../assets/background.jpg")}
            />
          ),
          statusBarColor: "#003279",
        })}
      />
      <Stack.Screen
        name="RegistrationScreen/index"
        options={() => ({
          title: "Rejestracja",
          headerTitle: (props) => (
            <View style={styles.header}>
              <Text style={styles.title}>{props.children}</Text>
            </View>
          ),
          headerBackground: () => (
            <Image
              style={styles.image}
              source={require("../assets/background.jpg")}
            />
          ),
          statusBarColor: "#003279",
        })}
      />
      <Stack.Screen name="private" options={{ headerShown: false }} />
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
    textShadowColor: "#003279",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
  },
});
