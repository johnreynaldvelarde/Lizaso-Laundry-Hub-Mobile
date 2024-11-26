import { Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import useFonts from "../hooks/useFonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "./context/AuthContext";
import * as Notifications from "expo-notifications";
import { NotificationsContextProvider } from "./context/NotificationsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const fontsLoaded = useFonts();
  const router = useRouter();

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <BottomSheetModalProvider>
          <AuthProvider>
            <NotificationsContextProvider>
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
                  name="notification/notification_staff"
                  options={{
                    presentation: "modal",
                    animation: "ios",
                  }}
                />
                <Stack.Screen
                  name="notification/notification_customer"
                  options={{
                    presentation: "modal",
                    animation: "ios",
                  }}
                />
                <Stack.Screen
                  name="(customer)"
                  options={{
                    presentation: "modal",
                    animation: "fade_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="(staff)"
                  options={{
                    presentation: "modal",
                    animation: "fade_from_bottom",
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
                  name="auth/verify_account/verify_account"
                  options={{
                    presentation: "modal",
                    animation: "ios",
                  }}
                />
                <Stack.Screen
                  name="auth/term/term"
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
                  name="auth/complete/address"
                  options={{
                    presentation: "modal",
                    animation: "ios",
                  }}
                />
                <Stack.Screen
                  name="auth/complete/store_selection"
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
                {/* <Stack.Screen name="auth/complete/store_selection" /> */}
              </Stack>
            </NotificationsContextProvider>
          </AuthProvider>
        </BottomSheetModalProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
