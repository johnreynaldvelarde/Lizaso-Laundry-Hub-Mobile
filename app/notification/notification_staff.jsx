import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { getNotification } from "../../data/api/getApi";
import useAuth from "../context/AuthContext";
import noNotification from "../../assets/images/no_data_table.jpg";
import { formatTimeNotification, iconMapping } from "../../constants/method";
import {
  updateClearAllNotificationsByCustomer,
  updateClearAllNotificationsByStaff,
  updateClearOneByOneNotificationsByCustomer,
  updateClearOneByOneNotificationsByStaff,
} from "../../data/api/putApi";

export default function Notification_Staff() {
  const { userDetails, socket } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const [notification, setNotification] = useState([]);

  const fetchNotification = useCallback(async () => {
    try {
      let response;
      if (userDetails.user_type === "Delivery Staff") {
        response = await getNotification(userDetails.storeId, "Delivery Staff");
      }
      if (response && response.data) {
        setNotification(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [userDetails.storeId, userDetails.user_type]);

  useEffect(() => {
    fetchNotification();
    if (socket) {
      socket.on("notificationsModule", (data) => {
        fetchNotification();
      });
      return () => {
        socket.off("notificationsModule");
      };
    }
  }, [fetchNotification, socket]);

  // const clearAllNotifications = async () => {
  //   try {
  //     const response = await updateClearAllNotificationsByStaff(
  //       userDetails.storeId
  //     );
  //     console.log(response.success);
  //     if (response.success) {
  //       setNotification([]);
  //     }
  //   } catch (error) {
  //     console.error("Error clearing notifications:", error);
  //   }
  // };

  const clearOneByOneNotifications = async (notification_id) => {
    try {
      const response = await updateClearOneByOneNotificationsByStaff(
        notification_id
      );

      if (response.success) {
        // Update local state to remove the cleared notification
        setNotification((prevNotifications) =>
          prevNotifications.filter((notif) => notif.id !== notification_id)
        );
      } else {
        console.error("Failed to clear notification:", response.message);
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const renderNotification = ({ item }) => {
    const iconName =
      iconMapping[item.notification_type] || "notifications-outline";

    return (
      <TouchableOpacity onPress={() => clearOneByOneNotifications(item.id)}>
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
        {/* <TouchableOpacity
          onPress={clearAllNotifications}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity> */}
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
