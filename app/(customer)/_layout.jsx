import { View, Text, BackHandler } from "react-native";
import { Tabs, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect } from "react";
import TabBar from "../../components/TabBar";
import CustomNotifications from "../../components/common/customNotifications";
import useAuth from "../context/AuthContext";

export default function TabLayout() {
  const { socket } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const handleNotification = (data) => {
        CustomNotifications(data.title, data.message, {});
      };
      if (socket) {
        socket.on("notificationsModuleForCustomer", handleNotification);
        return () => {
          socket.off("notificationsModuleForCustomer", handleNotification);
        };
      }
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // tabBarActiveTintColor: Colors.PRIMARY,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          tabBarLabel: "Track Order",
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          tabBarLabel: "Payment",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
