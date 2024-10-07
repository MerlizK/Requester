import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import Header from "../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import useOrderStore from "../OrderStore";

const SummaryMenuScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Accessing the order from the store
  const order = useOrderStore((state) => state.order);
  console.log("order", order);

  // Function to render each order item
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.restaurantItem} onPress={() => {}}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 48, height: 48 }}></View>
        <View style={{ gap: 8 }}>
          <Text style={styles.restaurantName}>{item.menuId}</Text>
          {/* Assuming menuId is the identifier */}
          <TouchableOpacity>
            <Text style={{ fontSize: 14, color: "#5685FF" }}>ดูรีวิว</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.restaurantStatus}>จำนวน: {item.quantity}</Text>
    </TouchableOpacity>
  );

  const handleConfirm = () => {
    // Logic to handle confirmation (e.g., reset order)
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, top: 0 }}>
      <Header
        title={"รายการสั่งซื้อ"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {order.orderItems.length > 0 ? (
          <FlatList
            data={order.orderItems}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.menuId.toString()} // Ensure keyExtractor is correct
          />
        ) : (
          <Text>รายการว่างเปล่า</Text>
        )}

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={[
                  styles.orderButton,
                  order.orderItems.length !== 0 && {
                    backgroundColor: "#2C2C2C",
                  },
                ]}
                onPress={() => navigation.navigate("ConfirmOrder" as never)}
              >
                <Text style={styles.buttonText}>สั่ง</Text>
              </TouchableOpacity>
            </View>

            {order.orderItems.length === 0 && (
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
                onPress={handleConfirm}
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

export default SummaryMenuScreen;
