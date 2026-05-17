import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainWrapper: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardContainer: {
    width: "100%",
    borderRadius: 16,
    marginBottom: 14,
  },
  header: {
    width: "100%",
    height: 50,
    backgroundColor: "#003279",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    borderRadius: 4,
  },
  teamName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 12,
  },
  // Licznik głosów po prawej stronie nagłówka
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  // Elastyczna siatka graczy, która sama łamie wiersze
  playersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 6,
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
    paddingTop: 32,
    marginTop: -32,
    zIndex: -1,
  },
  // Kapsułka pojedynczego gracza
  playerChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003279",
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 8,
    borderRadius: 20,
    margin: 4,
    maxWidth: 130,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  playerName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
    flexShrink: 1, // pozwala tekstowi uciąć się za pomocą wielokropka jeśli jest zbyt długi
  },
});

export default styles;
