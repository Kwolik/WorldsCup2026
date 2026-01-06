import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import { db } from "../../firebaseConfig.js";
import { orderBy, collection, query, limit, getDocs } from "firebase/firestore";
import LoadingScreen from "../LoadingScreen/index.js";

export default function TopRanked() {
  const [matches, setMatches] = useState([]);

  const top3Players = async () => {
    const todoRef = collection(db, "users");
    const q = query(todoRef, orderBy("points", "desc"), limit(3));
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
    top3Players();
  }, []);

  return matches[0] ? (
    <View style={styles.container}>
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
          <Text style={styles.nick}>{matches[1] && matches[1].name}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.points}>
            {matches[1] && matches[1].points} punktów
          </Text>
        </View>
      </View>
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
          <Text style={styles.nick}>{matches[0] && matches[0].name}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.points}>
            {matches[0] && matches[0].points} punktów
          </Text>
        </View>
      </View>
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
          <Text style={styles.nick}>{matches[2] && matches[2].name}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.points}>
            {matches[2] && matches[2].points} punktów
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <LoadingScreen />
  );
}
