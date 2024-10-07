import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import Header from "../components/header";
import useOrderStore from "../OrderStore"; // Ensure this path is correct
import { useNavigation } from "@react-navigation/native";

const SummaryMenuScreen = () => {
  const order = useOrderStore((state) => state.order);

  const handleDeleteOrderItem = (orderId) => {
    useOrderStore.getState().removeOrderItem(orderId);
  };
  const navigation = useNavigation();

  const renderOrderItem = ({ item }) => {
    return (
      <View style={styles.restaurantItem}>
        <TouchableOpacity onPress={() => {}}>
          <View style={{ flexDirection: "row" }}>
            {item?.picture && (
              <Image
                source={{ uri: item.picture }}
                style={{ width: 48, height: 48 }}
              />
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.restaurantName}>
                {item?.name || "Menu not found"}
              </Text>
              <Text style={styles.restaurantStatus}>
                จำนวน: {item.quantity}
              </Text>
              <Text style={styles.restaurantStatus}>
                ราคาต่อหน่วย: {item?.price}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteOrderItem(item.orderId)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={"รายการสั่งซื้อ"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={{ padding: 32 }}>
        {order.orderItems.length === 0 ? (
          <View style={{ justifyContent: "center", alignSelf: "center" }}>
            <Text>รายการว่างเปล่า</Text>
          </View>
        ) : (
          <FlatList
            data={order.orderItems}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.menuId}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.orderButton,
            order.orderItems.length !== 0 && {
              backgroundColor: "#2C2C2C",
            },
          ]}
          disabled={order.orderItems.length === 0}
          onPress={() => navigation.navigate("ConfirmOrder" as never)}
        >
          <Text style={styles.buttonText}>สั่ง</Text>
        </TouchableOpacity>
        {order.orderItems.length === 0 && (
          <Text style={styles.footerNote}>*กรุณาต้องการรออาหารโดยใส่จำนวน</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    width: 160,
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  deleteButton: {
    color: "red",
    fontSize: 16,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerNote: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    color: "red",
  },
});

export default SummaryMenuScreen;
