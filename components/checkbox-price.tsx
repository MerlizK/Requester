import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

const CustomCheckboxPrice = ({
  label,
  price,
  checked,
  onPress,
  disabled,
}: {
  label: string;
  price: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <View style={styles.checkboxContainer}>
    <Checkbox
      status={checked ? "checked" : "unchecked"}
      onPress={onPress}
      color="#000"
      disabled={disabled ?? false}
    />
    <View style={styles.textContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 8,
  },
  label: {
    color: "#000",
    fontSize: 16,
    flex: 1,
  },
  price: {
    color: "#000",
    fontSize: 16,
    textAlign: "right",
  },
});

export default CustomCheckboxPrice;
