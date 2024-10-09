import React from "react";
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
import useOrderStore from "../OrderStore";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

const SummaryMenuScreen = () => {
  const order = useOrderStore((state) => state.order);
  const navigation = useNavigation();

  const handleDeleteOrderItem = (orderId) => {
    useOrderStore.getState().removeOrderItem(orderId);
  };

  const renderOrderItem = ({ item }) => {
    return (
      <View style={styles.restaurantItem}>
        <TouchableOpacity onPress={() => {}}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                justifyContent: "center",
                width: 87,
                height: 64,
                top: 4,
              }}
            >
              {item?.picture && (
                <Image
                  source={{ uri: item.picture }}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 8,
                    alignSelf: "center",
                  }}
                />
              )}
            </View>

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.restaurantName}>
                {item?.name || "Menu not found"}
              </Text>
              <Text style={styles.restaurantStatus}>จำนวน {item.quantity}</Text>
              <Text style={styles.restaurantStatus}>
                ราคา: {item.totalPrice} บาท
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteOrderItem(item.orderId)}>
          <Entypo name="circle-with-cross" size={36} color="red" />
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
      {order.orderItems.length === 0 ? (
        <View
          style={{ justifyContent: "center", alignSelf: "center", flex: 1 }}
        >
          <Text>รายการว่างเปล่า</Text>
        </View>
      ) : (
        <FlatList
          data={order.orderItems}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={{ paddingHorizontal: 32, flexGrow: 1 }}
        />
      )}

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
    fontSize: 16,
    fontWeight: "bold",
  },
  restaurantStatus: {
    fontSize: 16,
  },
  orderButton: {
    width: 160,
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
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
