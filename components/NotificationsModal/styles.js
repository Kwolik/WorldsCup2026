import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent", // Niewidoczne, ale przechwytuje dotyk
  },
  popoverContainer: {
    position: "absolute",
    top: 165, // Dostosuj, by pasowało pod dzwonek
    right: 35,
    width: 250,
    backgroundColor: "#003279",
    borderRadius: 15,
    padding: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  arrow: {
    position: "absolute",
    top: -10,
    right: 15,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#003279",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.2)",
    paddingBottom: 5,
  },
  title: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  itemTitle: { color: "#FFF", fontSize: 13, fontWeight: "600" },
  itemBody: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 12,
    padding: 10,
  },
});

export default styles;
