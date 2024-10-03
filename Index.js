import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/login-screen";
import RegisterScreen from "./screens/register-screen";
import HomeTabs from "./screens/home-screen/HomeScreen";
import CreateMenu from "./screens/home-screen/ShopCreateMenu";
import EditMenu from "./screens/home-screen/ShopEditMenu";
import AddOption from "./screens/home-screen/ShopCreateOption";
import EditOption from "./screens/home-screen/ShopEditOption";
import EditInfo from "./screens/home-screen/ShopEditInfo";
import History from "./screens/home-screen/ShopOrderHistory";
import HistoryScreen from "./screens/home-screen/profile-screen/history-screen";
import ProfileScreen from "./screens/home-screen/profile-screen/profile-screen";
import OrderList from "./screens/home-screen/order-screen/order-screen";
import SpecialTimeSetting from "./screens/home-screen/time-screen/time-screen";

const Stack = createNativeStackNavigator();

function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen name="OrderScreen" component={OrderList} />
        <Stack.Screen name="TimeScreen" component={SpecialTimeSetting} />
        <Stack.Screen name="CreateMenu" component={CreateMenu} />
        <Stack.Screen name="EditMenu" component={EditMenu} />
        <Stack.Screen name="AddOption" component={AddOption} />
        <Stack.Screen name="EditOption" component={EditOption} />
        <Stack.Screen name="EditInfo" component={EditInfo} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Index;
