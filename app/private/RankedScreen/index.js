import { View, ImageBackground } from "react-native";
import { useState, useEffect } from "react";
import styles from "../../../styles/Ranked/styles.js";
import TopRanked from "../../../components/TopRanked/index.js";
import PlayerRanked from "../../../components/PlayerRanked/index.js";
import { db } from "../../../firebaseConfig.js";
import { orderBy, collection, query, getDocs } from "firebase/firestore";
import LoadingScreen from "../../../components/LoadingScreen/index.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RankedScreen() {
  const [matches, setMatches] = useState([]);

  const topPlayers = async () => {
    const todoRef = collection(db, "users");
    const q = query(todoRef, orderBy("points", "desc"));
    const doc_refs = await getDocs(q);
    const match = [];

    doc_refs.forEach((doc) => {
      match.push({
        id: doc.id,
        name: doc.data().name,
        photo: doc.data().photo,
        points: doc.data().points,
      });
    });
    setMatches(match);
  };

  useEffect(() => {
    topPlayers();
  }, []);

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
        {matches[0] ? (
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
        ) : (
          <LoadingScreen />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
