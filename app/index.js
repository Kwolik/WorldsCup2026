// Kod dla app/index.js
import { View } from "react-native";
import LoadingScreen from "../components/LoadingScreen";

export default function Page() {
  // Ten plik tylko wyświetla kręciołek. 
  // Główny _layout.js wykryje ten punkt i natychmiast przerzuci Cię albo do Login, albo do Home.
  return (
    <View style={{ flex: 1 }}>
      <LoadingScreen />
    </View>
  );
}