import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    height: "auto",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    padding: 4,
    backgroundColor: "#003279",
    width: "98%",
    borderRadius: 20,
    marginLeft: 4,
  },
  viewResult: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    width: "26%",
    color: "#FFFFFF",
    fontSize: 16,
  },
  typeResult: {
    width: 56,
    backgroundColor: "#FFFFFF",
    height: 40,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  resultText: {
    color: "#003279",
    fontSize: 18,
    fontWeight: "bold",
  },
  result: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    borderColor: "red",
    borderWidth: 2,
  },
  inputView: {
    marginLeft: 10,
    width: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  overtime: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
    margin: 10,
  },
  top: {
    width: "33%",
    height: 64,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 4,
    marginRight: 4,
  },
  nick: {
    color: "#003279",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default styles;
