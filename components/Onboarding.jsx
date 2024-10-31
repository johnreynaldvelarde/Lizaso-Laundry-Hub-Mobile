import React, { useState } from "react";
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
import Swiper from "react-native-swiper"; // Import Swiper
import { useRouter } from "expo-router";
import COLORS from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { FontStyle } from "@shopify/react-native-skia";

// Import sample images
const onboardingImages = {
  welcome: require("@/assets/images/w_scheduling.png"),
  manage: require("@/assets/images/w_realtime.png"),
  getStarted: require("@/assets/images/w_convenience.png"),
};

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const completeOnboarding = async () => {
    try {
      // Set the onboarding complete flag
      await AsyncStorage.setItem("@onboarding_complete", "true");
      // Navigate to the login screen
      router.replace("auth/sign-in");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const skipOnboarding = async () => {
    await AsyncStorage.setItem("@onboarding_complete", "true");
    router.replace("auth/sign-in");
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < 2 ? prevIndex + 1 : prevIndex));
  };

  //const handleSkip = () => {
   // setCurrentIndex(2); // Jump to the getstarted slide
 // };

  const backSlide = () => {
    setCurrentIndex(0); // Jump to the first slide
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        loop={false}
        index={currentIndex}
        onIndexChanged={(index) => setCurrentIndex(index)}
        style={styles.wrapper}
        showsButtons={false}
        paginationStyle={styles.pagination}
      >
        <View style={styles.slide}> 
          <Image source={onboardingImages.welcome} style={styles.image} />
          <Text style={styles.title}>Scheduling Made Easy</Text>
          <Text style={styles.subtitle}>
          Welcome to WASHN’CO! Schedule your laundry services in just a few taps and leave the rest to us.
          </Text>
          
          <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity style = {styles.nextButton} onPress={handleNext}>
            <Text style = {styles.nextText}>Next</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.slide}>
          <Image source={onboardingImages.manage} style={styles.image} />
          <Text style={styles.title}>Real-Time Tracking</Text>
          <Text style={styles.subtitle}>
          Stay in the loop! Track your laundry in real-time from pickup to delivery, right from your phone.
          </Text>

          <TouchableOpacity style={styles.skipButton} onPress={backSlide}>
          <Text style={styles.skipText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style = {styles.nextButton} onPress={handleNext}>
            <Text style = {styles.nextText}>Next</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.slide}>
          <Image source={onboardingImages.getStarted} style={styles.image} />
          <Text style={styles.title}>Convenience at Your Fingertips</Text>
          <Text style={styles.subtitle}>
            Enjoy the convenience of effortless laundry care with WASHN’CO. Clean clothes, no worries!
          </Text>

          <TouchableOpacity style={styles.getStartedButton} onPress={completeOnboarding}>
            <Text style = {styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
          
        </View>
      </Swiper>

    </SafeAreaView>
  );
}

// Styling for the onboarding screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  skipButton: {
    position: "absolute",
    bottom: 50,
    left: 30,
    padding: 5,
    backgroundColor: COLORS.secondary, // Optional: add background color
    borderRadius: 5,
    flex: 1,
    height: 50,
    width: 130,
    borderWidth: 1,
    backgroundColor: "transparent",
    borderColor: COLORS.secondary

  },
  skipText: {
    color: COLORS.secondary,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 5,
    fontSize: 20,
  },
  nextButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
    padding: 5,
    backgroundColor: COLORS.secondary, // Optional: add background color
    borderRadius: 5,
    flex: 1,
    height: 50,
    width: 150,
  },
  nextText: {
    color: COLORS.white,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 5,
    fontSize: 20,
  },
  getStartedButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
    padding: 5,
    backgroundColor: COLORS.secondary, // Optional: add background color
    borderRadius: 5,
    flex: 1,
    height: 50,
    width: 300,
  },
  getStartedText:{
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
    fontWeight: "bold",
    color: COLORS.secondary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 10,
    maxWidth: '90%',
    lineHeight: 23,
  },
  pagination: {
    bottom: 180,
  },
});

// import React from "react";
// import {
//   View,
//   Text,
//   Button,
//   SafeAreaView,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Swiper from "react-native-swiper"; // Import Swiper
// import { useRouter } from "expo-router";
// import COLORS from "@/constants/colors";

// export default function Onboarding() {
//   const router = useRouter();

//   const completeOnboarding = async () => {
//     try {
//       // Set the onboarding complete flag
//       await AsyncStorage.setItem("@onboarding_complete", "true");
//       // Navigate to the login screen
//       router.replace("auth/sign-in");
//     } catch (error) {
//       console.error("Error saving onboarding status:", error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Swiper
//         style={styles.wrapper}
//         showsButtons={false}
//         paginationStyle={styles.pagination}
//       >
//         <View style={styles.slide}>
//           <Text style={styles.title}>Welcome to Lizaso Laundry Hub!</Text>
//           <Text style={styles.subtitle}>
//             Your laundry management solution starts here.
//           </Text>
//         </View>
//         <View style={styles.slide}>
//           <Text style={styles.title}>Manage Your Laundry</Text>
//           <Text style={styles.subtitle}>
//             Easily track and manage your laundry orders.
//           </Text>
//         </View>
//         <View style={styles.slide}>
//           <Text style={styles.title}>Get Started Now</Text>
//           <Text style={styles.subtitle}>Complete onboarding to begin.</Text>
//           <Button
//             title="Get Started"
//             onPress={completeOnboarding}
//             color={COLORS.secondary}
//           />
//         </View>
//       </Swiper>
//     </SafeAreaView>
//   );
// }

// // Styling for the onboarding screen
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   wrapper: {
//     height: Dimensions.get("window").height,
//   },
//   slide: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   pagination: {
//     bottom: 50,
//   },
// });
