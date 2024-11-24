import * as Notifications from "expo-notifications";

// For Android: Setting a notification channel with high importance
async function setAndroidNotificationChannel() {
  // Requesting notification permissions
  const { status } = await Notifications.getPermissionsAsync();

  // Debugging: Log the status of the permission request
  console.log("Notification Permission Status:", status);

  if (status === "granted") {
    // Set the notification channel for Android with high importance
    console.log("Setting Android notification channel...");
    await Notifications.setNotificationChannelAsync("default", {
      name: "default", // Channel name
      importance: Notifications.AndroidImportance.HIGH, // High importance for banner notifications
      sound: "default", // Default system sound
      vibrationPattern: [0, 250, 250, 250], // Optional: Vibration pattern
      lightColor: "#FF0000", // Optional: Color of the notification LED light
    });
    console.log("Notification channel set.");
  } else {
    console.error("Notification permission not granted");
  }
}

// Custom function to send notifications
async function CustomNotifications(title, body, data) {
  console.log("Preparing to send notification...");

  // Ensure the notification channel is set up
  await setAndroidNotificationChannel();

  // Schedule the notification and log the process
  console.log("Scheduling notification...");

  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || "Default Title", // Default title if none is provided
      body: body || "Default Body", // Default body if none is provided
      data: data || { message: "Default Data" }, // Default data if none is provided
      sound: "default", // Use default system sound
      priority: Notifications.AndroidNotificationPriority.HIGH, // Set to high priority for banner
    },
    trigger: { seconds: 1 }, // Trigger the notification after 1 second
  });

  console.log("Notification scheduled.");
}

// Export the custom notification function
export default CustomNotifications;

// import * as Notifications from "expo-notifications";

// // For Android: Setting a notification channel
// async function setAndroidNotificationChannel() {
//   const { status } = await Notifications.getPermissionsAsync();

//   if (status === "granted") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.HIGH, // High importance for banner notifications
//       vibrationPattern: [0, 250, 250, 250], // Optional: Vibration pattern
//       sound: "default", // Default sound
//     });
//   }
// }

// async function CustomNotifications(title, body, data) {
//   // Set the notification channel for Android
//   await setAndroidNotificationChannel();

//   // Schedule the notification
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: title || "Default Title", // Default title if none is provided
//       body: body || "Default Body", // Default body if none is provided
//       data: data || { message: "Default Data" }, // Default data if none is provided
//       sound: "default", // Use default system sound
//       priority: Notifications.AndroidNotificationPriority.HIGH, // Urgent notification (banner)
//     },
//     trigger: { seconds: 1 }, // Trigger the notification after 1 second
//   });
// }

// export default CustomNotifications;

// import * as Notifications from "expo-notifications";

// async function CustomNotifications(title, body, data) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: title || "Default Title", // Default title if none is provided
//       body: body || "Default Body", // Default body if none is provided
//       data: data || { message: "Default Data" }, // Default data if none is provided
//       sound: "default", // Use the system's default notification sound
//       priority: Notifications.AndroidNotificationPriority.HIGH, // Priority set to HIGH for banner-style (heads-up) notifications
//       // Android-specific notification configuration
//       android: {
//         channelId: "default", // Ensure you have a default notification channel set up
//         priority: Notifications.AndroidNotificationPriority.HIGH, // High priority triggers heads-up notification
//         color: "#FF6347", // Optional: Set the color for the notification's icon
//         vibrate: true, // Optional: Vibrate on notification
//       },
//     },
//     trigger: { seconds: 1 }, // Trigger the notification after 1 second
//     vibrationPattern: [0, 250, 250, 250], // Optional: Custom vibration pattern
//   });
// }

// export default CustomNotifications;

// import * as Notifications from "expo-notifications";

// async function CustomNotifications(title, body, data) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: title || "Default Title", // Default title if none is provided
//       body: body || "Default Body", // Default body if none is provided
//       data: data || { message: "Default Data" }, // Default data if none is provided
//       sound: "default", // Use the system's default notification sound (you can also specify a custom sound here)
//       priority: Notifications.AndroidNotificationPriority.HIGH, // Optional: Make the notification urgent (it will show as a banner)
//     },
//     trigger: { seconds: 1 }, // Trigger the notification after 1 second
//     vibrationPattern: [0, 250, 250, 250],
//   });
// }

// export default CustomNotifications;

// import notifee from "@notifee/react-native";

// // Function to trigger a notification
// async function CustomNotifications(title, body, data) {
//   // Create a channel for Android notifications
//   await notifee.createChannel({
//     id: "default",
//     name: "Default Channel",
//     sound: "default", // Set default system sound or use custom sound
//     vibration: true,
//   });

//   // Display the notification as a banner
//   await notifee.displayNotification({
//     title: title || "Default Title",
//     body: body || "Default Body",
//     android: {
//       channelId: "default",
//       smallIcon: "ic_launcher", // Make sure to provide a small icon for Android
//       sound: "default", // Use the default system sound, or specify your custom sound
//       priority: notifee.AndroidPriority.HIGH, // HIGH priority for banner notifications
//       visibility: notifee.AndroidVisibility.PUBLIC, // Make the notification visible to everyone
//       vibrationPattern: [0, 250, 250, 250], // Optional vibration pattern
//       showTimestamp: true, // Optional: show timestamp in the notification
//     },
//     ios: {
//       sound: true, // Optional: Play sound on iOS as well
//       badge: 1, // Optional: Update badge number on iOS
//     },
//   });
// }

// export default CustomNotifications;

// import * as Notifications from "expo-notifications";
// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// // Set up the notification handler globally
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true, // Show the notification alert (pop-up)
//     shouldPlaySound: true, // Play sound when the notification is triggered
//     shouldSetBadge: false, // Optionally update the badge count
//   }),
// });

// async function CustomNotifications(title, body, data) {
//   // Schedule the notification
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: title || "Default Title", // Default title if none is provided
//       body: body || "Default Body", // Default body if none is provided
//       data: data || { message: "Default Data" }, // Default data if none is provided
//       sound: "default", // Play the default system sound
//       priority: Notifications.AndroidNotificationPriority.HIGH, // Make it urgent (banner style)
//     },
//     trigger: { seconds: 1 }, // Trigger the notification after 1 second
//     vibrationPattern: [0, 250, 250, 250], // Optional vibration pattern
//   });
// }

// // Banner Notification component (if you want it to show as a banner at the top)
// const BannerNotification = ({ title, message, onClose }) => {
//   return (
//     <View style={styles.banner}>
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.message}>{message}</Text>
//       <TouchableOpacity onPress={onClose}>
//         <Text style={styles.close}>X</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   banner: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#4690FF",
//     padding: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   title: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   message: {
//     color: "#fff",
//   },
//   close: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// export { CustomNotifications, BannerNotification };
