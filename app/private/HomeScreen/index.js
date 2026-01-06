import { View, ImageBackground, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import styles from "../../../styles/Home/styles.js";
import NextMatch from "../../../components/NextMatch/index.js";
import TopRanked from "../../../components/TopRanked/index.js";
import RowMatch from "../../../components/RowMatch/index.js";
import ChampionRow from "../../../components/ChampionRow/index.js";
import KingFootballerRow from "../../../components/KingFootballerRow/index.js";
import { useRouter } from "expo-router";
import { db } from "../../../firebaseConfig.js";
import {
  where,
  orderBy,
  collection,
  query,
  limit,
  getDocs,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [nextMatches, setNextMatches] = useState([]);
  var day = new Date().getDate(); //Current Date
  if (day < 10) day = "0" + day;
  var month = new Date().getMonth() + 1; //Current Month
  if (month < 10) month = "0" + month;
  var year = new Date().getFullYear(); //Current Year

  const next3Matches = async () => {
    const todoRef = collection(db, "matches");
    const q = query(
      todoRef,
      where("id", ">", year + month + day - 1),
      orderBy("id"),
      limit(10)
    );
    const doc_refs = await getDocs(q);
    const match = [];

    doc_refs.forEach((doc) => {
      match.push({
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
    console.log(match);
    setNextMatches(match);
  };

  useEffect(() => {
    next3Matches();
  }, []);

  const router = useRouter();
  return (
    <ImageBackground
      source={require("../../../assets/background.jpg")}
      style={styles.image}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.nextMatch}>
            <NextMatch />
          </View>
          <View style={{ marginLeft: 2 }}>
            <TopRanked />
          </View>
          {/* <View style={styles.plates}>
            <TouchableOpacity
              style={styles.plate}
              onPress={() => router.navigate("/private/MatchesScreen")}
            >
              <View style={styles.icon}>
                <Ionicons name="football-outline" style={styles.iconMain} />
              </View>
              <View style={styles.bottom}>
                <Text style={styles.name}>Mecze</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.plate}
              onPress={() => router.navigate("/private/RankedScreen")}
            >
              <View style={styles.icon}>
                <Ionicons name="star-outline" style={styles.iconMain} />
              </View>
              <View style={styles.bottom}>
                <Text style={styles.name}>Ranking</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.plate}
              onPress={() => router.navigate("/private/SettingsScreen")}
            >
              <View style={styles.icon}>
                <Ionicons name="settings-outline" style={styles.iconMain} />
              </View>
              <View style={styles.bottom}>
                <Text style={styles.name}>Profil</Text>
              </View>
            </TouchableOpacity>
          </View> */}
          <View style={styles.matches3}>
            {nextMatches.map(
              (team, index) =>
                team.date == day + "." + month && (
                  <RowMatch
                    key={index}
                    id={team.id}
                    club1={team.club1}
                    club1id={team.club1id}
                    club2={team.club2}
                    club2id={team.club2id}
                    date={team.date}
                    hour={team.hour}
                    result={team.result}
                  />
                )
            )}
          </View>
          <View style={styles.matches3}>
            {nextMatches.map(
              (team, index) =>
                team.date == day - 1 + "." + month && (
                  <RowMatch
                    key={index}
                    id={team.id}
                    club1={team.club1}
                    club1id={team.club1id}
                    club2={team.club2}
                    club2id={team.club2id}
                    date={team.date}
                    hour={team.hour}
                    result={team.result}
                  />
                )
            )}
          </View>
          <View style={styles.matches3}>
            <ChampionRow />
          </View>
          <View style={styles.kingFootballer}>
            <KingFootballerRow />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
