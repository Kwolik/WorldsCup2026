import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles";
import CountryFlag from "react-native-country-flag";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  where,
  limit,
  query,
  orderBy,
  documentId,
} from "firebase/firestore";
import { useRouter } from "expo-router";

export default function NextMatch() {
  const [match, setMatch] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // Czas w sekundach do meczu
  const router = useRouter();

  // 1. Pobieranie najbliższego meczu z bazy danych
  const fetchNextMatch = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimestampString = `${year}${month}${day}${hours}${minutes}`;
      const matchesRef = collection(db, "matches2026");

      const q = query(
        matchesRef,
        where(documentId(), ">=", currentTimestampString),
        orderBy(documentId(), "asc"),
        limit(1),
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const matchData = {
          id: docSnap.id,
          ...docSnap.data(),
        };

        setMatch(matchData);
        calculateInitialTime(matchData);
      } else {
        console.log("Brak nadchodzących meczów w bazie danych.");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania najbliższego meczu:", error);
    }
  };

  // 2. Obliczanie ile sekund zostało do rozpoczęcia meczu
  const calculateInitialTime = (matchData) => {
    if (!matchData || !matchData.date || !matchData.hour) return;

    try {
      const now = new Date();
      const [day, month] = matchData.date.split(".").map(Number);
      const [hours, minutes] = matchData.hour.split(":").map(Number);

      // Budujemy pełny obiekt daty rozpoczęcia meczu
      const matchDate = new Date(
        now.getFullYear(),
        month - 1, // Miesiące w JS są indeksowane od 0 do 11
        day,
        hours,
        minutes,
        0,
      );

      const diffInSeconds = Math.floor(
        (matchDate.getTime() - now.getTime()) / 1000,
      );
      setTimeLeft(diffInSeconds > 0 ? diffInSeconds : 0);
    } catch (err) {
      console.error("Błąd podczas parsowania czasu meczu:", err);
    }
  };

  useEffect(() => {
    fetchNextMatch();
  }, []);

  // 3. Odliczanie timera co sekundę
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Formaty wyświetlania minut i sekund (zabezpieczone matematycznie)
  const displayMinutes = Math.floor((timeLeft % 3600) / 60);
  const displaySeconds = timeLeft % 60;
  const isVisible = match && timeLeft > 0 && timeLeft <= 15 * 60;

  if (!isVisible) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.navigate({
          pathname: "/private/MatchScreen",
          params: { id: match.id },
        })
      }
    >
      <View style={styles.top}>
        <View style={styles.row}>
          <Ionicons name="football-outline" style={styles.icon} />
          <Text style={styles.info}>{match.date}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="timer-outline" style={styles.icon} />
          <Text style={[styles.info, { color: "red", fontWeight: "bold" }]}>
            {`${displayMinutes < 10 ? "0" : ""}${displayMinutes}:${displaySeconds < 10 ? "0" : ""}${displaySeconds}`}
          </Text>
        </View>
      </View>

      <View style={styles.flags}>
        <View style={styles.teamContainer}>
          <CountryFlag
            isoCode={match.club1id ? match.club1id : ""}
            size={28}
            style={styles.flag}
          />
          <Text style={styles.name}>{match.club1}</Text>
        </View>
        <View style={styles.teamContainer}>
          <CountryFlag
            isoCode={match.club2id ? match.club2id : ""}
            size={28}
            style={styles.flag}
          />
          <Text style={styles.name}>{match.club2}</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.team}>Obstaw mecz</Text>
      </View>
    </TouchableOpacity>
  );
}
