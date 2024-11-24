import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Lottie from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Onboarding from "../components/Onboarding";
import animated_logo from "../assets/lottie/logo_move.json";
import COLORS from "@/constants/colors";

export default function Index() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem(
          "@onboarding_complete"
        );

        if (onboardingComplete === "true") {
          setOnboardingComplete(true);
          setTimeout(() => {
            router.replace("/auth/sign-in");
          }, 200);
        } else {
          setSplashVisible(true);
          setTimeout(() => setSplashVisible(false), 2000);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setSplashVisible(true);
        setTimeout(() => setSplashVisible(false), 1000);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  return (
    <View style={styles.container}>
      {isSplashVisible ? (
        <Lottie
          source={animated_logo}
          autoPlay
          loop={true}
          resizeMode="cover"
          style={styles.lottie}
        />
      ) : (
        <Onboarding />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  lottie: {
    width: 250,
    height: 250,
  },
});
