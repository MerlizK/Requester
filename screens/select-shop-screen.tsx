import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import Header from "../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { APIURL, HeadersToken } from "../Constants";
import useOrderStore from "../OrderStore";

type RootStackParamList = {
  SelectMenu: { shopId: number; shopName: string };
  ShopReviewed: { shopId: number };
  SummaryMenu: undefined;
};

type SelectMenuScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "SelectMenu",
  "ShopReviewed" | "SummaryMenu"
>;

const SelectShopScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { order, updateOrderDetails } = useOrderStore();

  const navigation = useNavigation<SelectMenuScreenProps>();
  const fetchShops = async () => {
    try {
      const response = await axios.get(`${APIURL}shop/search`, {
        params: { canteenId: 1 },
        ...HeadersToken,
      });

      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };
  useEffect(() => {
    updateOrderDetails({ canteenId: 1 });
    fetchShops();
  }, []);

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() => {
        navigation.navigate("SelectMenu", {
          shopId: item.shopId,
          shopName: item.shopName,
        });
      }}
      disabled={!item.status}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.profilePicture}>
          {item.profilePicture ? (
            <Image
              source={{ uri: `${APIURL}${item.profilePicture}` }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ backgroundColor: "red" }}></View>
          )}
        </View>

        <View style={{ gap: 8 }}>
          <Text style={styles.restaurantName}>{item.shopName}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ShopReviewed", { shopId: item.shopId });
            }}
          >
            <Text style={{ fontSize: 14, color: "#5685FF" }}>ดูรีวิว</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.restaurantStatus, !item.status && { color: "red" }]}>
        {item.status ? "เปิด" : "ปิด"}
      </Text>
    </TouchableOpacity>
  );

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.shopName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOrderCount = () => {
    return order.orderItems.length;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", top: 0 }}>
      <Header
        title={"กรุณาเลือกร้านอาหาร"}
        showBackButton
        onBackPress={() => setModalVisible(true)}
      />
      <View style={styles.container}>
        <Text style={styles.header}>ค้นหาร้านอาหาร</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="ค้นหาร้านอาหาร"
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Entypo name="magnifying-glass" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredRestaurants}
          renderItem={renderRestaurant}
          keyExtractor={(item) => item.shopId.toString()}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignSelf: "center" }}
            onPress={() => navigation.navigate("SummaryMenu")}
          >
            {handleOrderCount() !== 0 && (
              <View style={styles.orderContainer}>
                <Text style={styles.orderCount}>{handleOrderCount()}</Text>
              </View>
            )}

            <Entypo name="shopping-basket" size={48} color="black" />
          </TouchableOpacity>

          <View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={[
                  styles.orderButton,
                  handleOrderCount() !== 0 && { backgroundColor: "#2C2C2C" },
                ]}
                disabled={order.orderItems.length === 0}
                onPress={() => navigation.navigate("ConfirmOrder" as never)}
              >
                <Text style={styles.buttonText}>สั่ง</Text>
              </TouchableOpacity>
            </View>

            {handleOrderCount() === 0 && (
              <Text style={styles.footerNote}>
                *กรุณาต้องการรออาหารโดยใส่จำนวน
              </Text>
            )}
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Entypo name="warning" size={64} color="#E6273E" />
              <Text style={styles.modalTitle}>ต้องการเลือกโรงอาหารอื่น?</Text>
              <Text style={styles.modalMessage}>
                หากคุณเลือกโรงอาหารใหม่ ข้อมูลที่สั่งไว้จะถูกล้าง
              </Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Home" as never);
                }}
              >
                <Text style={styles.buttonText}>เลือกโรงอาหารอื่น</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>ยกเลิก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 16,
    marginBottom: 8,
  },
  searchContainer: {
    position: "relative",
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingRight: 40,
  },
  searchIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  orderContainer: {
    borderRadius: 16,
    width: 24,
    height: 24,
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 16,
    backgroundColor: "green",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCount: {
    color: "white",
  },
  profilePicture: {
    marginTop: 5,
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 10,
  },
  restaurantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  restaurantName: {
    fontSize: 18,
  },
  restaurantStatus: {
    fontSize: 16,
    color: "green",
  },
  orderButton: {
    right: 0,
    width: 160,
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  footerNote: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    color: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#f00",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
});

export default SelectShopScreen;
