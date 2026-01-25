import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  image: {
    flex: 1,
    resizeMode: "auto", //upewnic sie czy background dobrze sie skaluje
  },
  matchNext: {
    justifyContent: "center",
    alignItems: "center",
    right: "4%",
  },
  flatlist: {
    width: "88%",
    marginLeft: 4,
    marginTop: 4,
    height: "74%",
  },
});

export default styles;
