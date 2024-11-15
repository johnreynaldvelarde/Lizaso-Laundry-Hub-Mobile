import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";
import COLORS from "@/constants/colors";
import { fonts } from "@/constants/fonts";

const onboardingImages = {
  welcome: require("@/assets/images/w_scheduling.png"),
  manage: require("@/assets/images/w_realtime.png"),
  getStarted: require("@/assets/images/w_convenience.png"),
};

export default function Onboarding() {
  const router = useRouter();

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("@onboarding_complete", "true");
      router.replace("auth/sign-in");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper loop={false} showsButtons={true} pagination={false}>
        <View style={styles.slide}>
          <Image source={onboardingImages.welcome} style={styles.image} />
          <Text style={styles.title}>Scheduling Made Easy</Text>
          <Text style={styles.subtitle}>
            Welcome to WASHN’CO! Schedule your laundry services in just a few
            taps and leave the rest to us.
          </Text>
        </View>

        <View style={styles.slide}>
          <Image source={onboardingImages.manage} style={styles.image} />
          <Text style={styles.title}>Real-Time Tracking</Text>
          <Text style={styles.subtitle}>
            Stay in the loop! Track your laundry in real-time from pickup to
            delivery, right from your phone.
          </Text>
        </View>

        <View style={styles.slide}>
          <Image source={onboardingImages.getStarted} style={styles.image} />
          <Text style={styles.title}>Convenience at Your Fingertips</Text>
          <Text style={styles.subtitle}>
            Enjoy the convenience of effortless laundry care with WASHN’CO.
            Clean clothes, no worries!
          </Text>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={completeOnboarding}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  getStartedButton: {
    position: "absolute",
    bottom: 50,
    padding: 5,
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
    flex: 1,
    height: 60,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  getStartedText: {
    color: COLORS.white,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 5,
    fontSize: 20,
  },
  wrapper: {
    height: Dimensions.get("window").height,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    color: COLORS.secondary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: COLORS.subtitle,
    textAlign: "center",
    marginBottom: 40,
    marginTop: 10,
    maxWidth: "90%",
    lineHeight: 23,
  },
});
