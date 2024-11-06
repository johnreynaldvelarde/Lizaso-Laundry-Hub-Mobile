import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../constants/fonts";


// Sample notifications data
const initialNotifications = [
  {
    //Step 1: Pickup Process
    id: "1",
    stage: "Pending Pickup:",
    message: "Your clothes are scheduled for pickup",
    time: "10:00 AM",
    icon: "calendar", // Notification icon (Ionicons)
  },
  {
    id: "2",
    stage: "Ongoing Pickup:",
    message: "Your clothes are being picked up by our rider",
    time: "10:15 AM",
    icon: "bicycle", // Notification icon (Ionicons)
  },
  {
    id: "3",
    stage: "Complete Pickup:",
    message: "Your clothes have been successfully picked up by our rider.",
    time: "10:20 AM",
    icon: "checkmark-circle", // Notification icon (Ionicons)
  },

  //Stage 2: Laundry Process
  {
    id: "4",
    stage: "At Store:",
    message: "Your clothes have arrived at the laundry store.",
    time: "11:05 AM",
    icon: "storefront", // Notification icon (Ionicons)
  },
  {
    id: "5",
    stage: "In Queue:",
    message: "Your clothes are in queue, waiting for an available laundry machine.",
    time: "11:15 AM",
    icon: "hourglass", // Notification icon (Ionicons)
  },
  {
    id: "6",
    stage: "In Laundry:",
    message: "Your clothes are being washed and dried.",
    time: "11:30 AM",
    icon: "water", // Notification icon (Ionicons)
  },
  {
    id: "7",
    stage: "Laundry Completed:",
    message: "Your clothes have finished the laundry process.",
    time: "01:10 PM",
    icon: "basket", // Notification icon (Ionicons)
  },

  //Step 3: Delivery Process
  {
    id: "8",
    stage: "Ready for Delivery:",
    message: "Your clothes are ready for delivery and will be returned soon.",
    time: "01:30 PM",
    icon: "cube", // Notification icon (Ionicons)
  },
  {
    id: "9",
    stage: "Out for Delivery:",
    message: "Your clothes are on the way to your location.",
    time: "01:35 PM",
    icon: "bicycle", // Notification icon (Ionicons)
  },
  {
    id: "10",
    stage: "Completed Delivery:",
    message: "Your clothes have been delivered successfully. Thank you for using our service!",
    time: "01:45 PM",
    icon: "home", // Notification icon (Ionicons)
  },

  // Optional: Cancellation
  { id: "11", 
    stage: "Canceled", 
    message: "Your service request has been canceled. Please contact support if you need assistance.", 
    icon: "remove-circle", 
    time: "N/A" },


];

export default function Notification() {
  const route = useRoute();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(initialNotifications);

  // Clear the notification list
  const clearNotifications = () => {
    setNotifications([]);
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => console.log("Notification clicked!")}>
      <View style={styles.notificationItem}>
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={32} color={COLORS.primary} />
        </View>

        {/* Stage, Message and Time */}
        <View style={styles.textContainer}>
          <View style = {styles.topContainer}>
            <Text style = {styles.notificationstage}>{item.stage}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
          <Text style={styles.notificationMessage}>{item.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>Notification</Text>

        {/* Clear List Button on the Right */}
        <TouchableOpacity
          onPress={clearNotifications}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationList}
        />
      ) : (
        <View style={styles.noNotifications}>
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
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Align items to the ends
    paddingTop: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    width: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: COLORS.primary,
    textAlign: "center",
    flex: 1,
  },
  clearButton: {
    width: 60, // Button width
    alignItems: "flex-end", // Align text to the right edge
  },
  clearButtonText: {
    color: COLORS.secondary,
    fontFamily: fonts.Medium,
    fontSize: 14,
  },
  topContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginStart: 10,
    marginEnd: 10,
  },
  notificationList: {
    paddingVertical: 20,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
    borderWidth: 1, // Add border for the outline
    borderColor: COLORS.border1, // Light gray color for the outline
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  notificationstage:{
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: COLORS.secondary,
  },
  notificationMessage: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    color: COLORS.primary,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: COLORS.primary,
  },
  noNotifications: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noNotificationsText: {
    fontSize: 16,
    color: COLORS.gray,
    fontFamily: fonts.Regular,
  },
});
