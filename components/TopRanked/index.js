import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import { db } from "../../firebaseConfig.js";
import { orderBy, collection, query, limit, onSnapshot } from "firebase/firestore"; 

export default function TopRanked() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const todoRef = collection(db, "users");
    const q = query(todoRef, orderBy("points2026", "desc"), limit(3));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    }, (error) => {
      console.error("Błąd nasłuchiwania TOP 3:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return null;
  if (matches.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* 2. MIEJSCE */}
      <View style={styles.top}>
        <View style={styles.mainBackground}>
          {matches[1] && matches[1].photo ? (
            <Image style={styles.avatar} source={{ uri: matches[1].photo }} />
          ) : (
            <Image
              style={styles.avatar}
              source={require("../../assets/icon.png")}
            />
          )}
          <Text style={styles.nick}>{(matches[1] && matches[1].name) || "Brak"}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.points}>
            {matches[1] ? `${matches[1].points} punktów` : "0 punktów"}
          </Text>
        </View>
      </View>

      {/* 1. MIEJSCE */}
      <View style={styles.top}>
        <View style={styles.firstPlace}>
          {matches[0] && matches[0].photo ? (
            <Image
              style={styles.avatarFirst}
              source={{ uri: matches[0].photo }}
            />
          ) : (
            <Image
              style={styles.avatarFirst}
              source={require("../../assets/icon.png")}
            />
          )}
          <Text style={styles.nick}>{(matches[0] && matches[0].name) || "Brak"}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.points}>
            {matches[0] ? `${matches[0].points} punktów` : "0 punktów"}
          </Text>
        </View>
      </View>

      {/* 3. MIEJSCE */}
      <View style={styles.top}>
        <View style={[styles.mainBackground, styles.color3]}>
          {matches[2] && matches[2].photo ? (
            <Image style={styles.avatar} source={{ uri: matches[2].photo }} />
          ) : (
            <Image
              style={styles.avatar}
              source={require("../../assets/icon.png")}
            />
          )}
          <Text style={styles.nick}>{(matches[2] && matches[2].name) || "Brak"}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.points}>
            {matches[2] ? `${matches[2].points} punktów` : "0 punktów"}
          </Text>
        </View>
      </View>
    </View>
  );
}