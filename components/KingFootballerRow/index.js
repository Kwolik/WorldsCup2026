import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import { db } from "../../firebaseConfig.js";
import { collection, onSnapshot } from "firebase/firestore";
import LoadingScreen from "../LoadingScreen/index.js";

export default function KingFootballerRow() {
  const [footballer, setFootballer] = useState([]);
  const [uniqueFootballers, setUniqueFootballers] = useState([]);

  useEffect(() => {
    const todoRef = collection(db, "footballer");
    const unsubscribe = onSnapshot(todoRef, (querySnapshot) => {
      const kingData = [];
      const footballersSet = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        kingData.push({
          id: doc.id,
          name: data.name, // Imię i nazwisko piłkarza
          photo: data.photo, // Zdjęcie użytkownika
          nameUser: data.nameUser, // Nazwa użytkownika
        });

        if (data.name) {
          footballersSet.add(data.name);
        }
      });

      setFootballer(kingData);
      setUniqueFootballers(Array.from(footballersSet)); // Tablica unikalnych piłkarzy
    });

    return () => unsubscribe();
  }, []);

  if (uniqueFootballers.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.mainWrapper}>
      {uniqueFootballers.map((footballerName, index) => {
        // Filtrujemy użytkowników, którzy obstawili tego konkretnego zawodnika
        const votesForFootballer = footballer.filter(
          (f) => f.name === footballerName,
        );

        return (
          <View style={styles.cardContainer} key={index}>
            {/* NAGŁÓWEK KARTY (Nazwisko Piłkarza + Licznik Głosów) */}
            <View style={styles.header}>
              <Text style={styles.teamName}>{footballerName}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {votesForFootballer.length}{" "}
                  {votesForFootballer.length == 1
                    ? "głos"
                    : votesForFootballer.length > 1 &&
                        votesForFootballer.length < 5
                      ? "głosy"
                      : "głosów"}
                </Text>
              </View>
            </View>

            {/* SEKCJA Z UŻYTKOWNIKAMI (Elastyczna siatka chipsów) */}
            <View style={styles.playersGrid}>
              {votesForFootballer.map((player, pIndex) => (
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
                    {player.nameUser}
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
