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
  const [isLoading, setIsLoading] = useState(true);

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
    const colors = [
      "#1e3a8a",
      "#0284c7",
      "#0f766e",
      "#b45309",
      "#b91c1c",
      "#6d28d9",
      "#4d7c0f",
    ];
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
    const todoRef = collection(db, "footballer2026");
    const unsubscribe = onSnapshot(
      todoRef,
      async (querySnapshot) => {
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

        setIsLoading(false);
      },
      (error) => {
        console.error("Błąd pobierania danych piłkarzy:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [footballerImages]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.mainWrapper}>
      {uniqueFootballers.map((footballerName, index) => {
        const votesForFootballer = footballer.filter(
          (f) => f.name === footballerName,
        );

        const playerOnlineImg = footballerImages[footballerName];
        const hasImageError = imageErrors[footballerName] || !playerOnlineImg;

        return (
          <View style={styles.cardContainer} key={index}>
            <View style={styles.header}>
              <View style={styles.viewFootballer}>
                {!hasImageError ? (
                  <Image
                    source={{ uri: playerOnlineImg }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => {
                      setImageErrors((prev) => ({
                        ...prev,
                        [footballerName]: true,
                      }));
                    }}
                  />
                ) : (
                  <View
                    style={[
                      styles.view,
                      { backgroundColor: getRandomColor(footballerName) },
                    ]}
                  >
                    <Text style={styles.textFootballer}>
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
