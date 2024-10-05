import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import CustomCheckboxPrice from "../components/checkbox-price";

const DetailMenuScreen = ({ menuId }: { menuId: string }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: number[];
  }>({});
  const navigation = useNavigation();

  const menuData = {
    price: 30,
    description:
      "คุณยายกินลำไย น้ำลายยายไหลฮ้อย เฒ่าผาดผัดฟัก เยียฟาดฟักผัด กินมันติดเหงือก กินเผือกติดฟัน",
    image: "https://example.com/your-food-image.jpg",
    options: [
      {
        id: 1,
        name: "Option1",
        minSelect: 1,
        maxSelect: 1,
        required: true,
        subOptions: [
          { id: 1, name: "เอเอเอ", price: 10 },
          { id: 2, name: "บีบีบี", price: 10 },
          { id: 3, name: "ซีซีซี", price: 10 },
        ],
      },
      {
        id: 2,
        name: "Option2",
        minSelect: 1,
        maxSelect: 2,
        required: false,
        subOptions: [
          { id: 1, name: "aaa", price: 20 },
          { id: 2, name: "bbb", price: 10 },
          { id: 3, name: "ccc", price: 20 },
        ],
      },
    ],
  };

  const handleSelectOption = (optionId: number, subOptionId: number) => {
    setSelectedOptions((prevSelected) => {
      const selected = prevSelected[optionId] || [];
      if (selected.includes(subOptionId)) {
        return {
          ...prevSelected,
          [optionId]: selected.filter((id) => id !== subOptionId),
        };
      }
      if (
        selected.length <
        menuData.options.find((o) => o.id === optionId)?.maxSelect!
      ) {
        return { ...prevSelected, [optionId]: [...selected, subOptionId] };
      }
      return prevSelected;
    });
  };

  const calculateTotalPrice = () => {
    let optionPrice = 0;
    for (const optionId in selectedOptions) {
      const option = menuData.options.find(
        (opt) => opt.id === parseInt(optionId)
      );
      if (option) {
        optionPrice += selectedOptions[optionId].reduce((sum, subOptionId) => {
          const subOption = option.subOptions.find(
            (so) => so.id === subOptionId
          );
          return sum + (subOption ? subOption.price : 0);
        }, 0);
      }
    }
    return (menuData.price + optionPrice) * quantity;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", top: 0 }}>
      <Header
        title={"เมนูที่ 1"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <Image source={{ uri: menuData.image }} style={styles.foodImage} />
        <Text style={styles.descriptionTitle}>คำอธิบาย:</Text>
        <Text style={styles.description}>{menuData.description}</Text>

        {menuData.options.map((option) => (
          <View key={option.id}>
            <Text style={styles.optionTitle}>{option.name}</Text>
            {option.subOptions.map((subOption) => (
              <CustomCheckboxPrice
                key={subOption.id}
                label={subOption.name}
                price={"+ " + subOption.price.toString()}
                checked={
                  selectedOptions[option.id]?.includes(subOption.id) || false
                }
                onPress={() => handleSelectOption(option.id, subOption.id)}
              />
            ))}
          </View>
        ))}

        <Text style={styles.additionalTitle}>เพิ่มเติม:</Text>
        <TextInput
          style={styles.additionalInput}
          placeholder="ไม่เอาเครื่องใน"
        />
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton}>
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
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  quantityContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default DetailMenuScreen;
