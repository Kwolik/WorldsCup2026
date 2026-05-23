import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  top: {
    width: 100,
    justifyContent: "flex-end",
    marginTop: 24,
    zIndex: 1,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 40,
    top: -4,
  },
  mainBackground: {
    backgroundColor: "#D0CFD0",
    width: "100%",
    height: 72,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 20,
  },
  nick: {
    fontSize: 16,
    marginBottom: 6,
    color: "#003279",
    marginTop: 6,
  },
  bottom: {
    height: 44,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: -18,
    zIndex: -1,
  },
  points: {
    color: "#003279",
    fontWeight: "bold",
    marginBottom: 4,
  },
  firstPlace: {
    backgroundColor: "#FDDA13",
    width: "100%",
    height: 84,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 18,
  },
  avatarFirst: {
    width: 72,
    height: 72,
    borderRadius: 46,
    top: -8,
  },
  color3: {
    backgroundColor: "#8B5120",
  },
});

export default styles;
