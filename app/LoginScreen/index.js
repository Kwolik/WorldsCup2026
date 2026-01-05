import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import styles from "./styles.js";
import { router } from "expo-router";
import { appSignIn } from "../../store.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/background.jpg")}
        style={styles.image}
      >
        <SafeAreaView style={{ backgroundColor: "red" }}>
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
              ></TextInput>
            </View>
          </View>

          <View style={styles.email}>
            <View style={styles.descView}>
              <Text style={styles.emailTitle}>Hasło</Text>
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.emailInput}
                onChangeText={onChangePassword}
                autoComplete="new-password"
                secureTextEntry={true}
                textContentType="newPassword"
              ></TextInput>
            </View>
          </View>

          <View style={styles.buttons}>
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
        </SafeAreaView>
        <TouchableOpacity
          style={styles.routeRegistiration}
          onPress={() => router.replace("/RegistrationScreen")}
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
      </ImageBackground>
    </View>
  );
}
