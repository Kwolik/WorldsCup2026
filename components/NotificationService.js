import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_HISTORY_KEY = "@notification_history";

// Dokonfigurować potem powiadomienia pod Androida a na iOS będą tylko działać te zaplanowane
// Konfiguracja zachowania powiadomień, gdy aplikacja jest otwarta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  // Rejestracja i prośba o uprawnienia
  registerForPushNotifications: async () => {
    if (!Device.isDevice) return;

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
  },

  // Funkcja do planowania przypomnienia o meczu (Lokalne)
  scheduleMatchReminder: async (matchTitle, date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Czas na zakład!!!",
        body: `Mecz ${matchTitle} zaczyna się niedługo. Obstaw wynik!`,
        data: { screen: "MatchesScreen" },
      },
      trigger: date, // Obiekt Date (np. 15 minut przed meczem)
    });
  },

  // Wysyłanie natychmiastowego powiadomienia (np. lista meczów)
  sendImmediateNotification: async (title, body) => {
    await Notifications.getPresentedNotificationsAsync({
      title: "🏓 Test Lisan al Gaib",
      body: "Jeśli to widzisz, Twój system powiadomień działa idealnie!",
      data: { screen: "HomeScreen/index" }, // Możesz tu wpisać dowolną ścieżkę
    });
  },

  saveToHistory: async (notification) => {
    try {
      const historyRaw = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
      const history = historyRaw ? JSON.parse(historyRaw) : [];

      const newEntry = {
        id: notification.request.identifier,
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data,
        date: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        NOTIFICATION_HISTORY_KEY,
        JSON.stringify([newEntry, ...history].slice(0, 20)),
      ); // Trzymamy 20 ostatnich
    } catch (e) {
      console.error("Błąd zapisu historii", e);
    }
  },

  getHistory: async () => {
    const history = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  },

  // Harmonogram dla meczu
  scheduleMatchReminder: async (matchId, matchTitle, date) => {
    const trigger = new Date(date);
    // trigger.setMinutes(trigger.getMinutes() - 15); // Opcjonalnie 15 min wcześniej

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏓 Czas na typowanie!",
        body: `Mecz ${matchTitle} zaraz się zaczyna. Wejdź i obstaw!`,
        data: { screen: "/MatchScreen/index", matchId: matchId }, // Dane do nawigacji
      },
      trigger,
    });
  },

  // Dodaj to do NotificationService.js
  scheduleQuickTest: async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Przypomnienie o meczu",
        body: "Mecz Polska vs Brazylia zaczyna się za chwilę!",
        data: { screen: "MatchesScreen/index", matchId: "test-123" },
      },
      trigger: { seconds: 5 }, // Powiadomienie pojawi się za dokładnie 5 sekund
    });
  },
};
