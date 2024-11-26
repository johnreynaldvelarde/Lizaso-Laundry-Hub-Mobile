import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

async function setAndroidNotificationChannel() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status === "granted") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default Channel",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF0000",
    });
    console.log("Notification channel set with default sound.");
  } else {
    console.error("Notification permission not granted");
  }
}

async function CustomNotifications(title, body, data) {
  try {
    await setAndroidNotificationChannel();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Default Title",
        body: body || "Default Body",
        data: data || { message: "Default Data" },
        sound: null,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: { seconds: 1 },
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
}

export default CustomNotifications;
