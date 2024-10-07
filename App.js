import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // Import Stack Navigator
import LoginScreen from "./screens/login-screen";
import RegisterScreen from "./screens/register-screen";
import SelectShopScreen from "./screens/select-shop-screen";
import SelectMenuScreen from "./screens/select-menu-screen";
import SummaryMenuScreen from "./screens/summary-menu-screen";
import DetailMenuScreen from "./screens/detail-menu-screen";
import ConfirmOrderScreen from "./screens/cofirm-menu-screen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        StyleSheet={StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          },
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="SelectShop" component={SelectShopScreen} />
        <Stack.Screen name="SelectMenu" component={SelectMenuScreen} />
        <Stack.Screen name="SummaryMenu" component={SummaryMenuScreen} />
        <Stack.Screen name="DetailMenu" component={DetailMenuScreen} />
        <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
