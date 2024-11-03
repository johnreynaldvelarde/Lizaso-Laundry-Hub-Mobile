import { Text } from "react-native";
import { Stack } from "expo-router";
import useFonts from "../hooks/useFonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "./context/AuthContext";
import { TransitionPresets } from "@react-navigation/stack";

export default function RootLayout() {
  const fontsLoaded = useFonts();

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
                name="auth/sign-up/index"
                options={{
                  presentation: "modal",
                  animation: "slide_from_right",
                }}
              />
              {/* <Stack.Screen
                name="auth/forget/forget"
                options={{
                  presentation: "modal",
                  animation: "slide_from_right",
                }}
              />*/}
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
              <Stack.Screen name="notification/list" />
              <Stack.Screen name="auth/complete/store_selection" />
            </Stack>
          </AuthProvider>
        </BottomSheetModalProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}

// import { Text } from "react-native";
// import { Stack } from "expo-router";
// import useFonts from "../hooks/useFonts";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { PortalProvider } from "@gorhom/portal";
// import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// export default function RootLayout() {
//   const fontsLoaded = useFonts();
//   if (!fontsLoaded) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <PortalProvider>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="index" />
//           <Stack.Screen name="message/chat" />
//           <Stack.Screen name="notification/list" />
//         </Stack>
//       </PortalProvider>
//     </GestureHandlerRootView>
//   );
// }

// RootLayout.js
