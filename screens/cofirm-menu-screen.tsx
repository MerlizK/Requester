import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert, // Import Alert for confirmation dialog
} from "react-native";
import Header from "../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import useOrderStore from "../OrderStore";
import axios from "axios";
import { APIURL, HeadersToken } from "../Constants";

const ConfirmOrderScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("123 ถนน ที่อยู่");
  const [useGPS, setUseGPS] = useState(false);
  const navigation = useNavigation();

  const order = useOrderStore((state) => state.order);
  const sendOrderPayload = useOrderStore((state) => state.sendOrderPayload);
  const updateOrderDetails = useOrderStore((state) => state.updateOrderDetails);
  const clearOrder = useOrderStore((state) => state.clearOrder);
  const handleConfirmAddress = (gps: boolean) => {
    setUseGPS(gps);
    setDeliveryAddress(gps ? "ตามที่อยู่บนระบบ GPS" : "123 ถนน ที่อยู่");
    setModalVisible(false);
  };

  const handleConfirmOrder = async () => {
    updateOrderDetails({
      addressId: 2,
      transactionType: "Debit-card",
      totalPrice: 60,
      shippingFee: 10,
      amount: 70,
    });
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
      navigation.navigate("SelectShop" as never);
    } catch (error) {
      console.error(
        "Order submission error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title={"ยืนยันการสั่งซื้อ"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <View style={styles.orderDetails}>
          <Text style={styles.headerText}>สั่งจาก</Text>
          <Text>โรงอาหารคณะวิศวกรรมศาสตร์ (บางวิทยา)</Text>

          <View style={styles.deliveryRow}>
            <Text style={styles.headerText}>ตำแหน่งจัดส่ง</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.changeText}>เปลี่ยน</Text>
            </TouchableOpacity>
          </View>
          <Text>{useGPS ? "ตามที่อยู่บนระบบ GPS" : deliveryAddress}</Text>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.headerText}>รายการที่สั่ง</Text>
          {order.orderItems.map((item, index) => (
            <View key={index}>
              <Text>{item.name}</Text>
              <Text>{`ราคา: ${item.totalPrice.toFixed(2)} บาท`}</Text>
              <Text>{`จำนวน: ${item.quantity}`}</Text>
              {item.specialInstructions && (
                <Text>{`เพิ่มเติม: ${item.specialInstructions}`}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.priceDetails}>
          <Text>ราคาอาหารรวม {order.totalPrice.toFixed(2)} บาท</Text>
          <Text>ราคาจัดส่ง {order.shippingFee.toFixed(2)} บาท</Text>
          <Text>ราคาทั้งหมด {order.amount.toFixed(2)} บาท</Text>
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
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>เลือกตำแหน่งจัดส่ง</Text>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleConfirmAddress(true)}
              >
                <Entypo name="location-pin" size={24} color="black" />
                <Text>ตามที่อยู่บนระบบ GPS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleConfirmAddress(false)}
              >
                <Entypo name="home" size={24} color="black" />
                <Text>ตามที่อยู่เริ่มต้น</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelButton}
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
  orderDetails: {
    marginVertical: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  changeText: {
    color: "#5685FF",
    fontSize: 14,
    marginLeft: 8,
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
