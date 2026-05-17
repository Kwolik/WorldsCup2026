import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import CountryFlag from "react-native-country-flag";
import { db } from "../../firebaseConfig.js";
import { collection, onSnapshot } from "firebase/firestore";
import { TeamList } from "../TeamList.js";
import LoadingScreen from "../LoadingScreen/index.js";

export default function ChampionRow() {
  const [king, setKing] = useState([]);
  const [uniqueTeams, setUniqueTeams] = useState([]);

  useEffect(() => {
    const todoRef = collection(db, "king");
    const unsubscribe = onSnapshot(todoRef, (querySnapshot) => {
      const kingData = [];
      const teamsSet = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        kingData.push({
          id: doc.id,
          team: data.team,
          photo: data.photo,
          code: data.code,
          name: data.name,
        });
        if (data.team) {
          teamsSet.add(data.team);
        }
      });

      setKing(kingData);
      setUniqueTeams(Array.from(teamsSet)); // Tworzy czystą tablicę unikalnych drużyn
    });

    return () => unsubscribe();
  }, []);

  // Szybkie wyciąganie kodu flagi na podstawie nazwy teamu
  const getFlagCode = (teamName) => {
    const found = TeamList.find((t) => t.value === teamName);
    return found ? found.code : "";
  };

  if (uniqueTeams.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.mainWrapper}>
      {uniqueTeams.map((teamName, index) => {
        const flagCode = getFlagCode(teamName);
        // Filtrujemy graczy, którzy wybrali akurat TĘ drużynę
        const votesForTeam = king.filter((k) => k.team === teamName);

        return (
          <View style={styles.cardContainer} key={index}>
            {/* NAGŁÓWEK KARTY (Flaga + Nazwa + Licznik) */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                {flagCode ? (
                  <CountryFlag
                    isoCode={flagCode}
                    size={22}
                    style={styles.flag}
                  />
                ) : null}
                <Text style={styles.teamName}>{teamName}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {votesForTeam.length}{" "}
                  {votesForTeam.length == 1
                    ? "głos"
                    : votesForTeam.length > 1 && votesForTeam.length < 5
                      ? "głosy"
                      : "głosów"}
                </Text>
              </View>
            </View>

            {/* SEKCJA Z GRACZAMI (Automatyczna siatka) */}
            <View style={styles.playersGrid}>
              {votesForTeam.map((player, pIndex) => (
                <View style={styles.playerChip} key={pIndex}>
                  <Image
                    style={styles.avatar}
                    source={
                      player.photo
                        ? { uri: player.photo }
                        : require("../../assets/icon.png")
                    }
                  />
                  <Text style={styles.playerName} numberOfLines={1}>
                    {player.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}
