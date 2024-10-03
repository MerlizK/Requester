import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import { APIURL } from "../Constants";
import Entypo from "@expo/vector-icons/Entypo";

const sampleRes = {
  canteenId: 0,
  username: "string",
  password: "string",
  shopName: "string",
  profilePicture: "string",
  tel: "string",
  shopNumber: "string",
};

const RegisterScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const payload = {
        ...sampleRes,
        profilePicture: base64Image,
      };
      const response = await axios.post(`${APIURL}shop/create-shop`, payload);
      if (response.status === 201) {
        const { token } = response.data;
        navigation.navigate("Home" as never);
      } else {
        Alert.alert("Login Failed", "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Login Error", "An error occurred during login");
    }
  };

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorCode);
        } else {
          const selectedImage = response.assets?.[0];
          setImageUri(selectedImage?.uri || null);
          setBase64Image(selectedImage?.base64 || null); // Save the Base64 string
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>สร้างร้านใหม่</Text>

      <View style={styles.formContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Username:</Text>
          <TextInput placeholder="Username" style={styles.input} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>ชื่อร้าน:</Text>
          <TextInput placeholder="Shop Name" style={styles.input} />
        </View>

        <TouchableOpacity
          style={styles.imageUploadContainer}
          onPress={handleImagePick}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Entypo
              style={{ marginTop: 10 }}
              name="chevron-small-down"
              size={48}
              color="black"
            />
          )}
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.label}>เบอร์โทรศัพท์:</Text>
          <TextInput placeholder="Phone Number" style={styles.input} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>โรงอาหาร:</Text>
          <TextInput placeholder="Canteen" style={styles.input} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>หมายเลขร้าน:</Text>
          <TextInput placeholder="Shop Number" style={styles.input} />
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>สร้างร้าน</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    color: "#000",
    left: 20,
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    alignSelf: "flex-start",
  },
  formContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    width: 100,
    fontSize: 16,
    color: "#000",
    marginRight: 10,
  },
  input: {
    color: "#000",
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  imageUploadContainer: {
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  registerButton: {
    width: "100%",
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

export default RegisterScreen;
