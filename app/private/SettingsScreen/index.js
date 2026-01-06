import {
  View,
  ImageBackground,
  Text,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import styles from "../../../styles/Settings/styles.js";
import { Foundation } from "@expo/vector-icons";
import RowMatch from "../../../components/RowMatch/index.js";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../../firebaseConfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db } from "../../../firebaseConfig.js";
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { TeamList } from "../../../components/TeamList.js";
import LoadingScreen from "../../../components/LoadingScreen/index.js";
import { Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const [points, setPoints] = useState();
  const [photo, setPhoto] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [kingFootballer, setKingFootballer] = useState("");
  const [champion, setChampion] = useState("");
  const [codeChampion, setCodeChampion] = useState("");
  const [url, setUrl] = useState("");
  const [matches, setMatches] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);

  var day = new Date().getDate(); //Current Date
  if (day < 10) day = "0" + day;
  var month = new Date().getMonth() + 1; //Current Month
  if (month < 10) month = "0" + month;
  var hours = new Date().getHours(); //Current Hours

  //const bottomSheetRef = useRef(BottomSheet);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docKing = doc(db, "king", user.uid);
        const docFootballer = doc(db, "footballer", user.uid);
        const docSnap = await getDoc(docRef);
        const docSnapKing = await getDoc(docKing);
        const docSnapFootballer = await getDoc(docFootballer);

        const todoRef = collection(db, "users", user.uid, "types");
        const doc_refs = await getDocs(todoRef);
        const match = [];

        doc_refs.forEach((doc) => {
          match.push({
            id: doc.id,
            points: doc.data().points,
            type: doc.data().type,
            winner: doc.data().winner,
          });
        });
        setMatches(match);

        if (docSnap.exists()) {
          docSnap.data().name && setNameUser(docSnap.data().name);
          docSnap.data().photo && setPhoto(docSnap.data().photo);
          docSnap.data().points && setPoints(docSnap.data().points);
        } else {
          setTextSnackbar("Nie znaleziono dokumentu"), setVisibleSnackbar(true);
        }

        if (docSnapKing.exists()) {
          docSnapKing.data().team && setChampion(docSnapKing.data().team);
          docSnapKing.data().code && setCodeChampion(docSnapKing.data().code);
        }

        if (docSnapFootballer.exists()) {
          docSnapFootballer.data().name &&
            setKingFootballer(docSnapFootballer.data().name);
        }
      }
    });

    return unsubscribe;
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (url !== "") {
      changeData();
    }
  }, [url]);

  const uploadImage = async () => {
    const response = await fetch(photo);
    const blob = await response.blob();
    const filename = auth.currentUser.uid;
    const storageRef = ref(storage, filename);

    try {
      const snapshot = await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUrl(downloadURL);
    } catch (e) {
      console.log(e);
      Alert.alert("Error uploading photo");
    }
  };

  const changeData = () => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists()) {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          id: auth.currentUser.uid,
          name: nameUser,
          email: auth.currentUser.email,
          photo: url,
          points: points,
        });
      }
    });
  };

  const betFootballer = () => {
    if (kingFootballer != "") {
      setVisible(!visible);
      setDoc(doc(db, "footballer", auth.currentUser.uid), {
        id: auth.currentUser.uid,
        name: kingFootballer,
        photo: photo,
        nameUser: nameUser,
      });
    }
  };

  const betKing = () => {
    if (champion != "") {
      setVisible(!visible);
      setDoc(doc(db, "king", auth.currentUser.uid), {
        id: auth.currentUser.uid,
        code: codeChampion,
        team: champion,
        photo: photo,
        name: nameUser,
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.jpg")}
      style={styles.image}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        {nameUser ? (
          <View style={styles.profile}>
            <TouchableOpacity onPress={() => pickImage()} style={styles.button}>
              {photo ? (
                <Image style={styles.avatar} source={{ uri: photo }} />
              ) : (
                <Image
                  style={styles.avatar}
                  source={require("../../../assets/icon.png")}
                />
              )}
            </TouchableOpacity>
            <View style={styles.top}>
              <View style={styles.space}></View>
              <TextInput
                style={styles.nick}
                onChangeText={setNameUser}
                value={nameUser}
                maxLength={12}
                autoComplete="username"
                keyboardType="default"
                textContentType="nickname"
              ></TextInput>
              <View style={styles.viewPoints}>
                <Text style={styles.points}>{points} </Text>
                <Text style={styles.nick}>pkt</Text>
              </View>
            </View>
            <View style={styles.bottom}>
              <TouchableOpacity
                style={styles.viewBottom}
                onPress={() => {
                  uploadImage(), setVisible(!visible);
                }}
              >
                <Foundation name="pencil" style={styles.icon} />
                <Text style={styles.desc}>Edytuj swoje dane</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <LoadingScreen />
        )}
        {nameUser ? (
          <View style={styles.profile}>
            <View style={styles.top}>
              <Text style={styles.info1}>Mistrz</Text>
              <Text style={styles.type1}>{champion}</Text>
              {day + "." + month < "14.06" ||
              (day + "." + month == "14.06" && hours < "21") ? (
                <TouchableOpacity onPress={() => betKing()}>
                  <Foundation name="pencil" style={styles.icon1} />
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
            </View>
            <View style={styles.bottomKing}>
              <Text style={styles.info2}>Król strzelców</Text>
              <TextInput
                style={styles.type2}
                onChangeText={setKingFootballer}
                value={kingFootballer}
                autoComplete="name"
                keyboardType="default"
                textContentType="name"
                editable={
                  day + "." + month < "14.06" ||
                  (day + "." + month == "14.06" && hours < "21")
                    ? true
                    : false
                } //lol
              ></TextInput>
              {day + "." + month < "14.06" ||
              (day + "." + month == "14.06" && hours < "21") ? (
                <TouchableOpacity onPress={() => betFootballer()}>
                  <Foundation name="pencil" style={styles.icon2} />
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
            </View>
          </View>
        ) : (
          <LoadingScreen />
        )}
        {matches && matches[0] && (
          <View style={styles.flatlist}>
            <FlatList
              data={matches}
              numColumns={1}
              renderItem={({ item }) => (
                <RowMatch
                  id={item.id}
                  type={item.type}
                  points={item.points}
                  winner={item.winenr}
                />
              )}
            />
          </View>
        )}
        {/* {day + "." + month < "14.06" ||
        (day + "." + month == "14.06" && hours < "21") ? (
          <SafeAreaView style={styles.bottomSheet}>
            <BottomSheet
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              snapPoints={["5%", "60%", "100%"]}
            >
              <BottomSheetView style={styles.contentContainer}>
                <View style={styles.viewTitle}>
                  <Text style={styles.title}>Obstaw mistrza 🎉</Text>
                </View>
                {TeamList.map((team, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.team}
                    onPress={() => {
                      setChampion(team.value), setCodeChampion(team.code);
                    }}
                  >
                    <Text style={styles.teamText}>{team.value}</Text>
                  </TouchableOpacity>
                ))}
              </BottomSheetView>
            </BottomSheet>
          </SafeAreaView>
        ) : (
          <View></View>
        )} */}
        <Snackbar
          visible={visible}
          style={{ backgroundColor: "#003279" }}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Undo",
            onPress: () => {
              onDismissSnackBar;
            },
          }}
        >
          Poprawnie zmieniono dane
        </Snackbar>
      </SafeAreaView>
    </ImageBackground>
  );
}
