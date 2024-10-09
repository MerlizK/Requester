import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Header from "../components/header";
import { RouteProp, useNavigation } from "@react-navigation/native";
import CustomCheckboxPrice from "../components/checkbox-price";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import useOrderStore from "../OrderStore"; // Ensure this imports correctly
import { APIURL, HeadersToken } from "../Constants";

interface OptionItem {
  optionItemId: number;
  name: string;
  price: number;
}

interface Option {
  optionId: number;
  name: string;
  mustChoose: boolean;
  maxChoose: number;
  minChoose: number;
  optionItem: OptionItem[];
}

interface MenuData {
  menuId: number;
  name: string;
  price: number;
  picture: string;
  description: string;
  status: boolean;
  option: Option[];
}

type RootStackParamList = {
  DetailMenu: { menuId: number };
  SummaryMenu: undefined;
  SelectMenu: { shopId: number };
};

type Props = {
  route: RouteProp<RootStackParamList, "DetailMenu">; // Route prop type
};

const DetailMenuScreen = ({ route }: Props) => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: number[];
  }>({});
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  const { menuId } = route.params;
  const numericMenuId = Number(menuId);
  const addOrderItem = useOrderStore((state) => state.addOrderItem);
  const navigation = useNavigation();
  const order = useOrderStore((state) => state.order);
  const fetchMenuData = async () => {
    try {
      const response = await axios.get(`${APIURL}shop/menu/info`, {
        params: { menuId: menuId },
        ...HeadersToken,
      });
      setMenuData(response.data);
    } catch (error) {
      console.error("Error fetching menu details", error);
    }
  };
  useEffect(() => {
    fetchMenuData();
  }, [menuId]);

  const handleSelectOption = (optionId: number, optionItemId: number) => {
    setSelectedOptions((prevSelected) => {
      const selected = prevSelected[optionId] || [];
      if (selected.includes(optionItemId)) {
        return {
          ...prevSelected,
          [optionId]: selected.filter((id) => id !== optionItemId),
        };
      }
      const maxChoose =
        menuData?.option.find((opt) => opt.optionId === optionId)?.maxChoose ||
        1;
      if (selected.length < maxChoose) {
        return { ...prevSelected, [optionId]: [...selected, optionItemId] };
      }
      return prevSelected;
    });
  };

  const calculateTotalPrice = () => {
    let optionPrice = 0;
    if (menuData) {
      for (const optionId in selectedOptions) {
        const option = menuData.option.find(
          (opt) => opt.optionId === parseInt(optionId)
        );
        if (option) {
          optionPrice += selectedOptions[optionId].reduce(
            (sum, optionItemId) => {
              const optionItem = option.optionItem.find(
                (item) => item.optionItemId === optionItemId
              );
              return sum + (optionItem ? optionItem.price : 0);
            },
            0
          );
        }
      }
      return (menuData.price + optionPrice) * quantity;
    }
    return 0;
  };

  const handleAddToCart = () => {
    const orderItemExtras = Object.keys(selectedOptions).flatMap((optionId) =>
      selectedOptions[optionId].map((optionItemId) => ({
        optionItemId: optionItemId,
        selected: true,
      }))
    );

    const orderItem = {
      shopId: 1,
      quantity: quantity,
      totalPrice: calculateTotalPrice(),
      specialInstructions: specialInstructions,
      menuId: numericMenuId,
      orderItemExtras: orderItemExtras,
      picture: menuData?.picture || "",
      name: menuData?.name || "",
      orderId: (order.orderItems.length + 1).toString(),
    };
    addOrderItem(orderItem);

    // Optionally, you can update the order details as well here
    // updateOrderDetails({ /* details */ });

    // Navigate back to the previous page
    navigation.goBack();
  };

  if (!menuData) {
    return <Text>Loading...</Text>; // Show loading state until the data is fetched
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", top: 0 }}>
      <Header
        title={menuData.name}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <Image source={{ uri: menuData.picture }} style={styles.foodImage} />
        <Text style={styles.descriptionTitle}>คำอธิบาย:</Text>
        <Text style={styles.description}>{menuData.description}</Text>
        <View>
          <Text style={styles.optionTitle}>{menuData.name}</Text>
          <CustomCheckboxPrice
            label={"ราคาเริ่มต้น"}
            price={menuData.price.toFixed(2) + " บาท"}
            checked={true}
            onPress={() => {}}
          />
        </View>
        {menuData.option.map((option) => (
          <View key={option.optionId}>
            <Text style={styles.optionTitle}>{option.name}</Text>
            {option.optionItem.map((optionItem) => (
              <CustomCheckboxPrice
                key={optionItem.optionItemId}
                label={optionItem.name}
                price={"+ " + optionItem.price.toFixed(2) + " บาท"}
                checked={
                  selectedOptions[option.optionId]?.includes(
                    optionItem.optionItemId
                  ) || false
                }
                onPress={() =>
                  handleSelectOption(option.optionId, optionItem.optionItemId)
                }
              />
            ))}
          </View>
        ))}

        <Text style={styles.additionalTitle}>เพิ่มเติม:</Text>
        <TextInput
          style={styles.additionalInput}
          placeholder="รายละเอียดเพิ่มเติม"
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          multiline={true}
          textAlignVertical="top"
        />
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            <Entypo name="circle-with-minus" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.quantityButton}
          >
            <Entypo name="circle-with-plus" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>
            ใส่ตะกร้า ({calculateTotalPrice().toFixed(2)} บาท)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 32,
    backgroundColor: "#fff",
    marginBottom: 90,
  },
  foodImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  additionalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  additionalInput: {
    backgroundColor: "#f0f0f0",
    height: 120,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 16,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityButton: {},
  quantityText: {
    fontSize: 18,
  },
  addToCartButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 18,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
  },
});

export default DetailMenuScreen;
