import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";

export default function Player(props) {
  const [data, setData] = useState();

  useEffect(() => {
    const todoRef = doc(db, "users", props.id, "types", props.matchid);

    const unsubscribe = onSnapshot(todoRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Document data2:", docSnap.data());
        setData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, [props.matchid]);
  return (
    data &&
    data.type && (
      <View style={styles.container}>
        <View style={styles.top}>
          {data && data.points != -1 && (
            <MaterialCommunityIcons
              name="cards"
              style={[
                styles.icon,
                data.points == 0
                  ? { color: "#ed1c24" }
                  : data.points == 1 || data.points == 2
                  ? { color: "#fdee00" }
                  : { color: "#00c165" },
              ]}
            />
          )}
          {data && data.points != -1 && (
            <Text
              style={[
                styles.points,
                data.points == 0
                  ? { color: "#FFFFFF" }
                  : data.points == 1 || data.points == 2
                  ? { color: "#000000" }
                  : { color: "#FFFFFF" },
              ]}
            >
              {data.points}
            </Text>
          )}
          {props.photo ? (
            <Image style={styles.avatar} source={{ uri: props.photo }} />
          ) : (
            <Image
              style={styles.avatar}
              source={require("../../assets/icon.png")}
            />
          )}
          <Text style={styles.result}>{data && data.type}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.nick}>{props.name}</Text>
        </View>
      </View>
    )
  );
}
