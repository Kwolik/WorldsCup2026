import { View, ImageBackground, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import styles from "../../../styles/Home/styles.js";
import NextMatch from "../../../components/NextMatch/index.js";
import TopRanked from "../../../components/TopRanked/index.js";
import RowMatch from "../../../components/RowMatch/index.js";
import ChampionRow from "../../../components/ChampionRow/index.js";
import KingFootballerRow from "../../../components/KingFootballerRow/index.js";
import { db } from "../../../firebaseConfig.js";
import {
  where,
  orderBy,
  collection,
  query,
  limit,
  getDocs,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [nextMatches, setNextMatches] = useState([]);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1); // Odmierzanie wczorajszego dnia (obsługuje przełomy miesięcy/lat)

  // Formatowanie do postaci "DD.MM" (z zerami wiodącymi)
  const formatDateString = (dateObj) => {
    return dateObj.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const todayStr = formatDateString(today); // np. "23.05"
  const yesterdayStr = formatDateString(yesterday); // np. "22.05"

  // Generowanie ID do zapytania Firestore (RRRRMMDD)
  const getFirestoreDateId = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  };

  const next3Matches = async () => {
    try {
      const todoRef = collection(db, "matches");
      const yesterdayId = getFirestoreDateId(yesterday);

      const q = query(
        todoRef,
        where("id", ">=", yesterdayId),
        orderBy("id"),
        limit(10),
      );

      const doc_refs = await getDocs(q);
      const fetchedMatches = doc_refs.docs.map((doc) => ({
        id: doc.id,
        club1: doc.data().club1,
        club1id: doc.data().club1id,
        club2: doc.data().club2,
        club2id: doc.data().club2id,
        result: doc.data().result,
        date: doc.data().date,
        hour: doc.data().hour,
      }));

      setNextMatches(fetchedMatches);
    } catch (error) {
      console.error("Błąd podczas pobierania meczów głównego ekranu:", error);
    }
  };

  useEffect(() => {
    next3Matches();
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/background.jpg")}
      style={styles.image}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.nextMatch}>
            <NextMatch />
          </View>
          <View style={{ marginLeft: 2 }}>
            <TopRanked />
          </View>

          <View style={styles.matches3}>
            {nextMatches.map(
              (team, index) =>
                team.date === todayStr && (
                  <RowMatch
                    key={`today-${team.id}-${index}`}
                    id={team.id}
                    club1={team.club1}
                    club1id={team.club1id}
                    club2={team.club2}
                    club2id={team.club2id}
                    date={team.date}
                    hour={team.hour}
                    result={team.result}
                  />
                ),
            )}
          </View>

          <View style={styles.matches3}>
            {nextMatches.map(
              (team, index) =>
                team.date === yesterdayStr && (
                  <RowMatch
                    key={`yesterday-${team.id}-${index}`}
                    id={team.id}
                    club1={team.club1}
                    club1id={team.club1id}
                    club2={team.club2}
                    club2id={team.club2id}
                    date={team.date}
                    hour={team.hour}
                    result={team.result}
                  />
                ),
            )}
          </View>

          <View style={styles.matches3}>
            <ChampionRow />
          </View>
          <View style={styles.kingFootballer}>
            <KingFootballerRow />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
