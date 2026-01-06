import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  top: {
    width: "100%",
    height: 42,
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
    fontSize: 16,
  },
  result: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  bottom: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -18,
    zIndex: -1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  teams: {
    color: "#003279",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
