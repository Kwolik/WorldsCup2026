import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  nextMatch: {
    justifyContent: "center",
    alignItems: "center",
    right: "4%",
    marginBottom: 10,
  },
  plates: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "89.5%",
    marginLeft: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  plate: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  icon: {
    width: "100%",
    height: 60,
    backgroundColor: "#003279",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    zIndex: 1,
  },
  iconMain: {
    fontSize: 48,
    color: "#FFFFFF",
  },
  bottom: {
    width: "100%",
    height: 34,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: -16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  name: {
    color: "#003279",
    fontWeight: "bold",
  },
  matches3: {
    width: "88%",
    marginLeft: 4,
    marginTop: 24,
  },
  kingFootballer: {
    width: "88%",
    marginLeft: 4,
    marginBottom: "10%",
  },
});

export default styles;
