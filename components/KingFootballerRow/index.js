import { View, Text, Image } from "react-native";
import { useState, useEffect } from "react";
import styles from "./styles.js";
import { db } from "../../firebaseConfig.js";
import { collection, onSnapshot } from "firebase/firestore";
import LoadingScreen from "../LoadingScreen/index.js";

export default function KingFootballerRow() {
  const [footballer, setFootballer] = useState([]);
  const [uniqueFootballers, setUniqueFootballers] = useState([]);
  const [footballerImages, setFootballerImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  // 1. Funkcja generująca inicjały (np. "Harry Kane" -> "HK")
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // 2. Funkcja dobierająca stały, unikalny kolor tła dla inicjałów piłkarza
  const getRandomColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ["#1e3a8a", "#0284c7", "#0f766e", "#b45309", "#b91c1c", "#6d28d9", "#4d7c0f"];
    return colors[Math.abs(hash) % colors.length];
  };

  // Niezawodna funkcja pobierająca zdjęcie z DuckDuckGo Instant Answers API
  const fetchFootballerImage = async (name) => {
    try {
      const formattedName = encodeURIComponent(name.trim());
      const url = `https://api.duckduckgo.com/?q=${formattedName}&format=json&no_redirect=1&no_html=1`;

      const response = await fetch(url);
      const json = await response.json();

      if (json.Image && json.Image !== "") {
        if (json.Image.startsWith("/")) {
          return `https://duckduckgo.com${json.Image}`;
        }
        return json.Image;
      }
      return null; 
    } catch (error) {
      console.log(`Błąd pobierania zdjęcia DuckDuckGo dla: ${name}`, error);
      return null;
    }
  };

  useEffect(() => {
    const todoRef = collection(db, "footballer");
    const unsubscribe = onSnapshot(todoRef, async (querySnapshot) => {
      const kingData = [];
      const footballersSet = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name) {
          const cleanName = data.name.trim();
          kingData.push({
            id: doc.id,
            name: cleanName,
            photo: data.photo,
            nameUser: data.nameUser,
          });
          footballersSet.add(cleanName);
        }
      });

      const uniqueList = Array.from(footballersSet);
      setFootballer(kingData);
      setUniqueFootballers(uniqueList);

      const imagesMap = { ...footballerImages };
      let updated = false;

      const promises = uniqueList.map(async (name) => {
        if (!imagesMap[name]) {
          const imgUrl = await fetchFootballerImage(name);
          if (imgUrl) {
            imagesMap[name] = imgUrl;
            updated = true;
          }
        }
      });

      await Promise.all(promises);
      
      if (updated) {
        setFootballerImages(imagesMap);
      }
    });

    return () => unsubscribe();
  }, [footballerImages]);

  if (uniqueFootballers.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.mainWrapper}>
      {uniqueFootballers.map((footballerName, index) => {
        const votesForFootballer = footballer.filter(
          (f) => f.name === footballerName
        );

        const playerOnlineImg = footballerImages[footballerName];
        // Warunek sprawdzający, czy obrazek nie istnieje lub wystąpił błąd ładowania sieciowego
        const hasImageError = imageErrors[footballerName] || !playerOnlineImg;

        return (
          <View style={styles.cardContainer} key={index}>
            {/* NAGŁÓWEK KARTY */}
            <View style={styles.header}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                
                {/* Dynamiczna zmiana: Obrazek z sieci LUB Inicjały w ładnym kolorowym kółku */}
                {!hasImageError ? (
                  <Image
                    source={{ uri: playerOnlineImg }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      marginRight: 12,
                      backgroundColor: "#1e293b",
                    }}
                    resizeMode="cover"
                    // Jeśli serwer zewnętrzny zablokuje obrazek (szare kółko) - natychmiast przełączamy na inicjały
                    onError={() => {
                      setImageErrors((prev) => ({ ...prev, [footballerName]: true }));
                    }}
                  />
                ) : (
                  /* AWARYJNY SPÓJNY AWATAR Z INICJAŁAMI */
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: getRandomColor(footballerName),
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                      {getInitials(footballerName)}
                    </Text>
                  </View>
                )}
                
                <Text style={styles.teamName}>{footballerName}</Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {votesForFootballer.length}{" "}
                  {votesForFootballer.length === 1
                    ? "głos"
                    : votesForFootballer.length > 1 &&
                      votesForFootballer.length < 5
                    ? "głosy"
                    : "głosów"}
                </Text>
              </View>
            </View>

            {/* SEKCJA Z UŻYTKOWNIKAMI */}
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