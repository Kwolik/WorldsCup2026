import { View, Text, Image } from "react-native";
import styles from "./styles.js";

export default function PlayerRanked(props) {
  return (
    props.position > 3 && (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.position}>{props.position}</Text>
          {props.photo ? (
            <Image style={styles.avatar} source={{ uri: props.photo }} />
          ) : (
            <Image
              style={styles.avatar}
              source={require("../../assets/icon.png")}
            />
          )}
          <Text style={styles.result}>{props.points} pkt</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.nick}>{props.name}</Text>
        </View>
      </View>
    )
  );
}
