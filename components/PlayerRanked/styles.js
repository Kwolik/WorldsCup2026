import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    marginLeft: 4,
    marginRight: 4,
  },
  top: {
    width: "100%",
    height: 68,
    backgroundColor: "#003279",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    paddingLeft: 8,
    paddingRight: 8,
    zIndex: 1,
  },
  position: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 28,
  },
  result: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  bottom: {
    width: "100%",
    height: 48,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -22,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  nick: {
    color: "#003279",
    fontSize: 15,
    bottom: 3,
    fontWeight: "500",
  },
});

export default styles;
