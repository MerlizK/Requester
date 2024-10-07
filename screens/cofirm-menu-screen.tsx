import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import Header from "../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const ConfirmOrderScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("123 ถนน ที่อยู่");
  const [useGPS, setUseGPS] = useState(false);

  const navigation = useNavigation();

  const handleConfirmAddress = (gps: boolean) => {
    setUseGPS(gps);
    setDeliveryAddress(gps ? "ตามที่อยู่บนระบบ GPS" : "123 ถนน ที่อยู่");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <Text>ร้านที่1</Text>
          <Text>เมนูที่1 80.00 บาท</Text>
          <Text>จำนวน 2</Text>
          <Text>เพิ่มเติม: ไม่เอาเครื่องใน</Text>
        </View>

        <View style={styles.priceDetails}>
          <Text>ราคาอาหารรวม 80.00 บาท</Text>
          <Text>ราคาจัดส่ง 15.00 บาท</Text>
          <Text>ราคาทั้งหมด 95.00 บาท</Text>
        </View>

        <TouchableOpacity style={styles.confirmButton}>
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
    padding: 16,
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
