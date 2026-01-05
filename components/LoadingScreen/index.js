import { View } from "react-native";
import styles from "./styles.js";
import { ActivityIndicator } from "react-native-paper";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} color={"#003279"} size={64} />
    </View>
  );
}
