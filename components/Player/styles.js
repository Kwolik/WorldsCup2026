import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "30.6%",
    margin: "1.4%",
    padding: "1%",
  },
  top: {
    width: "100%",
    height: 64,
    backgroundColor: "#003279",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  icon: {
    fontSize: 34,
    position: "absolute",
    top: -14,
    left: 4,
  },
  points: {
    position: "absolute",
    top: -11,
    left: 12,
    transform: [{ rotate: "-20deg" }],
    fontSize: 16,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  // Mała pigułka punktowa podpięta pod awatar
  badge: {
    position: "absolute",
    bottom: -8,
    right: -14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 32,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  result: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  bottom: {
    width: "100%",
    height: 44,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -18,
    zIndex: -1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  nick: {
    color: "#003279",
    fontSize: 16,
    marginBottom: 4,
  },
});

export default styles;
