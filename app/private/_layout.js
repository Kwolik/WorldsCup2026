import { Stack, useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons"; 
import { appSignOut } from "../../store";

export default function HomeLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="HomeScreen/index"
        options={{ headerShown: false, statusBarColor: "#003279" }}
      />
      <Stack.Screen
        name="MatchesScreen/index"
        options={() => ({
          title: "Mecze",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                style={styles.iconBack}
              />
            </TouchableOpacity>
          ),
          headerTitle: (props) => (
            <View style={styles.header}>
              <Text style={styles.title}>{props.children}</Text>
            </View>
          ),
          headerBackground: () => (
            <ImageBackground
              style={styles.image}
              source={require("../../assets/background.jpg")}
              resizeMode="cover"
            />
          ),
          statusBarColor: "#003279",
        })}
      />
      <Stack.Screen
        name="MatchScreen/index"
        options={{ headerShown: false, statusBarColor: "#003279" }}
      />
      <Stack.Screen
        name="RankedScreen/index"
        headerBackVisible={false}
        options={() => ({
          title: "Ranking",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                style={styles.iconBack}
              />
            </TouchableOpacity>
          ),
          headerTitle: (props) => (
            <View style={styles.header}>
              <Text style={styles.title}>{props.children}</Text>
            </View>
          ),
          headerBackground: () => (
            <ImageBackground
              style={styles.image}
              source={require("../../assets/background.jpg")}
              resizeMode="cover"
            />
          ),
          statusBarColor: "#003279",
        })}
      />
      <Stack.Screen
        name="SettingsScreen/index"
        headerBackVisible={false}
        options={() => ({
          title: "Profil",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                style={styles.iconBack}
              />
            </TouchableOpacity>
          ),
          headerTitle: (props) => (
            <View style={styles.header}>
              <Text style={styles.title}>{props.children}</Text>
              <TouchableOpacity
                onPress={async () => {
                  const resp = await appSignOut();
                  if (!resp?.error) {
                    router.replace("/(auth)/LoginScreen");
                  }
                }}
              >
                <MaterialCommunityIcons name="logout" style={styles.iconMain} />
              </TouchableOpacity>
            </View>
          ),
          headerBackground: () => (
            <ImageBackground
              style={styles.image}
              source={require("../../assets/background.jpg")}
              resizeMode="cover"
            />
          ),
          statusBarColor: "#003279",
        })}
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
  logo: {
    width: 42,
    height: 56,
    marginRight: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    textShadowColor: "#003279",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  image: {
    flex: 1,
  },
  iconMain: {
    fontSize: 32,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  buttonBack: {
    position: "absolute",
    left: -20,
  },
  iconBack: {
    fontSize: 32,
    color: "#FFFFFF",
  },
});
