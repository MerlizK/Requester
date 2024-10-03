import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

const CustomCheckbox = ({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) => (
  <View style={styles.checkboxContainer}>
    <Checkbox
      status={checked ? "checked" : "unchecked"}
      onPress={onPress}
      color="#000"
    />
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "#000",
    fontSize: 16,
  },
});

export default CustomCheckbox;
