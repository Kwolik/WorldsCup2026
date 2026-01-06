import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  top: {
    width: "100%",
    height: 36,
    backgroundColor: "#003279",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingLeft: 24,
    paddingRight: 10,
  },
  team: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottom: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFFFFF",
    marginTop: -18,
    zIndex: -1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  player: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 16,
  },
  teams: {
    color: "#003279",
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 2,
    marginRight: 4,
  },
});

export default styles;
