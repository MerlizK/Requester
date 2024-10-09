import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Image,
  RefreshControl,
} from "react-native";
import Header from "../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { APIURL, HeadersToken } from "../Constants";
import useOrderStore from "../OrderStore";

type RootStackParamList = {
  DetailMenu: { menuId: number };
  SummaryMenu: undefined;
  SelectMenu: { shopId: number; shopName: string };
};

type SelectMenuScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "DetailMenu",
  "SummaryMenu"
>;

type Props = {
  route: RouteProp<RootStackParamList, "SelectMenu">; // Route prop type
};

const SelectMenuScreen = ({ route }: Props) => {
  const [menus, setMenus] = useState([]);
  const { order } = useOrderStore();
  const navigation = useNavigation<SelectMenuScreenProps>();
  const [loading, setLoading] = useState(false);

  const handleOrderCount = () => {
    return order.orderItems.length;
  };
  const { shopId, shopName } = route.params;
  const [searchText, setSearchText] = useState("");

  const filteredMenus = menus.filter((order) =>
    order.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${APIURL}shop/shop-menu`, {
        params: { shopId: shopId },
        ...HeadersToken,
      });
      setMenus(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [shopId]);

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantItem}
      onPress={() =>
        navigation.navigate("DetailMenu", { menuId: item.menuId.toString() })
      }
      disabled={!item.status}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: 48,
            height: 48,
            marginRight: 16,
            alignSelf: "center",
          }}
        >
          {item.picture ? (
            <Image
              source={{ uri: item.picture }}
              style={{ width: 48, height: 48, borderRadius: 8 }}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "#ccc",
                borderRadius: 8,
              }}
            />
          )}
        </View>
        <View style={{ gap: 8 }}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          {item.status ? (
            <Text style={styles.restaurantStatus}>ราคา: {item.price} บาท</Text>
          ) : (
            <Text style={[styles.restaurantStatus, { color: "red" }]}>หมด</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", top: 0 }}>
      <Header
        title={shopName}
        showBackButton
        onBackPress={() => navigation.navigate("SelectShop" as never)}
      />
      <View style={styles.container}>
        <Text style={styles.header}>ค้นหาเมนู</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาร้านอาหาร"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Entypo name="magnifying-glass" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredMenus}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.menuId.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading} // Show loading when refreshing
              onRefresh={fetchMenus} // Call fetchShops to refresh the data
            />
          }
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
    color: "black",
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

export default SelectMenuScreen;
