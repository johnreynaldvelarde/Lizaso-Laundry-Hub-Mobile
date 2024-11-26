import { View, StyleSheet, BackHandler } from "react-native";
import { Tabs, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect } from "react";
import StaffTabBar from "../../components/staffTabBar";
import useAuth from "../context/AuthContext";
import CustomNotifications from "../../components/common/customNotifications";

export default function TabLayout() {
  const { socket } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const handleNotification = (data) => {
        CustomNotifications(data.title, data.message, {});
      };
      if (socket) {
        socket.on("notificationsModule", handleNotification);
        return () => {
          socket.off("notificationsModule", handleNotification);
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
    <View style={styles.container}>
      <Tabs
        tabBar={(props) => <StaffTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute", // Position it absolutely
            bottom: 0, // Keep it at the bottom
            zIndex: 1, // Lower z-index for the tab bar
            width: "100%", // Full width
          },
        }}
      >
        <Tabs.Screen
          name="pickup"
          options={{
            tabBarLabel: "Pickup",
            lazy: true,
          }}
        />
        <Tabs.Screen
          name="delivery"
          options={{
            tabBarLabel: "Delivery",
            lazy: true,
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            tabBarLabel: "Message",
            lazy: true,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            lazy: true,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// import { View, StyleSheet } from "react-native";
// import { Tabs } from "expo-router";
// import React from "react";
// import TabBar from "../../components/TabBar";

// export default function TabLayout() {
//   return (
//     <View style={styles.container}>
//       <Tabs
//         tabBar={(props) => <TabBar {...props} />}
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Tabs.Screen
//           name="pickup"
//           options={{
//             tabBarLabel: "Pickup",
//           }}
//         />
//         <Tabs.Screen
//           name="delivery"
//           options={{
//             tabBarLabel: "Delivery",
//           }}
//         />
//         <Tabs.Screen
//           name="history"
//           options={{
//             tabBarLabel: "History",
//           }}
//         />
//         <Tabs.Screen
//           name="profile"
//           options={{
//             tabBarLabel: "Profile",
//           }}
//         />
//       </Tabs>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// import { View, Text } from "react-native";
// import { Tabs } from "expo-router";
// import React from "react";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { Colors } from "../../constants/Colors";
// import TabBar from "../../components/TabBar";

// export default function TabLayout() {
//   return (
//     <Tabs
//       tabBar={(props) => <TabBar {...props} />}
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: Colors.PRIMARY,
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           tabBarLabel: "Home",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="home" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           tabBarLabel: "Explore",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="search" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="payment"
//         options={{
//           tabBarLabel: "Payment",
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="search" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           tabBarLabel: "Profile",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="account-circle" size={24} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
