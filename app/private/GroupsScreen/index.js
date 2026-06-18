import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import CountryFlag from "react-native-country-flag";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../../styles/Group/styles.js";
import { TeamList } from "../../../components/TeamList.js";

export default function GroupsScreen() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "a148fdc549a14d3b92cc739e8188a014";

  // Funkcja pomocnicza zamieniająca kody FIFA (z API) na kody ISO (używane w Twoim TeamList i bibliotece flag)
  const fifaToIso = (fifaCode) => {
    if (!fifaCode) return "un";
    const code = fifaCode.toUpperCase();

    const mapping = {
      // EUROPA (UEFA)
      AUT: "at",
      BEL: "be",
      BIH: "ba", // Bośnia i Hercegowina
      CRO: "hr",
      CZE: "cz",
      DEN: "dk",
      ENG: "gb-eng",
      FRA: "fr",
      GER: "de",
      NED: "nl",
      NOR: "no",
      POR: "pt",
      SCO: "gb-sct",
      ESP: "es",
      SWE: "se",
      SUI: "ch",
      TUR: "tr",
      // AMERYKA POŁUDNIOWA (CONMEBOL)
      ARG: "ar",
      BRA: "br",
      COL: "co",
      ECU: "ec",
      PAR: "py",
      URU: "uy",
      // AMERYKA PÓŁNOCNA, ŚRODKOWA I KARAIBY (CONCACAF)
      CAN: "ca",
      CRC: "cr",
      CUW: "cw", // Curaçao
      HAI: "ht",
      MEX: "mx",
      PAN: "pa",
      USA: "us",
      // AZJA (AFC)
      AUS: "au",
      IRN: "ir",
      IRQ: "iq",
      JPN: "jp",
      JOR: "jo",
      QAT: "qa",
      KSA: "sa",
      KOR: "kr",
      UZB: "uz",
      // AFRYKA (CAF)
      ALG: "dz",
      CPV: "cv", // Republika Zielonego Przylądka
      COD: "cd", // DR Konga
      EGY: "eg",
      GHA: "gh",
      CIV: "ci", // Wybrzeże Kości Słoniowej
      MAR: "ma",
      SEN: "sn",
      RSA: "za",
      TUN: "tn",
      // OCEANIA (OFC)
      NZL: "nz",
    };

    return mapping[code] || code.substring(0, 2).toLowerCase();
  };

  // Funkcja, która dba o to, by bardzo długie nazwy z TeamList nie rozpychały komórek tabeli
  const formatShortName = (name) => {
    if (name === "Wybrzeże Kości Słoniowej") return "WKS";
    if (name === "Korea Południowa") return "Korea Płd.";
    if (name === "Arabia Saudyjska") return "Arabia Saud.";
    if (name === "Południowa Afryka") return "RPA";
    return name;
  };

  useEffect(() => {
    const fetchWorldCupStandings = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.football-data.org/v4/competitions/WC/standings",
          {
            headers: {
              "X-Auth-Token": API_KEY,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.status}`);
        }

        const data = await response.json();

        if (data.standings) {
          const formattedGroups = data.standings
            .filter((s) => s.type === "TOTAL")
            .map((groupData) => ({
            id: groupData.group,
            name: groupData.group.replace("_", " "),
            teams: groupData.table.map((row) => {
              const apiCode =
                row.team && row.team.tla ? row.team.tla.toUpperCase() : "";
              const englishName = row.team?.name || "";

              // Konwertujemy kod z API na format ISO
              const isoFormat = fifaToIso(apiCode);

              // Szukamy kraju w Twojej liście TeamList
              const myTeamData = TeamList.find((t) => {
                const currentCode = t.code ? t.code.trim().toLowerCase() : "";
                return currentCode === isoFormat.toLowerCase();
              });

              let finalName = "";
              let finalIsoCode = "";

              // NOWY TEST: Łapiemy Urugwaj po jego angielskiej nazwie z API
              if (englishName.toLowerCase().includes("uruguay")) {
                finalName = "Urugwaj";
                finalIsoCode = "uy";
              } else if (myTeamData) {
                finalName = formatShortName(myTeamData.value);
                finalIsoCode = myTeamData.code.trim().toLowerCase();
              } else {
                finalName =
                  row.team?.shortName || row.team?.name || "Nieznana drużyna";
                finalIsoCode = isoFormat;
              }
              return {
                rank: row.position,
                name: finalName,
                isoCode: finalIsoCode === "" ? "un" : finalIsoCode,
                points: row.points,
              };
            }),
          }));
          setGroups(formattedGroups);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Nie udało się pobrać aktualnych tabel grupowych.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorldCupStandings();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={require("../../../assets/background.jpg")}
        style={styles.image}
        resizeMode="stretch"
      >
        <SafeAreaView style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#003279" />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        source={require("../../../assets/background.jpg")}
        style={styles.image}
        resizeMode="stretch"
      >
        <SafeAreaView style={[styles.container, styles.center]}>
          <Text style={styles.errorText}>{error}</Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../../assets/background.jpg")}
      style={styles.image}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupHeaderText}>
                  {item.name.replace("GROUP", "Grupa")}
                </Text>
              </View>

              <View style={styles.teamsListContainer}>
                {item.teams.map((team) => (
                  <View key={`${item.id}-${team.name}`} style={styles.teamRow}>
                    <View
                      style={[styles.leftContainer, { flex: 1, paddingRight: 10 }]}
                    >
                      <Text style={styles.rankNumber}>{team.rank}</Text>

                      <CountryFlag isoCode={team.isoCode} size={20} style={styles.flag} />

                      <Text style={styles.teamName} numberOfLines={1} ellipsizeMode="tail">
                        {team.name}
                      </Text>
                    </View>
                    <Text style={styles.pointsText}>{team.points} pkt</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}
