import {
  View,
  ImageBackground,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import CountryFlag from "react-native-country-flag";
import Player from "../../../components/Player/index.js";
import { db, auth } from "../../../firebaseConfig.js";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  orderBy,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import TypeResult from "../../../components/TypeResult/index.js";
import LoadingScreen from "../../../components/LoadingScreen/index.js";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const calculatePointsForMatch = (officialResult, userType) => {
  if (!officialResult || !userType) return 0;

  const [off1, off2] = officialResult.split(":").map(Number);
  const [type1, type2] = userType.split(":").map(Number);

  // 1. Dokładny wynik (3 punkty)
  if (off1 === type1 && off2 === type2) {
    return 3;
  }

  // 2. Trafione rozstrzygnięcie / tendencja (1 punkt)
  const officialWinner = off1 > off2 ? "home" : off1 < off2 ? "away" : "draw";
  const userWinner = type1 > type2 ? "home" : type1 < type2 ? "away" : "draw";

  if (officialWinner === userWinner) {
    return 1;
  }

  return 0;
};

export default function MatchScreen() {
  const [match, setMatch] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [club1Score, setClub1Score] = useState("");
  const [club2Score, setClub2Score] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const ADMIN_UIDS = [
    "NRpRx8uUqYciM0EmXF6VTljLMwi1",
    "c1clCCedt1h18dGFLjotD9f2R4l1",
  ];

  const updateMatches = async () => {
    if (!id) return;
    const todoRef = doc(db, "matches2026", id);
    const docSnap = await getDoc(todoRef);
    if (docSnap.exists()) {
      setMatch(docSnap.data());
    }
  };

  const users = async () => {
    const currentUser = auth?.currentUser;
    const todoRef = collection(db, "users");
    const q = query(todoRef, orderBy("name", "desc"));
    const doc_refs = await getDocs(q);
    const usersList = [];
    let foundCurrentUserData = null;

    doc_refs.forEach((doc) => {
      const userData = {
        id: doc.id,
        name: doc.data().name,
        photo: doc.data().photo,
      };

      usersList.push(userData);

      if (currentUser && doc.id === currentUser.uid) {
        foundCurrentUserData = userData;
      }
    });

    setCurrentUserData(foundCurrentUserData);
    setUserInfo(usersList);
  };

  const loadData = async () => {
    setLoading(true);
    await updateMatches();
    await users();
    setLoading(false);
  };

  useEffect(() => {
    setMatch(null);
    setUserInfo([]);
    setCurrentUserData(null);
    loadData();
  }, [id]);

  const canBet = () => {
    if (!match || !match.date || !match.hour) return false;
    try {
      const [matchDay, matchMonth] = match.date.split(".").map(Number);
      const hourParts = match.hour.split(":");
      const matchHour = Number(hourParts[0]);
      const matchMinute = hourParts[1] ? Number(hourParts[1]) : 0;
      const now = new Date();
      const currentYear = now.getFullYear();
      const matchDateTime = new Date(
        currentYear,
        matchMonth - 1,
        matchDay,
        matchHour,
        matchMinute,
        0,
      );
      return now < matchDateTime;
    } catch (error) {
      return false;
    }
  };

  const isAdmin = () => {
    const currentUser = auth?.currentUser;
    return currentUser && ADMIN_UIDS.includes(currentUser.uid);
  };

  const handleSaveResult = async () => {
    if (club1Score.trim() === "" || club2Score.trim() === "") {
      Alert.alert("Błąd", "Wpisz wynik dla obu drużyn!");
      return;
    }

    const finalResultStr = `${club1Score.trim()}:${club2Score.trim()}`;
    setIsSaving(true);

    try {
      const matchRef = doc(db, "matches2026", id);
      await updateDoc(matchRef, { result: finalResultStr });

      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);

      await runTransaction(db, async (transaction) => {
        const updatesQueue = [];

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userData = userDoc.data();

          const userTypeRef = doc(db, "users", userId, "types", id);
          const userTypeSnap = await transaction.get(userTypeRef);

          if (userTypeSnap.exists()) {
            const userTypeData = userTypeSnap.data();
            const userBet = userTypeData.type;

            const earnedPoints = calculatePointsForMatch(
              finalResultStr,
              userBet,
            );

            const currentGlobalPoints =
              userData.points2026 ?? userData.points ?? 0;

            const previousMatchPoints =
              userTypeData.points !== undefined && userTypeData.points !== -1
                ? userTypeData.points
                : 0;

            const newGlobalPoints =
              currentGlobalPoints - previousMatchPoints + earnedPoints;

            updatesQueue.push({
              userTypeRef,
              earnedPoints,
              userRef: doc(db, "users", userId),
              newGlobalPoints,
            });
          }
        }

        for (const updateItem of updatesQueue) {
          transaction.update(updateItem.userTypeRef, {
            points: updateItem.earnedPoints,
          });

          transaction.update(updateItem.userRef, {
            points2026: updateItem.newGlobalPoints,
          });
        }
      });

      Alert.alert(
        "Sukces",
        `Wynik ${finalResultStr} został zapisany. Ranking oraz punkty graczy zostały zaktualizowane bez błędów transakcji!`,
      );
      setIsModalVisible(false);
      updateMatches();
    } catch (error) {
      console.error("Błąd podczas przeliczania punktów admina: ", error);
      Alert.alert(
        "Błąd",
        "Wystąpił problem podczas zapisywania wyniku lub przeliczania punktów.",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
            <Text style={styles.result}>{match.result || "-:-"}</Text>
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

      {/* SEKCJA ŚRODKOWA */}
      <View style={{ flex: 1, marginBottom: -40 }}>
        {!canBet() ? (
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
        ) : (
          currentUserData &&
          currentUserData.name && (
            <View style={styles.bottomSheet}>
              <Player
                id={currentUserData.id}
                name={currentUserData.name}
                photo={currentUserData.photo}
                matchid={id}
              />
            </View>
          )
        )}
      </View>

      {/* PRZYCISK DLA ADMINA */}
      {isAdmin() && !canBet() && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => setIsModalVisible(true)}
        >
          <MaterialIcons
            name="gavel"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.textCalc}>Wpisz oficjalny wynik meczu</Text>
        </TouchableOpacity>
      )}

      {/* WARUNEK DLA ZWYKŁYCH UŻYTKOWNIKÓW */}
      {canBet() ? (
        <TypeResult
          club1={match.club1}
          club1id={match.club1id}
          club2={match.club2}
          club2id={match.club2id}
          matchid={id}
          type={match.typeMatch}
        />
      ) : null}

      {/* OKNO MODALNE DO WPISYWANIA WYNIKU */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.viewModal}>
          <View style={styles.modal}>
            <View style={styles.viewModal2}>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={styles.textModal} numberOfLines={1}>
                  {match.club1}
                </Text>
                <TextInput
                  style={styles.textinput}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={club1Score}
                  onChangeText={setClub1Score}
                />
              </View>

              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={styles.textModal} numberOfLines={1}>
                  {match.club2}
                </Text>
                <TextInput
                  style={styles.textinput}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={club2Score}
                  onChangeText={setClub2Score}
                />
              </View>
            </View>

            {/* AKCJE MODALA */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSaveResult}
              disabled={isSaving}
            >
              <Text style={styles.textCalc}>
                {isSaving ? "Zapisywanie..." : "Zatwierdź wynik"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.textClose}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}
