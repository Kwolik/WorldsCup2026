import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#003279",
    width: "96%",
    borderRadius: 24,
    padding: 16,
    marginHorizontal: "2%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // cień na Androidzie
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },

  // KROK 1: Główne przyciski 1 X 2
  mainTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // półprzezroczysty biały
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: "#FFFFFF", // pełny biały gdy aktywny
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // KROK 2: Sekcja dokładnych wyników
  scoresSection: {
    width: "100%",
    marginBottom: 16,
  },
  subTitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 10,
    paddingLeft: 4,
  },
  scoresGrid: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  scoreTile: {
    width: 65,
    height: 45,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activeScoreTile: {
    backgroundColor: "#00FF87", // nowoczesny zielony akcent na wybrany wynik
    borderColor: "#00FF87",
  },
  scoreText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  overtimeContainer: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
    alignItems: "center",
  },
  overtimeTitle: {
    color: "#FFD700", // złoty kolor ostrzeżenia/uwagi dla meczu pucharowego
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  overtimeButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  overtimeButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "46%",
  },
  overtimeButtonText: {
    color: "#003279",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default styles;
