import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Image,
  RefreshControl,
} from "react-native";
import axios from "axios";
import MenuModal from "./menu-modal";
import Entypo from "@expo/vector-icons/Entypo";
import { APIURL } from "../../../Constants";
import useShopStore from "../../../ShopStore";
import { HeadersToken } from "../../../Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import LoadingScreen from "../../../components/loading";

interface Option {
  name: string;
  optionId: string;
  require: boolean;
  numberMinMax: [number, number];
  subOption: SubOption[];
}

interface SubOption {
  name: string;
  price: string;
}

interface MenuItem {
  name: string;
  menuId: number;
  price: number;
  picture?: string;
  description?: string;
  status: boolean;
  option?: Option[];
  shopId?: number;
}

const ShopMenuComponent = () => {
  const [data, setData] = useState<{ isOpen: boolean; data: MenuItem[] }>({
    isOpen: true,
    data: [],
  });
  const [menus, setMenus] = useState<MenuItem[]>([]);

  const [isOpen, setIsOpen] = useState(data.isOpen);
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<MenuItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<null | "save" | "delete">(
    "save"
  );
  const [price, setPrice] = useState<number>(0);
  const [options, setOptions] = useState<Option[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [shopName, setShopName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { shopData, fetchShopData } = useShopStore();

  useEffect(() => {
    fetchMenuData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMenuData();
    }, [])
  );

  const fetchMenuData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${APIURL}shop/menu`,
        HeadersToken(token)
      );
      setData(response.data as any);
      setMenus(response.data as unknown as MenuItem[]);
      fetchShopData(token);
      setShopName(shopData.shopName);
      console.log("shopData.status", shopData.status);
      setIsOpen(shopData.status);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMenuData();
    setRefreshing(false);
  };

  const createMenu = async (payload: {
    name: string;
    picture: string;
    price: number;
    description: string;
  }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.post(
        `${APIURL}shop/create-menu`,
        payload,
        HeadersToken(token)
      );
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  const editMenu = async (payload: {
    menuId: number;
    name: string;
    picture?: string;
    price: number;
    description?: string;
    status: boolean;
    option: Option;
  }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.patch(
        `${APIURL}shop/edit-menu`,
        payload,
        HeadersToken(token)
      );
      fetchMenuData();
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  const deleteMenu = async (menuId: number) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.delete(`${APIURL}shop/delete-menu`, {
        params: { menuId },
        ...HeadersToken(token),
      });
      console.log("Menu deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

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
  const updateMenuStatus = async (menuId: number) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.patch(
        `${APIURL}shop/menu/update-status`,
        { menuId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleRefresh();
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };

  const openAddMenuModal = () => {
    setIsOption(false);
    setCurrentMenu(null);
    setPrice(0);
    setOptions([]);
    setImage(null);
    setDescription("");
    setIsAddMenuVisible(true);
    console.log(currentMenu);
  };
  const openEditMenuModal = async (menu: MenuItem) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${APIURL}shop/menu/info`, {
        params: { menuId: menu.menuId },
        ...HeadersToken(token),
      });

      console.log("Response data:", response.data);

      setCurrentMenu(menu);
      setPrice(menu.price || 0);
      setOptions(formatToResponse(response.data.option) || []);
      setImage(menu.picture || "");
      setDescription(menu.description || "");
      setIsOption(false);
      setIsAddMenuVisible(true);
    } catch (error) {
      console.error("Error fetching option:", error);
    }
  };

  const handleSave = () => {
    setConfirmAction("save");
    setIsConfirmModalVisible(true);
  };

  const handleDelete = (menuId: number) => {
    setCurrentMenu(menus.find((menu) => menu.menuId === menuId) || null);
    setConfirmAction("delete");
    setIsConfirmModalVisible(true);
  };
  const formatToRequest = (optionData: Option[]) => {
    if (!Array.isArray(optionData)) {
      throw new TypeError("optionData must be an array");
    }

    return optionData.map((option: Option) => {
      if (!option || typeof option !== "object") {
        throw new TypeError("Invalid option object");
      }

      const [minChoose, maxChoose] = Array.isArray(option.numberMinMax)
        ? option.numberMinMax
        : [0, 0];

      return {
        name: option.name || "Default Name",
        mustChoose: option.require || false,
        maxChoose: maxChoose,
        minChoose: minChoose,
        optionItems: Array.isArray(option.subOption)
          ? option.subOption.map((sub: SubOption) => ({
              name: sub.name || "Default SubOption",
              price: sub.price ? Number(sub.price) : 0,
            }))
          : [],
      };
    });
  };

  function formatToResponse(options: any[]): Option[] {
    return options.map((option, index) => ({
      name: option.name,
      optionId: index.toString(),
      require: option.mustChoose || false,
      numberMinMax: [option.minChoose || 0, option.maxChoose || 0],
      subOption: Array.isArray(option.optionItem)
        ? option.optionItem.map((item: any) => ({
            name: item.name || "Default Name",
            price: item.price ? item.price.toString() : "0",
          }))
        : [],
    }));
  }

  const confirmActionHandler = () => {
    if (confirmAction === "save") {
      if (currentMenu && currentMenu.menuId) {
        const payload = {
          menuId: currentMenu.menuId,
          name: currentMenu.name,
          picture: image,
          price: price,
          description: description,
          status: currentMenu.status,
          option: formatToRequest(options),
        };
        console.log("payload ", payload);
        editMenu(payload);
      } else {
        const payload = {
          name: currentMenu?.name || "",
          picture: image || "",
          price: price || 0,
          description: description || "",
          option: formatToRequest(options) || [],
        };
        console.log("payload ", payload);
        createMenu(payload);
      }
    } else if (confirmAction === "delete") {
      deleteMenu(currentMenu.menuId);
    }
    fetchMenuData();
    setIsAddMenuVisible(false);
    setIsConfirmModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.shopName}>{shopName}</Text>
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>สถานะร้าน:</Text>
        <TouchableOpacity
          style={[
            styles.statusButton,
            isOpen ? styles.openButton : styles.closedButton,
          ]}
          onPress={() => updateShopStatus(!isOpen)}
        >
          <Text style={styles.buttonText}>
            {isOpen ? "เปิดรับออเดอร์" : "ปิดรับออเดอร์"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={styles.menuList}
      >
        {menus &&
          menus.map((menu) => (
            <View key={menu.menuId} style={styles.menuItem}>
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text style={styles.menuName}>{menu.name}</Text>
                <Text style={styles.menuPrice}>{menu.price}</Text>
              </View>
              {menu.picture && (
                <Image
                  source={{ uri: `${menu.picture}` }}
                  style={styles.menuImage}
                />
              )}

              <TouchableOpacity
                style={[
                  styles.statusButton,
                  menu.status ? styles.statusAvailable : styles.statusSoldOut,
                ]}
                onPress={() => updateMenuStatus(menu.menuId)}
              >
                <Text style={styles.statusButtonText}>
                  {menu.status ? "ขาย" : "ไม่ขาย"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => {
                  openEditMenuModal(menu);
                }}
              >
                <Entypo
                  style={{ marginTop: 10 }}
                  name="cog"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: -10,
          flexDirection: "row",
          gap: 20,
        }}
      >
        <TouchableOpacity style={styles.addButton} onPress={openAddMenuModal}>
          <Text style={styles.addButtonText}>เพิ่มเมนู</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isConfirmModalVisible}
        animationType="fade"
        onRequestClose={() => setIsConfirmModalVisible(false)}
      >
        <View style={styles.confirmModalContent}>
          <Text style={styles.description}>
            ยืนยันการ {confirmAction === "save" ? "บันทึก" : "ลบ"}?
          </Text>
          <View style={styles.confirmButtonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsConfirmModalVisible(false)}
            >
              <Text>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmActionHandler}
            >
              <Text>ยืนยัน</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MenuModal
        isVisible={isAddMenuVisible}
        onClose={() => setIsAddMenuVisible(false)}
        menu={currentMenu}
        price={price}
        options={options}
        picture={image}
        description={description}
        isOption={isOption}
        setIsOption={setIsOption}
        setDescription={setDescription}
        setMenu={setCurrentMenu}
        setPrice={setPrice}
        setOptions={setOptions}
        setPicture={setImage}
        onSave={handleSave}
        onDelete={() => handleDelete(currentMenu?.menuId || 0)}
      />
      <LoadingScreen visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    width: "100%",
    gap: 20,
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  description: { color: "#000", fontSize: 16 },
  shopName: {
    color: "#000",
    marginTop: 70,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  openButton: {
    backgroundColor: "green",
  },
  closedButton: {
    backgroundColor: "red",
  },
  menuList: {
    flex: 1,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  menuName: {
    color: "#000",
    fontSize: 18,
  },
  menuPrice: {
    color: "#000",
    fontSize: 16,
  },
  menuImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
    flex: 1,
  },
  statusAvailable: {
    backgroundColor: "green",
  },
  statusSoldOut: {
    backgroundColor: "red",
  },
  settingsButton: {
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 20,
    maxWidth: 220,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  confirmButtonRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    padding: 10,
    margin: 10,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 10,
    margin: 10,
  },
});

export default ShopMenuComponent;
