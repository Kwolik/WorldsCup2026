import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles";
import CountryFlag from "react-native-country-flag";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { collection, getDocs, where, limit, query } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function NextMatch() {
  const [match, setMatch] = useState([]);
  const [date, setDate] = useState("");
  const router = useRouter();

  var day = new Date().getDate(); //Current Date
  if (day < 10) day = "0" + day;
  var month = new Date().getMonth() + 1; //Current Month
  if (month < 10) month = "0" + month;
  var hours = new Date().getHours(); //Current Hours
  if (hours < 10) hours = "0" + hours;
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Minutes

  const [time, setTime] = useState((60 - min) * 60 + (60 - sec));

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const nextMatch = async () => {
    const todoRef = collection(db, "matches");
    const q = query(todoRef, where("id", ">", date), limit(1));
    const doc_refs = await getDocs(q);
    const oneMatch = [];

    doc_refs.forEach((doc) => {
      oneMatch.push({
        id: doc.id,
        club1: doc.data().club1,
        club1id: doc.data().club1id,
        club2: doc.data().club2,
        club2id: doc.data().club2id,
        result: doc.data().result,
        date: doc.data().date,
        hour: doc.data().hour,
      });
    });
    setMatch(oneMatch);
  };

  useEffect(() => {
    setDate("2024" + month + day + hours + min);
    nextMatch();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (time > 0) {
        setTime(time - 1);
      }
    }, 1000); // odliczanie co sekundę

    return () => clearTimeout(timer);
  }, [time]);

  //Przetestować jutro tego ifa
  return (
    match[0] &&
    match[0].date == day + "." + month &&
    match[0].hour == hours + 1 + ":00" &&
    min >= 45 && (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          router.navigate({
            pathname: "/MatchScreen",
            params: { id: match[0].id },
          })
        }
      >
        <View style={styles.top}>
          <View style={styles.row}>
            <Ionicons name="football-outline" style={styles.icon} />
            <Text style={styles.info}>{match[0].date}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="timer-outline" style={styles.icon} />
            <Text style={[styles.info, { color: "red" }]}>{`${
              minutes < 10 ? "0" : ""
            }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</Text>
          </View>
        </View>
        <View style={styles.flags}>
          <CountryFlag
            isoCode={match[0].club1id ? match[0].club1id : ""}
            size={32}
            style={styles.flag}
          />
          <CountryFlag
            isoCode={match[0].club2id ? match[0].club2id : ""}
            size={32}
            style={styles.flag}
          />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.team}>
            {match[0].club1} - {match[0].club2}
          </Text>
        </View>
      </TouchableOpacity>
    )
  );
}
