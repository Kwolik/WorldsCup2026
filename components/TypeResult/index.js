import { Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useState } from "react";
import styles from "./styles.js";
import { ResultList } from "../ResultList.js";
import CountryFlag from "react-native-country-flag";
import { db, auth } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TypeResult(props) {
  const value = [0, 1, 2];
  const [result, setResult] = useState("");
  const [visible, setVisible] = React.useState(false);
  const onDismissSnackBar = () => setVisible(false);

  const typeScore = (result) => {
    setResult("");
    setVisible(true);
    setDoc(doc(db, "users", auth.currentUser.uid, "types", props.matchid), {
      type: result,
      points: -1,
      winner: "",
    });
  };

  const typeScore1 = (win) => {
    setVisible(true);
    setDoc(doc(db, "users", auth.currentUser.uid, "types", props.matchid), {
      type: result,
      points: -1,
      winner: win,
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.bottomSheet}>
        <View style={styles.contentContainer}>
          {/* <Text style={styles.title}>Obstawianie meczy 🎉</Text> */}
          {result != "" && (
            <View style={styles.overtime}>
              <Text style={styles.title}>Kto wygra w dogrywce?</Text>
              <TouchableOpacity
                style={styles.top}
                onPress={() => typeScore1(props.club1)}
              >
                <CountryFlag
                  isoCode={props.club1id ? props.club1id : ""}
                  size={32}
                />
                <Text style={styles.nick}>{props.club1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.top}
                onPress={() => typeScore1(props.club2)}
              >
                <CountryFlag
                  isoCode={props.club2id ? props.club2id : ""}
                  size={32}
                />
                <Text style={styles.nick}>{props.club2}</Text>
              </TouchableOpacity>
            </View>
          )}
          {value.map((id, index) => (
            <View style={styles.viewResult} key={index}>
              <Text style={styles.title}>
                {id == 0 ? "Remis" : id == 1 ? props.club1 : props.club2}
              </Text>
              <FlatList
                data={ResultList}
                numColumns={1}
                horizontal={true}
                renderItem={({ item, index }) =>
                  item.type == id && (
                    <TouchableOpacity
                      key={index}
                      style={styles.typeResult}
                      onPress={() =>
                        props.type == 1 &&
                        item.value.substring(0, 1) == item.value.substring(2, 3)
                          ? setResult(item.value)
                          : typeScore(item.value)
                      }
                    >
                      <Text style={styles.resultText}>{item.value}</Text>
                    </TouchableOpacity>
                  )
                }
              />
            </View>
          ))}
        </View>
      </SafeAreaView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Undo",
          onPress: () => {
            onDismissSnackBar;
          },
        }}
      >
        Poprawnie obstawiono mecz
      </Snackbar>
    </View>
  );
}
