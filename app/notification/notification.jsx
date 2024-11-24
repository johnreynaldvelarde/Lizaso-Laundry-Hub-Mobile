// import React, { useCallback, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { useFocusEffect, useNavigation } from "expo-router";
// import COLORS from "../../constants/colors";
// import { Ionicons } from "@expo/vector-icons";
// import { fonts } from "../../constants/fonts";
// import { LinearGradient } from "expo-linear-gradient";
// import { getNotification } from "../../data/api/getApi";
// import useAuth from "../context/AuthContext";
// import usePolling from "../../hooks/usePolling";
// import noNotification from "../../assets/images/no_data_table.jpg";
// import { formatTimeNotification, iconMapping } from "../../constants/method";
// import * as Notifications from "expo-notifications";
// import { useNotifications } from "../../hooks/useNotifications";

// export default function Notification() {
//   const { userDetails } = useAuth();
//   const route = useRoute();
//   const navigation = useNavigation();
//   const [notifications, setNotifications] = useState([]);
//   const { schedulePushNotification } = useNotifications();

//   const fetchNotification = useCallback(async () => {
//     try {
//       let response;
//       if (userDetails.user_type === "Customer") {
//         response = await getNotification(userDetails.userId, "Customer");
//       } else {
//         response = await getNotification(userDetails.storeId, "Staff");
//       }

//       return response.data;
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   }, [userDetails.userId, userDetails.user_type]);

//   const {
//     data: notification,
//     loading,
//     error,
//     setIsPolling,
//   } = usePolling(fetchNotification, 10000);

//   useFocusEffect(
//     useCallback(() => {
//       setIsPolling(true);

//       return () => {
//         setIsPolling(false);
//       };
//     }, [])
//   );

//   const clearNotifications = () => {
//     // setNotifications([]);
//   };

//   const handleSampleNotificationsShow = async () => {
//     await schedulePushNotification();
//   };

//   const renderNotification = ({ item }) => {
//     const iconName =
//       iconMapping[item.notification_type] || "notifications-outline";

//     return (
//       <TouchableOpacity onPress={() => console.log("Notification clicked!")}>
//         <View style={styles.notificationItem}>
//           {/* Left Icon */}
//           <View style={styles.iconContainer}>
//             <Ionicons name={iconName} size={25} color={COLORS.subtitle} />
//           </View>

//           {/* Stage, Message and Time */}
//           <View style={styles.textContainer}>
//             <View style={styles.topContainer}>
//               <Text style={styles.notificationstage}>
//                 {item.notification_type}
//               </Text>
//               <Text style={styles.notificationTime}>
//                 {formatTimeNotification(item.created_at || "")}
//               </Text>
//             </View>
//             <Text style={styles.notificationMessage}>
//               {item.notification_description}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={["#5787C8", "#71C7DA"]}
//         locations={[0, 0.8]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1.5, y: 0 }}
//         style={styles.header}
//       >
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color={COLORS.white} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Notification</Text>
//         <TouchableOpacity
//           onPress={handleSampleNotificationsShow}
//           style={styles.clearButton}
//         >
//           <Text style={styles.clearButtonText}>Clear</Text>
//         </TouchableOpacity>
//       </LinearGradient>

//       {/* Notification List */}
//       {notification.length > 0 ? (
//         <FlatList
//           data={notification}
//           renderItem={renderNotification}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.notificationList}
//         />
//       ) : (
//         <View style={styles.noNotifications}>
//           <Image source={noNotification} style={styles.noNotificationsImage} />
//           <Text style={styles.noNotificationsText}>No notifications</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   header: {
//     paddingHorizontal: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 40,
//     paddingVertical: 10,
//   },
//   backButton: {
//     alignItems: "flex-start",
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontFamily: fonts.Bold,
//     color: COLORS.white,
//   },
//   clearButton: {
//     alignItems: "flex-end",
//   },
//   clearButtonText: {
//     color: COLORS.white,
//     fontFamily: fonts.Regular,
//   },
//   topContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 5,
//     marginEnd: 10,
//   },
//   notificationList: {
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//   },
//   notificationItem: {
//     flexDirection: "row",
//     backgroundColor: COLORS.white,
//     padding: 15,
//     marginBottom: 5,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 5,
//   },
//   iconContainer: {
//     marginRight: 15,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   textContainer: {
//     flex: 1,
//   },
//   notificationstage: {
//     fontSize: 15,
//     fontFamily: fonts.Bold,
//     color: COLORS.secondary,
//   },
//   notificationMessage: {
//     fontSize: 12,
//     fontFamily: fonts.Regular,
//     color: COLORS.text,
//   },
//   notificationTime: {
//     fontSize: 12,
//     fontFamily: fonts.SemiBold,
//     color: COLORS.primary,
//   },
//   noNotifications: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noNotificationsText: {
//     fontSize: 15,
//     color: COLORS.primary,
//     fontFamily: fonts.Regular,
//     textAlign: "center",
//   },
//   noNotificationsImage: {
//     width: 200,
//     height: 200,
//   },
// });

import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function notification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/* <Text>Your expo push token: {expoPushToken}</Text> */}
      <Text>{`Channels: ${JSON.stringify(
        channels.map((c) => c.id),
        null,
        2
      )}`}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  console.log(token);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
