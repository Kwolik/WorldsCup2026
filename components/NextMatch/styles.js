import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  top: {
    height: 36,
    width: "100%",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    flexDirection: "row",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    bottom: -12,
  },
  row: {
    flexDirection: "row",
    marginLeft: 8,
    marginRight: 8,
  },
  icon: {
    fontSize: 24,
    color: "#003279",
  },
  info: {
    fontSize: 18,
    color: "#003279",
    marginLeft: 4,
    marginTop: -1,
  },
  flags: {
    height: 46,
    width: "100%",
    backgroundColor: "#003279",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 16,
    zIndex: 1,
  },
  flag: {
    marginLeft: 16,
    marginRight: 16,
  },
  bottom: {
    height: 36,
    width: "100%",
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    top: -12,
  },
  team: {
    fontSize: 16,
    color: "#003279",
    fontWeight: "bold",
    marginBottom: 2,
  },
});

export default styles;
