import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Header from "../../../components/header";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { APIURL } from "../../../Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeadersToken } from "../../../Utils";

type ProfileData = {
  username: string;
  password: string;
  shopName: string;
  phoneNumber: string;
  canteen: string;
  shopNumber: string;
  profileImage: string;
};

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [data, setData] = React.useState<ProfileData>({
    username: "",
    password: "",
    shopName: "",
    phoneNumber: "",
    canteen: "",
    shopNumber: "",
    profileImage: "",
  });
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        const response = await axios.get(
          `${APIURL}shop/info`,
          HeadersToken(token)
        );
        const shopData = response.data;
        setData({
          username: shopData.username,
          password: shopData.password,
          shopName: shopData.shopName,
          phoneNumber: shopData.tel,
          canteen: shopData.canteenId.toString(),
          shopNumber: shopData.shopNumber,
          profileImage: shopData.profilePicture,
        });
      } catch (error) {
        console.error("Error fetching shop info:", error);
        Alert.alert("Error", "Failed to fetch shop information");
      }
    };

    fetchShopInfo();
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleNavigateToHistory = () => {
    navigation.navigate("HistoryScreen");
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Error", "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setData((prevData) => ({
        ...prevData,
        profileImage: result.assets[0].base64 || "",
      }));
    }
  };

  const handleSave = async () => {
    if (data.password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const payload = {
      canteenId: parseInt(data.canteen),
      username: data.username,
      password: data.password,
      shopName: data.shopName,
      profilePicture: data.profileImage,
      tel: data.phoneNumber,
      shopNumber: data.shopNumber,
    };

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.patch(
        `${APIURL}shop/update-info`,
        payload,
        HeadersToken(token)
      );
      if (response.status === 200) {
        Alert.alert("Success", "Shop information updated successfully");
        setIsEditing(false);
      } else {
        Alert.alert("Error", "Failed to update shop information");
      }
    } catch (error) {
      console.error("Error updating shop info:", error);
      Alert.alert("Error", "Failed to update shop information");
    }
  };

  return (
    <>
      <Header
        title={!isEditing ? "ข้อมูลร้าน" : "แก้ไขข้อมูล"}
        showBackButton={isEditing}
        onBackPress={() => setIsEditing(false)}
      />
      <ScrollView style={styles.container}>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={isEditing ? handleImagePick : undefined}>
            {data.profileImage ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${data.profileImage}` }}
                style={styles.userIcon}
              />
            ) : (
              <Image
                source={{ uri: "https://example.com/user-icon.png" }}
                style={styles.userIcon}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.formWrapper}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Username:</Text>
            {!isEditing ? (
              <Text style={styles.description}>{data.username}</Text>
            ) : (
              <TextInput
                style={styles.input}
                value={data.username}
                onChangeText={(value) => handleInputChange("username", value)}
              />
            )}
          </View>

          {isEditing && (
            <>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={data.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Confirm Password:</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(value) => setConfirmPassword(value)}
                />
              </View>
            </>
          )}

          <View style={styles.inputRow}>
            <Text style={styles.label}>ชื่อร้าน:</Text>
            {!isEditing ? (
              <Text style={styles.description}>{data.shopName}</Text>
            ) : (
              <TextInput
                style={styles.input}
                value={data.shopName}
                onChangeText={(value) => handleInputChange("shopName", value)}
              />
            )}
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>เบอร์โทรศัพท์:</Text>
            {!isEditing ? (
              <Text style={styles.description}>{data.phoneNumber}</Text>
            ) : (
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={data.phoneNumber}
                onChangeText={(value) =>
                  handleInputChange("phoneNumber", value)
                }
              />
            )}
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>โรงอาหาร:</Text>
            {!isEditing ? (
              <Text style={styles.description}>{data.canteen}</Text>
            ) : (
              <TextInput
                style={styles.input}
                value={data.canteen}
                onChangeText={(value) => handleInputChange("canteen", value)}
              />
            )}
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>หมายเลขร้าน:</Text>
            {!isEditing ? (
              <Text style={styles.description}>{data.shopNumber}</Text>
            ) : (
              <TextInput
                style={styles.input}
                value={data.shopNumber}
                onChangeText={(value) => handleInputChange("shopNumber", value)}
              />
            )}
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.registerButtonText}>แก้ไขข้อมูล</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleSave}
              >
                <Text style={styles.registerButtonText}>
                  ยืนยันการแก้ไขข้อมูล
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {!isEditing && (
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleNavigateToHistory}
          >
            <Text style={styles.registerButtonText}>ประวัติการทำอาหาร</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  iconWrapper: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  userIcon: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#EAEAF5",
  },
  formWrapper: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    color: "#000",
    fontSize: 16,
    width: 120,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  description: {
    color: "#000",
  },
  registerButton: {
    maxWidth: 220,
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
