import { useEffect, useState } from "react";
import { Tabs, useRouter, usePathname } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificationService } from "./../../components/NotificationService";
import { NotificationsModal } from "./../../components/NotificationsModal/index";

const CustomHeader = ({ title, showBackButton }) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setModalVisible(false);
  }, [pathname]);

  return (
    <View
      style={{
        paddingTop: insets.top,
        height: 60 + insets.top,
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
      }}
    >
      {showBackButton && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.backButton}></View>
      {/* Dzwonek powiadomień w kółku */}
      {/* <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Ionicons name="notifications" size={32} color="#FFFFFF" />
          <View style={styles.badge} />
        </TouchableOpacity>
        <NotificationsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View> */}
    </View>
  );
};

export default function _layout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    NotificationService.registerForPushNotifications();

    // 1. Reagowanie na powiadomienie, gdy apka jest OTWARTA
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        NotificationService.saveToHistory(notification);
      });

    // 2. Reagowanie na KLIKNIĘCIE w powiadomienie
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { screen, matchId } = response.notification.request.content.data;

        if (screen) {
          // Nawigacja do konkretnego meczu przez expo-router
          router.push({ pathname: screen, params: { id: matchId } });
        }
      });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerTransparent: true,
        tabBarStyle: {
          backgroundColor: "#003279",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          height: 80 + (Platform.OS === "ios" ? insets.bottom : 10),
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 10,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarShowLabel: true,
        header: ({ options }) => (
          <CustomHeader title={options.title} showBackButton={true} />
        ),
      }}
    >
      <Tabs.Screen
        name="HomeScreen/index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="RankedScreen/index"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="trophy-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="MatchesScreen/index"
        options={{
          title: "Mecze",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View style={styles.footballButtonContainer}>
              <View
                style={[
                  styles.footballButton,
                  { backgroundColor: focused ? "#0047AB" : "#003279" },
                ]}
              >
                <FontAwesome5 name="futbol" size={32} color="#FFFFFF" />
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="GroupsScreen/index"
        options={{
          title: "Grupy",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="SettingsScreen/index"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="MatchScreen/index"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="MatchScreen/styles"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginLeft: -24,
  },
  backButton: {
    padding: 8,
    //backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
  },
  footballButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    width: 64,
    marginBottom: Platform.OS === "ios" ? 20 : 30,
  },
  footballButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4B4B",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
});
