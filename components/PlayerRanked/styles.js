import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  top: {
    width: "100%",
    height: 56,
    backgroundColor: "#003279",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    paddingLeft: 8,
    paddingRight: 8,
    zIndex: 1,
  },
  position: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 42,
  },
  result: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottom: {
    width: "100%",
    height: 42,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  nick: {
    color: "#003279",
    fontSize: 16,
    bottom: 2,
  },
});

export default styles;
