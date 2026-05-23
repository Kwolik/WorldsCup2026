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

  // Funkcja pomocnicza do określania koloru podświetlenia punktów (zgodnie z Twoją logiką)
  const getBadgeColor = (pts) => {
    if (pts == 0) return "#ed1c24"; // Czerwony
    if (pts == 1 || pts == 2) return "#fdee00"; // Żółty
    return "#00c165"; // Zielony
  };

  // Funkcja pomocnicza do określania koloru tekstu wewnątrz plakietki punktów
  const getTextColor = (pts) => {
    if (pts == 1 || pts == 2) return "#003279"; // Niebieski tekst na żółtym tle
    return "#FFFFFF"; // Biały tekst na czerwonym/zielonym tle
  };

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
      {/* LEWA I ŚRODKOWA CZĘŚĆ: Data, Flagi, Nazwy i Wynik meczu */}
      <View style={styles.top}>
        {/* Data i godzina */}
        <View>
          <Text style={styles.info}>{displayData.date}</Text>
          <Text style={styles.info}>{displayData.hour}</Text>
        </View>

        {/* Drużyny i flagi */}
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <View style={styles.country}>
            <CountryFlag
              isoCode={displayData.club1id || ""}
              size={22}
              style={{ borderRadius: 4 }}
            />
            <Text style={[styles.teams, { marginLeft: 8 }]} numberOfLines={1}>
              {props.club1 ? props.club1 : match?.club1}
            </Text>
          </View>
          <View style={styles.country}>
            <CountryFlag
              isoCode={displayData.club2id || ""}
              size={22}
              style={{ borderRadius: 4 }}
            />
            <Text style={[styles.teams, { marginLeft: 8 }]} numberOfLines={1}>
              {props.club2 ? props.club2 : match?.club2}
            </Text>
          </View>
        </View>

        {/* Wynik meczu */}
        <View style={styles.viewResult}>
          {displayData.result?.split(":").map((score, index) => (
            <Text key={index} style={styles.result}>
              {score}
            </Text>
          ))}
        </View>
      </View>

      {/* PRAWA CZĘŚĆ: Nowoczesna reprezentacja punktów w stylu tabeli (zamiast nakładających się kart) */}
      {props.points > -1 && (
        <View style={styles.pointsView}>
          <View
            style={[
              styles.points,
              { backgroundColor: getBadgeColor(props.points) },
            ]}
          >
            <Text
              style={{
                color: getTextColor(props.points),
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {props.points}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
