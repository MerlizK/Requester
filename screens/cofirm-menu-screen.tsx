import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import Header from "../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import useOrderStore from "../OrderStore";
import axios from "axios";
import { APIURL, HeadersToken } from "../Constants";
import { OrderItem } from "../OrderStore";

const ConfirmOrderScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(0);
  const [useGPS, setUseGPS] = useState(false);
  const navigation = useNavigation();

  const order = useOrderStore((state) => state.order);
  const sendOrderPayload = useOrderStore((state) => state.sendOrderPayload);
  const updateOrderDetails = useOrderStore((state) => state.updateOrderDetails);
  const clearOrder = useOrderStore((state) => state.clearOrder);
  const totalOrderPrice = order.orderItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  const fetchAddress = async () => {
    try {
      const response = await axios.get(`${APIURL}requester/address`, {
        ...HeadersToken,
      });
      const { defaultAddress, address } = response.data;
      updateOrderDetails({ addressId: defaultAddress });

      const defaultAddr = address.find(
        (addr) => addr.addressId === defaultAddress
      );
      if (defaultAddr) {
        setDeliveryAddress(defaultAddr.detail);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    if (useGPS) {
      //TODO: Get GPS location
      updateOrderDetails({ addressId: deliveryAddress });
    } else {
      updateOrderDetails({ addressId: deliveryAddress });
    }
  }, [useGPS]);

  useEffect(() => {
    updateOrderDetails({
      transactionType: "Debit-card",
      totalPrice: totalOrderPrice,
      shippingFee: 10,
    });
    updateOrderDetails({
      amount: totalOrderPrice + order.shippingFee,
    });
  }, [totalOrderPrice, order.shippingFee, updateOrderDetails]);

  const handleConfirmOrder = async () => {
    const payload = sendOrderPayload();

    console.log(
      "Payload being sent to the API:",
      JSON.stringify(payload, null, 2)
    );

    try {
      const response = await axios.post(
        `${APIURL}requester/create-order`,
        payload,
        {
          ...HeadersToken,
        }
      );
      console.log("API response:", response.data);
      clearOrder();
      navigation.navigate("Home" as never);
    } catch (error) {
      console.error(
        "Order submission error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const groupedOrderItems: { [shopId: number]: OrderItem[] } =
    order.orderItems.reduce((acc, item) => {
      if (!acc[item.shopId]) {
        acc[item.shopId] = [];
      }
      acc[item.shopId].push(item);
      return acc;
    }, {} as { [shopId: number]: OrderItem[] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title={"ยืนยันการสั่งซื้อ"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.container}>
        <View style={styles.orderDetails}>
          <View style={styles.sectionBox}>
            <Text style={styles.headerText}>สั่งจาก</Text>
            <Text>โรงอาหาร {order.canteenId}</Text>
          </View>
          <View style={[styles.sectionBox, { paddingTop: 16 }]}>
            <Text style={styles.headerText}>ตำแหน่งจัดส่ง</Text>
            <View style={styles.deliveryRow}>
              <View>
                <Text>{useGPS ? "ตามที่อยู่บนระบบ GPS" : deliveryAddress}</Text>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.changeText}>เปลี่ยน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[{ marginTop: 16 }, styles.sectionBox]}>
          <Text style={styles.headerText}>รายการที่สั่ง</Text>
          {Object.entries(groupedOrderItems).map(([shopId, items], index) => (
            <View style={{ marginLeft: 32 }} key={index}>
              <View style={[styles.spacebetween, { marginBottom: 0 }]}>
                <Text>{`ร้านค้า ${shopId}`}</Text>
                <Text>{`${items
                  .reduce((acc, item) => acc + item.totalPrice, 0)
                  .toFixed(2)} บาท`}</Text>
              </View>
              {items.map((item, index) => (
                <View style={{ marginLeft: 32 }} key={index}>
                  <View style={[styles.spacebetween, { marginBottom: 0 }]}>
                    <Text style={{ fontSize: 12 }}>{item.name}</Text>
                    <Text style={{ fontSize: 12 }}>{`${item.totalPrice.toFixed(
                      2
                    )} บาท`}</Text>
                  </View>

                  <View style={[styles.spacebetween, { marginBottom: 0 }]}>
                    <Text style={styles.subDetails}>{"จำนวน "}</Text>
                    <Text style={styles.subDetails}>{`${item.quantity}`}</Text>
                  </View>
                  {item.specialInstructions && (
                    <View
                      style={[
                        styles.spacebetween,
                        { marginBottom: 0, justifyContent: "flex-start" },
                      ]}
                    >
                      <Text style={styles.subDetails}>{"เพิ่มเติม: "}</Text>
                      <Text
                        style={styles.subDetails}
                      >{`${item.specialInstructions}`}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.priceDetails}>
          <View style={[styles.spacebetween]}>
            <Text style={styles.priceBold}>ราคาอาหารรวม </Text>
            <Text style={styles.priceBold}>
              {order.totalPrice.toFixed(2)} บาท
            </Text>
          </View>
          <View style={[styles.sectionBox, styles.spacebetween]}>
            <Text style={styles.priceBold}>ราคาจัดส่ง </Text>
            <Text style={styles.priceBold}>
              {order.shippingFee.toFixed(2)} บาท
            </Text>
          </View>
          <View style={[styles.sectionBox, styles.spacebetween]}>
            <Text style={styles.priceBold}>ราคาทั้งหมด </Text>
            <Text style={styles.priceBold}>{order.amount.toFixed(2)} บาท</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.confirmButtonText}>ยืนยัน</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Header
              title="เลือกตำแหน่งจัดส่ง"
              showBackButton={true}
              onBackPress={() => setModalVisible(false)}
            />
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setUseGPS(true);
                  setModalVisible(false);
                }}
              >
                <Entypo name="map" size={36} color="black" />
                <View style={{ gap: 8 }}>
                  <Text>ตามที่อยู่บนระบบ GPS</Text>
                  <Text style={{ color: "grey" }}>
                    ทำการส่งไปยังที่อยู่ปัจจุบันของคุณ
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setUseGPS(false);
                  setModalVisible(false);
                }}
              >
                <Entypo name="location-pin" size={36} color="black" />
                <View style={{ gap: 8 }}>
                  <Text>ตามที่อยู่เริ่มต้น</Text>
                  <Text style={{ color: "grey" }}>{`${deliveryAddress}`}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    backgroundColor: "#fff",
  },
  orderDetails: { marginTop: 16 },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subDetails: { fontSize: 12, color: "grey" },
  priceBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  changeText: {
    color: "#5685FF",
    fontSize: 14,
    marginLeft: 8,
  },
  sectionBox: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "green",
  },
  spacebetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  deliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceDetails: {
    marginVertical: 16,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalContent: {
    marginTop: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    borderRadius: 10,
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#ccc",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});

export default ConfirmOrderScreen;
