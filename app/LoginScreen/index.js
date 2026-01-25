import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React from "react";
import styles from "./styles.js";
import { router } from "expo-router";
import { appSignIn } from "../../store.js";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const insets = useSafeAreaInsets();

  const topPadding = insets.top + 40;

  // 1. Konfiguracja Requestu Google na później
  const [request, response, promptAsync] = Google.useAuthRequest({
    useProxy: false,
    webClientId: "TWÓJ-WEB-CLIENT-ID.apps.googleusercontent.com",
    iosClientId: "TWÓJ-IOS-CLIENT-ID.apps.googleusercontent.com", // jeśli masz
    androidClientId: "TWÓJ-ANDROID-CLIENT-ID.apps.googleusercontent.com", // jeśli masz
  });

  // 2. Obsługa odpowiedzi z Google
  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          router.replace("/private/HomeScreen");
        })
        .catch((error) => console.error("Firebase Google Error:", error));
    }
  }, [response]);

  const handleGoogleSignIn = () => {
    promptAsync(); // Uruchamia okno logowania
  };

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.image}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, paddingTop: topPadding }}>
        {/* Sekcja Email */}
        <View style={styles.email}>
          <View style={styles.descView}>
            <Text style={styles.emailTitle}>Email</Text>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.emailInput}
              onChangeText={onChangeEmail}
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          </View>
        </View>

        {/* Sekcja Hasło */}
        <View style={styles.email}>
          <View style={styles.descView}>
            <Text style={styles.emailTitle}>Hasło</Text>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.emailInput}
              onChangeText={onChangePassword}
              autoComplete="current-password"
              secureTextEntry={true}
              textContentType="password"
            />
          </View>
        </View>

        {/* Sekcja Przycisków - Zmiana na dwa przyciski obok siebie */}
        <View style={styles.buttons}>
          {/* Przycisk Google */}
          {/* <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <Image
              source={{
                uri: "https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png",
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity> */}

          {/* Przycisk Zaloguj */}
          <TouchableOpacity
            style={styles.buttonLogged}
            onPress={async () => {
              const resp = await appSignIn(email, password);
              if (resp?.user) {
                router.replace("/private/HomeScreen");
              } else {
                console.log(resp.error);
              }
            }}
          >
            <Text style={styles.buttonTitle}>Zaloguj się</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.routeRegistiration}
          onPress={() => router.push("/RegistrationScreen")}
        >
          <View style={styles.descViewFirst}>
            <Text style={styles.descTextFirst}>
              Nie jesteś jeszcze zarejestrowany?
            </Text>
          </View>
          <View style={styles.descViewTwo}>
            <Text style={styles.descTextTwo}>
              Kliknij i przejdź do rejestracji
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}
