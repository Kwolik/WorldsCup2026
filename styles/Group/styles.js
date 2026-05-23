import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "86%",
    paddingTop: 72,
    marginLeft: "2.5%",
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginTop: 16,
    overflow: "hidden",
    elevation: 3, // cień na Android
    shadowColor: "#000", // cień na iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupHeader: {
    backgroundColor: "#003279", // ciemnoniebieski kolor z Twojej grafiki
    paddingVertical: 14,
    alignItems: "center",
    borderBottomLeftRadius: 24, // lekkie wcięcie na dole nagłówka
    borderBottomRightRadius: 24,
  },
  groupHeaderText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  teamsListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankBadge: {
    backgroundColor: "#4A4A4A", // ciemnoszary badge pozycji
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
    width: 65,
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 24,
    fontWeight: "500",
    color: "#003279",
    width: 30,
    textAlign: "center",
    marginRight: 12,
  },

  flag: {
    borderRadius: 2,
    marginRight: 12,
    width: 32,
    height: 22,
  },
  teamName: {
    fontSize: 18,
    color: "#003279",
    fontWeight: "500",
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003279",
  },
});

export default styles;
