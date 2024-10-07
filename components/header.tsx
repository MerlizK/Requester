import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Entypo
              name="chevron-small-left"
              size={40}
              color="black"
              style={styles.backIcon}
            />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>
      <View style={styles.headerLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 32,
    width: "100%",
    paddingHorizontal: 32,
    backgroundColor: "white",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "green",
    marginTop: 10,
  },
  backButton: {
    paddingRight: 16,
  },
  backIcon: { marginLeft: -8 },
});

export default Header;
