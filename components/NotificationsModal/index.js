import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { NotificationService } from "./../NotificationService";
import styles from "./styles";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export const NotificationsModal = ({ visible, onClose }) => {
  const [history, setHistory] = useState([]);
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      loadHistory();
      // Animacja otwierania
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animacja zamykania
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const loadHistory = async () => {
    const data = await NotificationService.getHistory();
    setHistory(data);
  };

  if (!visible && fadeAnim._value === 0) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: -100,
        right: -20,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        zIndex: 5000,
      }}
      pointerEvents={visible ? "auto" : "none"}
    >
      {/* Kliknięcie w to tło zamyka okienko */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.popoverContainer,
          {
            opacity: fadeAnim, // Animacja przezroczystości
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1], // Lekkie powiększenie od 95% do 100%
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.arrow} />
        <View style={styles.header}>
          <Text style={styles.title}>Powiadomienia</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFF" />
          </Pressable>
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 300 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() => {
                onClose();
                if (item.data?.screen)
                  router.push({
                    pathname: item.data.screen,
                    params: { id: item.data.matchId },
                  });
              }}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemBody} numberOfLines={2}>
                {item.body}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Brak powiadomień</Text>
          }
        />
      </Animated.View>
    </View>
  );
};
