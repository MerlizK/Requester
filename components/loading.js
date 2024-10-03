import React from "react";
import { Modal, View, StyleSheet, ActivityIndicator } from "react-native";
import AppLogo from "../assets/icons/app-logo.svg";

const LoadingScreen = ({ visible }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.container}>
        <AppLogo width={200} height={100} />
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00B855",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    marginTop: 20,
  },
});

export default LoadingScreen;
