import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "auto",
  },
  top: {
    backgroundColor: "#003279",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 1,
    height: 72,
  },
  info: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  date: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  mainTeams: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: -12,
  },
  result: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
    width: 48,
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  bottom: {
    height: 66,
    backgroundColor: "#FFFFFF",
    marginTop: -40,
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  teams: {
    color: "#003279",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  viewButton: {
    width: 120,
    height: 40,
    backgroundColor: "#003279",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  textButton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSheet: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    height: "auto",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    padding: 4,
  },
  typeResult: {
    width: "20%",
    backgroundColor: "#003279",
    height: "16%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  resultText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonBack: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    width: "100%",
  },
  back: {
    backgroundColor: "#003279",
    height: 42,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  textBack: {
    fontSize: 16,
    color: "#FFFFFF",
    padding: 8,
  },
});

export default styles;
