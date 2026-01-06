import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: 100,
    margin: 10,
  },
  top: {
    width: "100%",
    height: 48,
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
    top: -14,
    left: 4,
  },
  points: {
    position: "absolute",
    top: -11,
    left: 12,
    transform: [{ rotate: "-20deg" }],
    fontSize: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 32,
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
  nick: {
    color: "#003279",
    fontSize: 14,
    marginBottom: 2,
  },
});

export default styles;
