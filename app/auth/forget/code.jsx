import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import COLORS from "../../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { fonts } from "../../../constants/fonts";

export default function Code() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    console.log("Password reset link sent to:", email);
  };

  const forgetImage = {
    forget: require("@/assets/images/f_lock.png"),
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#ffffff", "#5787C8"]}
      locations={[0, 0.5, 4]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={COLORS.secondary}
          ></Ionicons>
          <Text style={styles.backText}> Back</Text>
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={forgetImage.forget} style={styles.image} />
            </View>

            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address below and we will send you instructions
              to reset your password.
            </Text>

            <View style={styles.formContainer}>
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.Medium,
                    marginVertical: 8,
                    color: COLORS.primary,
                    marginTop: -5,
                  }}
                >
                  Email
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="example@gmail.com"
                  placeholderTextColor="#A9A9A9"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.footerText}>
              Remember your password?{" "}
              <Text onPress={() => navigation.goBack()} style={styles.link}>
                Log in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.Bold,
    textAlign: "left",
    marginBottom: -30,
    color: COLORS.secondary,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "left",
    marginBottom: 30,
    color: "#666",
    marginBottom: 10,
    padding: 20,
  },

  input: {
    height: 50,
    width: "auto",
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: -20,
    color: COLORS.primary,
    fontFamily: fonts.SemiBold,
  },
  link: {
    color: COLORS.white,
    fontWeight: fonts.SemiBold,
  },
  image: {
    height: 100,
    resizeMode: "contain",
    marginBottom: 5,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 10,
    padding: 20,
    elevation: 5,
    marginBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginVertical: 10,
    marginBottom: 15,
  },
  backText: {
    fontSize: 24,
    marginLeft: 5,
    color: COLORS.secondary,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
});
