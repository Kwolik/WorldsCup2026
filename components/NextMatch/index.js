import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles";
import CountryFlag from "react-native-country-flag";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { collection, getDocs, where, limit, query, orderBy } from "firebase/firestore";
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
        where("id", ">", currentTimestampString), 
        orderBy("id", "asc"), 
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const matchData = {
          id: doc.id,
          ...doc.data()
        };
        
        setMatch(matchData);
        calculateInitialTime(matchData);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania najbliższego meczu:", error);
    }
  };

  // 2. Obliczanie ile sekund zostało do rozpoczęcia wyciągniętego meczu
  const calculateInitialTime = (matchData) => {
    if (!matchData || !matchData.date || !matchData.hour) return;

    // Przekształcamy datę z bazy (np. data: "17.05", godzina: "21:00") na pełny obiekt Date
    const now = new Date();
    const [day, month] = matchData.date.split(".");
    const [hours, minutes] = matchData.hour.split("."); // jeśli w bazie masz hh:mm zmień na ':'

    const matchDate = new Date(
      now.getFullYear(),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      0
    );

    const diffInSeconds = Math.floor((matchDate.getTime() - now.getTime()) / 1000);
    setTimeLeft(diffInSeconds > 0 ? diffInSeconds : 0);
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

  // Formaty wyświetlania minut i sekund
  const displayMinutes = Math.floor(timeLeft / 60);
  const displaySeconds = timeLeft % 60;

  // Warunek widoczności: Komponent pojawia się TYLKO gdy mamy mecz ORAZ zostało do niego 15 minut (900 sekund) lub mniej
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
          <Text style={styles.info}>{match.date} o {match.hour}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="timer-outline" style={styles.icon} />
          <Text style={[styles.info, { color: "red" }]}>
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