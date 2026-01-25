import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  email: {
    marginTop: 10,
  },
  descView: {
    marginLeft: 10,
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 36,
    paddingTop: 2,
  },
  inputView: {
    marginLeft: 10,
    width: "80%",
    backgroundColor: "#003279",
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    top: -14,
  },
  emailTitle: {
    color: "#003279",
    marginLeft: 12,
  },
  emailInput: {
    color: "#FFFFFF",
    marginLeft: 12,
    fontSize: 16,
  },
  buttons: {
    width: "80%",
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLogged: {
    width: 120,
    height: 40,
    backgroundColor: "#003279",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",

    textShadowColor: "#000000",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  routeRegistiration: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    width: "80%",
    marginTop: 40,
  },
  descViewFirst: {
    backgroundColor: "#003279",
    borderRadius: 16,
    height: 48,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  descViewTwo: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 36,
    top: -16,
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomEndRadius: 16,
  },
  descTextFirst: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  descTextTwo: {
    color: "#003279",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
