import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Toast from "react-native-toast-message";

// Function to request notification permissions and get the token
async function registerForPushNotificationsAsync() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== "granted") {
      alert("Failed to get push token for notifications!");
      return;
    }
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Push notification token:", token);
  return token;
}

export default function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    // Register for push notifications and set the token
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // Listener for notifications received while the app is in the foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        Toast.show({
          type: "info",
          text1: notification.request.content.title,
          text2: notification.request.content.body,
        });
      }
    );

    // Listener for user interaction with a notification (tap, etc.)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification interaction:", response);
        // Handle the notification response, like navigating to a screen
      });

    // Clean up the listeners when the component using this hook unmounts
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return expoPushToken;
}
