import { Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import useFonts from "../hooks/useFonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "./context/AuthContext";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const projectId = "136439ce-a143-469a-9a5d-d8a61695aafa";

export default function RootLayout() {
  const fontsLoaded = useFonts();
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        try {
          // Get Expo push token without projectId
          const token = await Notifications.getExpoPushTokenAsync();
          setNotificationToken(token.data);

          // Optionally, save the token in AsyncStorage or your backend
          await AsyncStorage.setItem("@expo_push_token", token.data);
        } catch (error) {
          console.error("Error getting push token:", error);
        }
      } else {
        console.error("Notification permission not granted");
      }
    };

    requestNotificationPermission();

    // Handle incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received in foreground:", notification);
      }
    );

    return () => {
      subscription.remove(); // Clean up listener on component unmount
    };
  }, []);

  // useEffect(() => {
  //   const requestNotificationPermission = async () => {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     if (status === "granted") {
  //       try {
  //         // Get Expo push token with projectId
  //         const token = await Notifications.getExpoPushTokenAsync({
  //           projectId,
  //         });
  //         setNotificationToken(token.data);

  //         // Optionally, you can save this token in AsyncStorage or your backend
  //         await AsyncStorage.setItem("@expo_push_token", token.data);
  //       } catch (error) {
  //         console.error("Error getting push token:", error);
  //       }
  //     } else {
  //       console.error("Notification permission not granted");
  //     }
  //   };

  //   requestNotificationPermission();

  //   // Handle incoming notifications
  //   const subscription = Notifications.addNotificationReceivedListener(
  //     (notification) => {
  //       console.log("Notification received in foreground:", notification);
  //     }
  //   );

  //   return () => {
  //     subscription.remove(); // Clean up listener on component unmount
  //   };
  // }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <BottomSheetModalProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth/sign-in/index" />
              <Stack.Screen
                name="notification/notification"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen
                name="auth/sign-up/index"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen
                name="auth/forget/forget"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen
                name="edit/customer/edit_profile"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen
                name="edit/customer/edit_address"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen
                name="edit/customer/edit_change_password"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen
                name="receipt/receipt"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen
                name="review/review"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen name="index" />
              <Stack.Screen
                name="message/chat"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              <Stack.Screen
                name="select/select"
                options={{
                  presentation: "modal",
                  animation: "ios",
                }}
              />
              {/* <Stack.Screen name="notification/noit" /> */}
              <Stack.Screen name="auth/complete/store_selection" />
            </Stack>
          </AuthProvider>
        </BottomSheetModalProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
