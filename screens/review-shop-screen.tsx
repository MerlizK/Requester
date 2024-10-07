import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import Header from "../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const ReviewShopScreen = ({ shopId }: { shopId: string }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const restaurants = [
    {
      id: "1",
      name: "กุ๊กไก่ ไฉไล",
      description: "เผ็ดมากๆๆๆๆๆๆๆๆๆๆ",
      score: "3",
    },
    {
      id: "2",
      name: "ขอเถอะ ขอนะ",
      description: "กำลังดี ไม่หวานเกินไป",
      score: "4",
    },
    {
      id: "3",
      name: "พรี่เก่ง พลังช้าง",
      description:
        "บางเมนูก็ก็ลังดีบางเมนูก็ไม่ดีแต่โดยแล้วรสชาติโดนใจแต่อาจจะขาด ๆ เกิน ๆ ไปบ้าง",
      score: "5",
    },
  ];

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity style={styles.restaurantItem} onPress={() => {}}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 48, height: 48 }}></View>
        <View style={{ gap: 8 }}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 14, color: "#5685FF" }}>ดูรีวิว</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.restaurantStatus, !item.status && { color: "red" }]}>
        {item.status ? "เปิด" : "ปิด"}
      </Text>
    </TouchableOpacity>
  );

  const handleConfirm = () => {
    setModalVisible(false);
  };
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, top: 0 }}>
      <Header
        title={"รายการสั่งซื้อ"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {restaurants ? (
          <FlatList
            data={restaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
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
                  numberOfOrders !== 0 && { backgroundColor: "#2C2C2C" },
                ]}
              >
                <Text style={styles.buttonText}>สั่ง</Text>
              </TouchableOpacity>
            </View>

            {numberOfOrders === 0 && (
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

export default ReviewShopScreen;
