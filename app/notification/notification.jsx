import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "expo-router";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { getNotification } from "../../data/api/getApi";
import useAuth from "../context/AuthContext";
import usePolling from "../../hooks/usePolling";
import noNotification from "../../assets/images/no_data_table.jpg";
import { formatTimeNotification, iconMapping } from "../../constants/method";
import * as Notifications from "expo-notifications";
import { useNotifications } from "../../hooks/useNotifications";

export default function Notification() {
  const { userDetails } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const { schedulePushNotification } = useNotifications();

  const fetchNotification = useCallback(async () => {
    try {
      let response;
      if (userDetails.user_type === "Customer") {
        response = await getNotification(userDetails.userId, "Customer");
      } else {
        response = await getNotification(userDetails.storeId, "Staff");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [userDetails.userId, userDetails.user_type]);

  const {
    data: notification,
    loading,
    error,
    setIsPolling,
  } = usePolling(fetchNotification, 10000);

  useFocusEffect(
    useCallback(() => {
      setIsPolling(true);

      return () => {
        setIsPolling(false);
      };
    }, [])
  );

  const clearNotifications = () => {
    // setNotifications([]);
  };

  const handleSampleNotificationsShow = async () => {
    await schedulePushNotification();
  };

  const renderNotification = ({ item }) => {
    const iconName =
      iconMapping[item.notification_type] || "notifications-outline";

    return (
      <TouchableOpacity onPress={() => console.log("Notification clicked!")}>
        <View style={styles.notificationItem}>
          {/* Left Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={25} color={COLORS.subtitle} />
          </View>

          {/* Stage, Message and Time */}
          <View style={styles.textContainer}>
            <View style={styles.topContainer}>
              <Text style={styles.notificationstage}>
                {item.notification_type}
              </Text>
              <Text style={styles.notificationTime}>
                {formatTimeNotification(item.created_at || "")}
              </Text>
            </View>
            <Text style={styles.notificationMessage}>
              {item.notification_description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5787C8", "#71C7DA"]}
        locations={[0, 0.8]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.5, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity
          onPress={handleSampleNotificationsShow}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Notification List */}
      {notification.length > 0 ? (
        <FlatList
          data={notification}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationList}
        />
      ) : (
        <View style={styles.noNotifications}>
          <Image source={noNotification} style={styles.noNotificationsImage} />
          <Text style={styles.noNotificationsText}>No notifications</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingVertical: 10,
  },
  backButton: {
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: COLORS.white,
  },
  clearButton: {
    alignItems: "flex-end",
  },
  clearButtonText: {
    color: COLORS.white,
    fontFamily: fonts.Regular,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginEnd: 10,
  },
  notificationList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 15,
    marginBottom: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  notificationstage: {
    fontSize: 15,
    fontFamily: fonts.Bold,
    color: COLORS.secondary,
  },
  notificationMessage: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: COLORS.text,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
  },
  noNotifications: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noNotificationsText: {
    fontSize: 15,
    color: COLORS.primary,
    fontFamily: fonts.Regular,
    textAlign: "center",
  },
  noNotificationsImage: {
    width: 200,
    height: 200,
  },
});

// Sample notifications data
// const initialNotifications = [
//   {
//     //Step 1: Pickup Process
//     id: "1",
//     stage: "Pending Pickup:",
//     message: "Your clothes are scheduled for pickup",
//     time: "10:00 AM",
//     icon: "calendar", // Notification icon (Ionicons)
//   },
//   {
//     id: "2",
//     stage: "Ongoing Pickup:",
//     message: "Your clothes are being picked up by our rider",
//     time: "10:15 AM",
//     icon: "bicycle", // Notification icon (Ionicons)
//   },
//   {
//     id: "3",
//     stage: "Complete Pickup:",
//     message: "Your clothes have been successfully picked up by our rider.",
//     time: "10:20 AM",
//     icon: "checkmark-circle", // Notification icon (Ionicons)
//   },

//   //Stage 2: Laundry Process
//   {
//     id: "4",
//     stage: "At Store:",
//     message: "Your clothes have arrived at the laundry store.",
//     time: "11:05 AM",
//     icon: "storefront", // Notification icon (Ionicons)
//   },
//   {
//     id: "5",
//     stage: "In Queue:",
//     message:
//       "Your clothes are in queue, waiting for an available laundry machine.",
//     time: "11:15 AM",
//     icon: "hourglass", // Notification icon (Ionicons)
//   },
//   {
//     id: "6",
//     stage: "In Laundry:",
//     message: "Your clothes are being washed and dried.",
//     time: "11:30 AM",
//     icon: "water", // Notification icon (Ionicons)
//   },
//   {
//     id: "7",
//     stage: "Laundry Completed:",
//     message: "Your clothes have finished the laundry process.",
//     time: "01:10 PM",
//     icon: "basket", // Notification icon (Ionicons)
//   },

//   //Step 3: Delivery Process
//   {
//     id: "8",
//     stage: "Ready for Delivery:",
//     message: "Your clothes are ready for delivery and will be returned soon.",
//     time: "01:30 PM",
//     icon: "cube", // Notification icon (Ionicons)
//   },
//   {
//     id: "9",
//     stage: "Out for Delivery:",
//     message: "Your clothes are on the way to your location.",
//     time: "01:35 PM",
//     icon: "bicycle", // Notification icon (Ionicons)
//   },
//   {
//     id: "10",
//     stage: "Completed Delivery:",
//     message:
//       "Your clothes have been delivered successfully. Thank you for using our service!",
//     time: "01:45 PM",
//     icon: "home", // Notification icon (Ionicons)
//   },

//   // Optional: Cancellation
//   {
//     id: "11",
//     stage: "Canceled",
//     message:
//       "Your service request has been canceled. Please contact support if you need assistance.",
//     icon: "remove-circle",
//     time: "N/A",
//   },
// ];
