import { View, ImageBackground, FlatList, Text } from "react-native";
import { useEffect, useState } from "react";
import styles from "../../../styles/Matches/styles.js";
import NextMatch from "../../../components/NextMatch/index.js";
import RowMatch from "../../../components/RowMatch/index.js";
import { db } from "../../../firebaseConfig.js";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import LoadingScreen from "../../../components/LoadingScreen/index.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MatchesScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todoRef = collection(db, "matches2026");
    const q = query(todoRef, orderBy("id", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const matchArray = [];
        querySnapshot.forEach((doc) => {
          matchArray.push({
            id: doc.id,
            club1: doc.data().club1,
            club1id: doc.data().club1id,
            club2: doc.data().club2,
            club2id: doc.data().club2id,
            result: doc.data().result,
            date: doc.data().date,
            hour: doc.data().hour,
          });
        });

        setMatches(matchArray);
        setLoading(false); // Wyłącza ładowanie po otrzymaniu odpowiedzi z Firebase
      },
      (error) => {
        console.error("Błąd pobierania meczów: ", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // KROK 1: Jeśli dane z sieci się jeszcze ładują, pokazujemy LoadingScreen na pełnym ekranie
  if (loading) {
    return (
      <ImageBackground
        source={require("../../../assets/background.jpg")}
        style={styles.image}
        resizeMode="stretch"
      >
        <LoadingScreen />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../../assets/background.jpg")}
      style={styles.image}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.matchNext}>
          <NextMatch />
        </View>

        {matches.length > 0 && (
          <View style={styles.flatlist}>
            <FlatList
              data={matches}
              numColumns={1}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RowMatch
                  id={item.id}
                  club1={item.club1}
                  club1id={item.club1id}
                  club2={item.club2}
                  club2id={item.club2id}
                  date={item.date}
                  hour={item.hour}
                  result={item.result}
                />
              )}
            />
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
