import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Header from "../components/header";

type RootStackParamList = {
  Home: undefined;
  SelectShop: { canteen: number };
};

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const goToSelectShopScreen = (canteen: number) => {
    navigation.navigate("SelectShop", { canteen });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", top: 0 }}>
      <Header title="กรุณาเลือกโรงอาหาร" />
      <View style={styles.container}>
        <TextInput style={styles.searchBar} placeholder="ค้นหาโรงอาหาร" />

        <TouchableOpacity
          style={{
            padding: 16,
            backgroundColor: "#2C2C2C",
            justifyContent: "center",
            alignItems: "center",
            width: 200,
            borderRadius: 8,
            margin: 8,
            marginLeft: 0,
          }}
        >
          <Text style={styles.viewMapText}>ดูแผนที่</Text>
        </TouchableOpacity>
        <ScrollView>
          {canteens.map((canteen, index) => (
            <TouchableOpacity
              key={index}
              style={styles.canteenCard}
              onPress={() => goToSelectShopScreen(canteen.id)}
            >
              <View style={styles.canteenInfo}>
                <Text style={styles.canteenText}>{canteen.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bottomNav}>
          {navItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.navButton}>
              <Text style={styles.navButtonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const canteens = [{ id: 1, name: "โรงอาหาร 1" }];

const navItems = [
  { label: "ส่งอาหาร", route: "FoodDelivery" },
  { label: "ประวัติ", route: "History" },
  { label: "ข้อมูลผู้ใช้", route: "UserInfo" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 32,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  canteenCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  canteenInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  canteenText: {
    fontSize: 16,
    color: "#333",
  },
  viewMapText: {
    color: "white",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "white",
  },
  navButton: {
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 14,
    color: "#333",
  },
});

export default HomeScreen;
