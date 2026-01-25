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
    updateMatches();
    users();
  }, [id]);

  const now = new Date();
  let day = now.getDate();
  if (day < 10) day = "0" + day;
  let month = now.getMonth() + 1;
  if (month < 10) month = "0" + month;
  const currentFormattedDate = day + "." + month;
  const currentHour = now.getHours();

  return match && match.club1 ? (
    <ImageBackground
      source={require("../../../assets/backgroundMatch.jpg")}
      style={styles.image}
    >
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: "#003279",
          borderBottomLeftRadius: "60%",
          borderBottomRightRadius: "60%",
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
            />
            <Text style={styles.result}>{match.result}</Text>
            <CountryFlag
              isoCode={match.club2id ? match.club2id : ""}
              size={42}
            />
          </View>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.teams}>
            {match.club1} - {match.club2}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10, paddingTop: 4 }}>
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

      {Platform.OS === "ios" && (
        <View style={styles.buttonBack}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color={"#FFFFFF"}
            />
            <Text style={styles.textBack}>Powrót do listy meczy</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  ) : (
    <ImageBackground
      source={require("../../../assets/backgroundMatch.jpg")}
      style={styles.image}
    >
      <LoadingScreen />
    </ImageBackground>
  );
}
