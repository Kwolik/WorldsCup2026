import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import { db } from "../../firebaseConfig.js";
import { collection, onSnapshot } from "firebase/firestore";
import LoadingScreen from "../LoadingScreen/index.js";

export default function KingFootballerRow() {
  const [footballer, setFootballer] = useState([]);
  const team = [];

  useEffect(() => {
    const todoRef = collection(db, "footballer");
    const unsubscribe = onSnapshot(todoRef, (querySnapshot) => {
      const kingData = [];
      querySnapshot.forEach((doc) => {
        kingData.push({
          id: doc.id,
          name: doc.data().name,
          photo: doc.data().photo,
          nameUser: doc.data().nameUser,
        });
      });
      setFootballer(kingData);
    });

    return () => unsubscribe();
  }, []);

  footballer.map(
    (item) => team.indexOf(item.name) == -1 && team.push(item.name)
  );

  console.log(footballer);
  return team && team.length > 0 ? (
    team.map((item, index) => (
      <View style={styles.container} key={index}>
        <View style={styles.top}>
          <Text style={styles.team}>{item}</Text>
        </View>
        <View style={styles.bottom}>
          {footballer.map(
            (name, index) =>
              item == name.name && (
                <View style={styles.player} key={index}>
                  <Image
                    style={styles.avatar}
                    source={
                      name.photo
                        ? {
                            uri: name.photo,
                          }
                        : require("../../assets/icon.png")
                    }
                  />
                  <Text style={styles.teams}>{name.nameUser}</Text>
                </View>
              )
          )}
        </View>
      </View>
    ))
  ) : (
    <LoadingScreen />
  );
}
