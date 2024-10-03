import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  RefreshControl,
} from "react-native";
import Header from "../../../components/header";
import Entypo from "@expo/vector-icons/Entypo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APIURL } from "../../../Constants";
import useShopStore from "../../../ShopStore";
import LoadingScreen from "../../../components/loading";
import { useFocusEffect } from "@react-navigation/native";

type OrderItemExtraType = {
  OrderItemExtraId: number;
  optionItem: {
    optionItemId: number;
    name: string;
    price: number;
  };
};

type OrderItemType = {
  orderItemId: number;
  quantity: number;
  totalPrice: number;
  specialInstructions: string;
  menu: {
    name: string;
    price: number;
  };
  orderItemExtra?: OrderItemExtraType[];
};

type OrderType = {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  orderItem: OrderItemType[];
};

type OrderItemProps = {
  orderNumber: string;
  orderItems: OrderItemType[];
  orderId: number;
  fetchMenuData: () => Promise<void>;
};

const OrderItem: React.FC<OrderItemProps> = ({
  orderNumber,
  orderItems,
  orderId,
  fetchMenuData,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const updateItemStatus = async (orderId: number) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.patch(
        `${APIURL}shop/order/update-status`,
        { orderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsModalVisible(false);
      await fetchMenuData();
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };

  return (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Entypo name="location-pin" size={24} color="black" />
          <Text style={styles.orderText}>ออเดอร์ที่ {orderNumber}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            ค่าอาหาร:{" "}
            {orderItems.reduce((acc, item) => acc + item.totalPrice, 0)} บาท
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            {!expanded ? (
              <Entypo name="chevron-small-right" size={28} color="black" />
            ) : (
              <Entypo name="chevron-small-down" size={28} color="black" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {expanded && (
        <View style={styles.orderDetails}>
          {orderItems.map((item, index) => (
            <View key={index}>
              <View style={styles.orderDes}>
                <Text style={styles.menuText}>{item.menu.name}</Text>
                <Text style={[styles.menuText, { fontWeight: "400" }]}>
                  ราคา: {item.totalPrice} บาท
                </Text>
              </View>

              <View style={styles.orderDes}>
                <Text style={styles.subText}>จำนวนที่สั่ง</Text>
                <Text style={styles.subText}>{item.quantity}</Text>
              </View>

              {item.orderItemExtra && item.orderItemExtra.length > 0 && (
                <View style={styles.orderDes}>
                  <Text style={styles.subText}>เพิ่มเติม:</Text>
                  <Text style={styles.subText}>
                    {item.orderItemExtra
                      .map(
                        (extra) =>
                          `${extra.optionItem.name} +${extra.optionItem.price} บาท`
                      )
                      .join(", ")}
                  </Text>
                </View>
              )}
              {item.specialInstructions && (
                <View style={styles.orderDes}>
                  <Text style={styles.subText}>หมายเหตุ:</Text>
                  <Text style={styles.subText}>{item.specialInstructions}</Text>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.buttonText}>ทำอาหารเสร็จแล้ว</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>ยืนยันการทำอาหารเสร็จสิ้น?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => updateItemStatus(orderId)}
              >
                <Text style={styles.buttonText}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const OrderList = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { shopData, fetchShopData } = useShopStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMenuData();
    setRefreshing(false);
  };

  const fetchMenuData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${APIURL}shop/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
      await fetchShopData(token);

      const retryFetchShopStatus = () => {
        if (shopData && shopData.status) {
          setIsOpen(shopData.status);
        } else {
          setTimeout(() => {
            fetchMenuData();
          }, 100);
        }
      };
      retryFetchShopStatus();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const updateShopStatus = async (status: boolean) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      await axios.patch(
        `${APIURL}shop/update-status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsOpen(status);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };

  return (
    <>
      <Header title="รายการออเดอร์" showBackButton={false} />
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>สถานะร้าน:</Text>
        <TouchableOpacity
          style={[
            styles.statusButton,
            isOpen ? styles.openButton : styles.closedButton,
          ]}
          onPress={() => {
            updateShopStatus(!isOpen);
          }}
        >
          <Text style={styles.buttonText}>
            {isOpen ? "เปิดรับออเดอร์" : "ปิดรับออเดอร์"}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem
              key={order.orderId}
              orderNumber={order.orderId.toString()}
              orderItems={order.orderItem}
              orderId={order.orderId}
              fetchMenuData={fetchMenuData}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ยังไม่มีออเดอร์</Text>
          </View>
        )}
      </ScrollView>
      <LoadingScreen visible={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 32,
    backgroundColor: "#fff",
    marginVertical: 16,
  },
  orderContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderInfo: {
    maxWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
  },
  orderDes: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  orderText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  emptyText: {
    color: "#f0f0f0",
    fontSize: 32,
    fontWeight: "300",
    marginLeft: 8,
  },
  priceContainer: {
    backgroundColor: "white",
    maxWidth: "55%",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  priceText: {
    fontSize: 14,
    marginRight: 8,
  },
  orderDetails: {
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  menuText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 2,
  },
  button: {
    alignSelf: "flex-end",
    right: -16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  openButton: {
    backgroundColor: "green",
  },
  closedButton: {
    backgroundColor: "red",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#00c853",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 24,
  },
});

export default OrderList;
