import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  top: {
    width: "96%",
    backgroundColor: "#003279",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  icon: {
    fontSize: 34,
    position: "absolute",
    top: -22,
    left: -2,
  },
  points: {
    position: "absolute",
    top: -18,
    left: 8,
    transform: [{ rotate: "-20deg" }],
    fontSize: 16,
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
  bottom: {
    width: "96%",
    height: 46,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -18,
    zIndex: -1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
});

export default styles;
