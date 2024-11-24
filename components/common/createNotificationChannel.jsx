import * as Notifications from "expo-notifications";

async function createNotificationChannel() {
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX, // Set the importance level
    vibrationPattern: [0, 250, 250, 250], // Optional: Set vibration pattern
    lightColor: "#FF6347", // Optional: Set the color for light effect
  });
}

createNotificationChannel();
