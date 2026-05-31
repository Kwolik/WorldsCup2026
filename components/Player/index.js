import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";

const getPointStatus = (pts) => {
  if (pts <= 0) return { bg: "#ed1c24", text: "#FFFFFF", label: "0 pkt" };
  if (pts === 1 || pts === 2)
    return { bg: "#fdee00", text: "#003279", label: `${pts} pkt` };
  return { bg: "#00c165", text: "#FFFFFF", label: `${pts} pkt` };
};

export default function Player(props) {
  const [data, setData] = useState();

  useEffect(() => {
    const todoRef = doc(db, "users", props.id, "types2026", props.matchid);
    const unsubscribe = onSnapshot(todoRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [props.matchid]);

  if (!data || !data.type) return null;

  const hasPoints = data.points !== undefined && data.points !== -1;
  const status = getPointStatus(data.points);
  const isPerfectScore = data.points >= 3; // Zakładam, że 3 pkt to dokładny wynik

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.avatarWrapper}>
          {props.photo ? (
            <Image style={styles.avatar} source={{ uri: props.photo }} />
          ) : (
            <Image
              style={styles.avatar}
              source={require("../../assets/icon.png")}
            />
          )}

          {/* Nowoczesny Badge z punktami nadpisany na awatarze */}
          {hasPoints && (
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Text style={[styles.badgeText, { color: status.text }]}>
                {status.label}
              </Text>
            </View>
          )}
        </View>

        {/* Wynik typowany przez gracza */}
        <View style={styles.resultContainer}>
          <Text style={styles.result}>{data.type}</Text>
        </View>
      </View>

      {/* DÓŁ KARTY (Nick) */}
      <View style={styles.bottom}>
        <Text style={styles.nick}>{props.name}</Text>
      </View>
    </View>
  );
}
