import { View, ImageBackground, Text } from "react-native";
import { useState, useEffect } from "react";
import styles from "../../../styles/Ranked/styles.js";
import TopRanked from "../../../components/TopRanked/index.js";
import PlayerRanked from "../../../components/PlayerRanked/index.js";
import { db } from "../../../firebaseConfig.js";
import { orderBy, collection, query, onSnapshot } from "firebase/firestore";
import LoadingScreen from "../../../components/LoadingScreen/index.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RankedScreen() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const todoRef = collection(db, "users");
    const q = query(todoRef, orderBy("points2026", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const match = [];
        querySnapshot.forEach((doc) => {
          match.push({
            id: doc.id,
            name: doc.data().name,
            photo: doc.data().photo,
            points: doc.data().points2026 ?? doc.data().points,
          });
        });

        setMatches(match);
        setIsLoading(false);
      },
      (error) => {
        console.error("Błąd nasłuchiwania rankingu:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  if (isLoading) {
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
        <View style={styles.topRanked}>
          <TopRanked />
        </View>

        {matches.length > 0 ? (
          <View style={styles.playerRanked}>
            {matches.map((player, number) => (
              <PlayerRanked
                key={player.id}
                position={number + 1}
                points={player.points}
                name={player.name}
                photo={player.photo}
              />
            ))}
          </View>
        ) : null}
      </SafeAreaView>
    </ImageBackground>
  );
}
