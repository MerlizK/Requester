import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add AsyncStorage import
import AppLogo from "../assets/icons/app-logo.svg";
import ForgotPasswordModal from "../components/forgot-modal";
import LoadingScreen from "../components/loading";
import axios from "axios";
import { APIURL } from "../Constants";
import useShopStore from "../ShopStore";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { setToken } = useShopStore();

  // const handleLogin = async () => {
  //   setIsLoading(true);
  //   try {
  //     const requestBody = {
  //       username,
  //       password,
  //     };
  //     const response = await axios.post(`${APIURL}shop/login`, requestBody, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.status === 201) {
  //       const { token } = response.data;

  //       await AsyncStorage.setItem("authToken", token);

  //       setToken(token);
  //       console.log("token ", token);

  //       navigation.navigate("Home" as never);
  //     } else {
  //       Alert.alert("Login Failed", "Invalid username or password");
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     Alert.alert("Login Error", "An error occurred during login");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleLogin = () => {
    navigation.navigate("SelectShop" as never);
  };
  const handleRegister = () => {
    navigation.navigate("Register" as never);
  };

  const openForgotPasswordModal = () => {
    setModalVisible(true);
  };

  const closeForgotPasswordModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <AppLogo width={274} height={100} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
        {/* 
        <TouchableOpacity onPress={openForgotPasswordModal}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity> */}
      </View>

      <ForgotPasswordModal
        visible={isModalVisible}
        onClose={closeForgotPasswordModal}
      />

      <LoadingScreen visible={isLoading} />
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "90%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    color: "#000",
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#DFF5E2",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  registerButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#000",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
