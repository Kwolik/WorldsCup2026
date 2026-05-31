import {
  View,
  ImageBackground,
  Text,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/Settings/styles.js";
import { Foundation } from "@expo/vector-icons";
import RowMatch from "../../../components/RowMatch/index.js";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../../firebaseConfig.js";
import { doc, setDoc, collection, onSnapshot } from "firebase/firestore"; // ZMIANA: Dodano onSnapshot
import LoadingScreen from "../../../components/LoadingScreen/index.js";
import { Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import CountryFlag from "react-native-country-flag";
import { TeamList } from "../../../components/TeamList.js";

export default function SettingScreen() {
  const [points, setPoints] = useState(0);
  const [photo, setPhoto] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [kingFootballer, setKingFootballer] = useState("");
  const [champion, setChampion] = useState("");
  const [codeChampion, setCodeChampion] = useState("");
  const [matches, setMatches] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // NOWOŚĆ: Bezpieczniejsza obsługa ekranu ładowania

  const onDismissSnackBar = () => setVisible(false);

  const isBettingOpen = () => {
    const now = new Date();
    const deadline = new Date(2026, 5, 11, 21, 0); // 11 czerwca 2026, 21:00
    return now < deadline;
  };

  useEffect(() => {
    // Rejestrujemy nasłuchiwanie na stan zalogowania użytkownika
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 1. Słuchacz czasu rzeczywistego dla profilu użytkownika (punkty, nazwa, foto)
      const userRef = doc(db, "users", user.uid);
      const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name) setNameUser(data.name);
          if (data.photo) setPhoto(data.photo);
          
          const userPoints = data.points2026 ?? data.points ?? 0;
          setPoints(userPoints);
        }
        setLoading(false); // Dane podstawowe załadowane
      }, (error) => {
        console.error("Błąd profilu w czasie rzeczywistym:", error);
      });

      // 2. Słuchacz czasu rzeczywistego dla obstawionego Mistrza Świata
      const kingRef = doc(db, "king2026", user.uid);
      const unsubscribeKing = onSnapshot(kingRef, (docSnapKing) => {
        if (docSnapKing.exists()) {
          setChampion(docSnapKing.data().team || "");
          setCodeChampion(docSnapKing.data().code || "");
        }
      });

      // 3. Słuchacz czasu rzeczywistego dla Króla Strzelców
      const footballerRef = doc(db, "footballer2026", user.uid);
      const unsubscribeFootballer = onSnapshot(footballerRef, (docSnapFootballer) => {
        if (docSnapFootballer.exists()) {
          setKingFootballer(docSnapFootballer.data().name || "");
        }
      });

      // 4. Słuchacz czasu rzeczywistego dla listy typów meczów (wyniki i punkty za mecze)
      const typesCollectionRef = collection(db, "users", user.uid, "types2026");
      const unsubscribeMatches = onSnapshot(typesCollectionRef, (querySnapshot) => {
        const fetchedMatches = querySnapshot.docs.map((document) => ({
          id: document.id,
          points: document.data().points,
          type: document.data().type,
          winner: document.data().winner,
        }));
        setMatches(fetchedMatches);
      }, (error) => {
        console.error("Błąd subskrypcji meczów:", error);
      });

      // FUNKCJA CZYSZCZĄCA (Cleanup): Odpinamy wszystkie subskrypcje, gdy użytkownik wyjdzie z ekranu
      return () => {
        unsubscribeUser();
        unsubscribeKing();
        unsubscribeFootballer();
        unsubscribeMatches();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const changeData = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(
        userDocRef,
        {
          id: auth.currentUser.uid,
          name: nameUser,
          email: auth.currentUser.email,
          photo: photo,
          points2026: points,
        },
        { merge: true },
      );
      setVisible(true);
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się zapisać zmian danych profilu.");
    }
  };

  const betFootballer = async () => {
    if (!auth.currentUser || kingFootballer.trim() === "") return;
    try {
      await setDoc(doc(db, "footballer2026", auth.currentUser.uid), {
        id: auth.currentUser.uid,
        name: kingFootballer,
        photo: photo,
        nameUser: nameUser,
      });
      setVisible(true);
    } catch (e) {
      Alert.alert("Błąd", `Nie udało się zapisać króla strzelców: ${e.message}`);
    }
  };

  const selectChampion = async (selectedTeam) => {
    if (!auth.currentUser) return;

    const flagCode = selectedTeam.code.startsWith("GB-")
      ? selectedTeam.code.toLowerCase()
      : selectedTeam.code;

    setChampion(selectedTeam.value);
    setCodeChampion(flagCode);
    setModalVisible(false);

    try {
      await setDoc(doc(db, "king2026", auth.currentUser.uid), {
        id: auth.currentUser.uid,
        code: flagCode,
        team: selectedTeam.value,
        photo: photo,
        name: nameUser,
      });
      setVisible(true);
    } catch (e) {
      Alert.alert("Błąd", `Nie udało się zapisać mistrza: ${e.message}`);
    }
  };

  // Zmiana warunku na jawny stan loading zamiast sprawdzania samego stringa nameUser
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ImageBackground
      source={require("../../../assets/background.jpg")}
      style={styles.image}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.viewModal}>
            <View style={styles.viewModal2}>
              <Text style={styles.textModal}>Wybierz Mistrza Świata 2026</Text>

              <FlatList
                data={TeamList}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => selectChampion(item)}
                    style={styles.country}
                  >
                    <CountryFlag
                      isoCode={
                        item.code.startsWith("GB-")
                          ? item.code.toLowerCase()
                          : item.code
                      }
                      size={24}
                      style={styles.countryFlag}
                    />
                    <Text style={styles.countryText}>{item.value}</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.close}
              >
                <Text style={styles.closeText}>Zamknij</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.profile}>
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Image
              style={styles.avatar}
              source={
                photo ? { uri: photo } : require("../../../assets/icon.png")
              }
            />
          </TouchableOpacity>
          <View style={styles.top}>
            <View style={styles.space} />
            <TextInput
              style={styles.nick}
              onChangeText={setNameUser}
              value={nameUser}
              maxLength={12}
              autoComplete="username"
              textContentType="nickname"
            />
            <View style={styles.viewPoints}>
              <Text style={styles.points}>{points} </Text>
              <Text style={styles.nick}>pkt</Text>
            </View>
          </View>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.viewBottom} onPress={changeData}>
              <Foundation name="pencil" style={styles.icon} />
              <Text style={styles.desc}>Edytuj swoje dane</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profile}>
          <View style={styles.top}>
            <Text style={styles.info1}>Mistrz Świata</Text>

            <View style={styles.champion}>
              {codeChampion ? (
                <CountryFlag
                  isoCode={codeChampion}
                  size={18}
                  style={{ marginRight: 6, borderRadius: 3 }}
                />
              ) : null}
              <Text style={styles.type1}>{champion || "Nie wybrano"}</Text>
            </View>

            {isBettingOpen() && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Foundation name="pencil" style={styles.icon1} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.bottomKing}>
            <Text style={styles.info2}>Król strzelców</Text>
            <TextInput
              style={styles.type2}
              onChangeText={setKingFootballer}
              value={kingFootballer}
              autoComplete="name"
              textContentType="name"
              editable={isBettingOpen()}
            />
            {isBettingOpen() && (
              <TouchableOpacity onPress={betFootballer}>
                <Foundation name="pencil" style={styles.icon2} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {matches.length > 0 && (
          <View style={styles.flatlist}>
            <FlatList
              data={matches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RowMatch
                  id={item.id}
                  type={item.type}
                  points={item.points}
                  winner={item.winner}
                />
              )}
            />
          </View>
        )}

        <Snackbar
          visible={visible}
          style={{ backgroundColor: "#003279" }}
          onDismiss={onDismissSnackBar}
          action={{
            label: "OK",
            onPress: onDismissSnackBar,
          }}
        >
          Poprawnie zmieniono dane
        </Snackbar>
      </SafeAreaView>
    </ImageBackground>
  );
}