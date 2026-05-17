import {
  View,
  ImageBackground,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import CountryFlag from "react-native-country-flag";
import Player from "../../../components/Player/index.js";
import { db } from "../../../firebaseConfig.js";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  orderBy,
} from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import TypeResult from "../../../components/TypeResult/index.js";
import LoadingScreen from "../../../components/LoadingScreen/index.js";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MatchScreen() {
  const [match, setMatch] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true); // Dodatkowy stan ładowania dla pewności

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const updateMatches = async () => {
    if (!id) return;

    const todoRef = doc(db, "matches", id);
    const docSnap = await getDoc(todoRef);

    if (docSnap.exists()) {
      setMatch(docSnap.data());
    }
    setLoading(false); // Dane meczu dotarły, kończymy ładowanie
  };

  const users = async () => {
    const todoRef = collection(db, "users");
    const q = query(todoRef, orderBy("name", "desc"));
    const doc_refs = await getDocs(q);
    const usersList = [];

    doc_refs.forEach((doc) => {
      usersList.push({
        id: doc.id,
        name: doc.data().name,
        photo: doc.data().photo,
      });
    });
    setUserInfo(usersList);
  };

  useEffect(() => {
    // KLUCZOWY KROK: Resetujemy stany przed pobraniem nowych danych.
    // Dzięki temu natychmiast po zmianie id wyskakuje ekran ładowania.
    setMatch(null);
    setLoading(true);

    updateMatches();
    users();
  }, [id]); // Wywoła się zawsze, gdy id ulegnie zmianie

  const now = new Date();
  let day = now.getDate();
  if (day < 10) day = "0" + day;
  let month = now.getMonth() + 1;
  if (month < 10) month = "0" + month;
  const currentFormattedDate = day + "." + month;
  const currentHour = now.getHours();

  // Zmieniony warunek: jeśli aplikacja jest w trakcie ładowania lub nie ma danych meczu, pokazujemy loader
  if (loading || !match || !match.club1) {
    return (
      <ImageBackground
        source={require("../../../assets/backgroundMatch.jpg")}
        style={styles.image}
      >
        <LoadingScreen />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../../assets/backgroundMatch.jpg")}
      style={styles.image}
    >
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: "#003279",
          borderBottomLeftRadius: 60, 
          borderBottomRightRadius: 60,
        }}
      >
        <View style={styles.top}>
          <View style={styles.info}>
            <Text style={styles.date}>{match.date}</Text>
            <Text style={styles.date}>{match.hour}</Text>
          </View>
          <View style={styles.mainTeams}>
            <CountryFlag
              isoCode={match.club1id ? match.club1id : ""}
              size={42}
              style={{ borderRadius: 6 }}
            />
            <Text style={styles.result}>{match.result}</Text>
            <CountryFlag
              isoCode={match.club2id ? match.club2id : ""}
              size={42}
              style={{ borderRadius: 6 }}
            />
          </View>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.teams}>
            {match.club1} - {match.club2}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={userInfo}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Player
              id={item.id}
              name={item.name}
              photo={item.photo}
              matchid={id}
            />
          )}
        />
      </View>

      {currentFormattedDate < match.date ||
      (currentFormattedDate === match.date &&
        currentHour < parseInt(match.hour.substring(0, 2))) ? (
        <TypeResult
          club1={match.club1}
          club1id={match.club1id}
          club2={match.club2}
          club2id={match.club2id}
          matchid={id}
          type={match.typeMatch}
        />
      ) : null}
    </ImageBackground>
  );
}
