import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
  },
  top: {
    backgroundColor: "#003279",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  icon: {
    fontSize: 34,
    position: "absolute",
    top: -22,
    left: -2,
  },
  info: {
    color: "#FFFFFF",
    fontSize: 14,
    margin: 2,
  },
  result: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    margin: 1,
  },
  teams: {
    color: "#FFFFFF",
    fontSize: 18,
    marginLeft: 12,
  },
  country: {
    flexDirection: "row",
    padding: 4,
    margin: 2,
  },
  viewResult: {
    width: "10%",
    alignItems: "center",
    padding: 8,
  },
  pointsView: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 45,
  },
  points: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: "center",
    justify: "center",
    minWidth: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default styles;
