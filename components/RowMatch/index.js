import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import CountryFlag from "react-native-country-flag";
import { useRouter } from "expo-router";
import { db } from "../../firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RowMatch(props) {
  const [match, setMatch] = useState(null);
  const router = useRouter();
  const id = props.id;

  useEffect(() => {
    if (!props.club1) {
      const updateMatches = async () => {
        const todoRef = doc(db, "matches", id);
        const docSnap = await getDoc(todoRef);
        if (docSnap.exists()) {
          setMatch(docSnap.data());
        }
      };
      updateMatches();
    }
  }, [id]);

  const displayData = {
    club1: props.club1 || match?.club1,
    club2: props.club2 || match?.club2,
    club1id: props.club1id || match?.club1id,
    club2id: props.club2id || match?.club2id,
    date: props.date || match?.date,
    result: props.result || match?.result,
    hour: props.hour || match?.hour,
  };

  if (!displayData.club1 || !displayData.club2) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/private/MatchScreen",
          params: { id: id },
        })
      }
    >
      {props.points > -1 && (
        <MaterialCommunityIcons
          name="cards"
          style={[
            styles.icon,
            props.points == 0 ? { color: "#ed1c24" } : { color: "#00c165" },
          ]}
        />
      )}

      <View style={styles.top}>
        <Text style={styles.info}>{displayData.date}</Text>
        <CountryFlag isoCode={displayData.club1id || ""} size={28} />
        <Text style={styles.result}>{displayData.result}</Text>
        <CountryFlag isoCode={displayData.club2id || ""} size={28} />
        <Text style={styles.info}>{displayData.hour}</Text>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.teams}>
          {displayData.club1} - {displayData.club2}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
