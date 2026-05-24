import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import React, { useState } from "react";
import styles from "./styles.js"; // Dostosuj style pod nowe komponenty
import CountryFlag from "react-native-country-flag";
import { db, auth } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResultList } from "../ResultList.js";

export default function TypeResult(props) {
  const [selectedCategory, setSelectedCategory] = useState(null); // 0: Remis, 1: Klub 1, 2: Klub 2
  const [selectedScore, setSelectedScore] = useState(null);
  const [visible, setVisible] = useState(false);

  const isCupMatch = props.type == 1; // Czy to mecz fazy pucharowej (z dogrywką)

  // Funkcja pomocnicza sprawdzająca, czy dany ciąg tekstowy (np. "1:1") to remis
  const checkIfDraw = (score) => {
    if (!score) return false;
    return score.substring(0, 1) === score.substring(2, 3);
  };

  const saveBet = async (scoreValue, winnerValue = "") => {
    // BLOKADA: Jeśli to mecz pucharowy, a wynik to remis, ale użytkownik NIE wybrał zwycięzcy dogrywki
    if (isCupMatch && checkIfDraw(scoreValue) && winnerValue === "") {
      // Nie pozwalamy zapisać do bazy, dopóki nie kliknie drużyny z dogrywki
      return;
    }

    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid, "types2026", props.matchid),
        {
          type: scoreValue,
          points: -1,
          winner: winnerValue,
        },
      );
      setVisible(true);

      // Reset stanu po udanym zapisie
      setSelectedCategory(null);
      setSelectedScore(null);
    } catch (error) {
      console.error("Błąd podczas obstawiania: ", error);
    }
  };

  const handleScoreSelect = (scoreValue) => {
    setSelectedScore(scoreValue);

    const isDraw = checkIfDraw(scoreValue);

    if (!isCupMatch || !isDraw) {
      saveBet(scoreValue, "");
    }
  };

  // Sprawdzamy czy okienko dogrywki powinno się wyświetlić
  const showOvertimeSelection =
    isCupMatch && selectedCategory === 0 && checkIfDraw(selectedScore);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>Obstaw wynik meczu</Text>

        {/* KROK 1: Wybór 1 X 2 */}
        <View style={styles.mainTypeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedCategory === 1 && styles.activeButton,
            ]}
            onPress={() => {
              setSelectedCategory(1);
              setSelectedScore(null);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                selectedCategory === 1 && { color: "#003279" },
              ]}
            >
              {props.club1 || "Gospodarze"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedCategory === 0 && styles.activeButton,
            ]}
            onPress={() => {
              setSelectedCategory(0);
              setSelectedScore(null);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                selectedCategory === 0 && { color: "#003279" },
              ]}
            >
              Remis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedCategory === 2 && styles.activeButton,
            ]}
            onPress={() => {
              setSelectedCategory(2);
              setSelectedScore(null);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                selectedCategory === 2 && { color: "#003279" },
              ]}
            >
              {props.club2 || "Goście"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* KROK 2: Wybór dokładnego wyniku */}
        {selectedCategory !== null && (
          <View style={styles.scoresSection}>
            <Text style={styles.subTitle}>Wybierz dokładny wynik:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scoresGrid}
            >
              {ResultList.filter((item) => item.type === selectedCategory).map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.scoreTile,
                      selectedScore === item.value && styles.activeScoreTile,
                    ]}
                    onPress={() => handleScoreSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.scoreText,
                        selectedScore === item.value && { color: "#003279" },
                      ]}
                    >
                      {item.value}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
          </View>
        )}

        {/* KROK 3: Okienko dogrywki - wyskoczy TYLKO gdy puchar + kliknięto Kategorię Remis + Wynik jest remisowy */}
        {showOvertimeSelection && (
          <View style={styles.overtimeContainer}>
            <Text style={styles.overtimeTitle}>
              Mecz pucharowy! Kto awansuje po dogrywce/karnych?
            </Text>

            <View style={styles.overtimeButtonsRow}>
              <TouchableOpacity
                style={styles.overtimeButton}
                onPress={() => saveBet(selectedScore, props.club1)}
              >
                <CountryFlag
                  isoCode={props.club1id || ""}
                  size={24}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.overtimeButtonText}>{props.club1}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.overtimeButton}
                onPress={() => saveBet(selectedScore, props.club2)}
              >
                <CountryFlag
                  isoCode={props.club2id || ""}
                  size={24}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.overtimeButtonText}>{props.club2}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        Poprawnie obstawiono mecz! 🎉
      </Snackbar>
    </View>
  );
}
