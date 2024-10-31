import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import COLORS from "../../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { fonts } from "../../../constants/fonts";

export default function Forget() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    // Handle the password reset logic here
    console.log("Password reset link sent to:", email);
  };

  const forgetImage = {
    forget: require("@/assets/images/f_lock.png"),
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.container}>
      <Image source={forgetImage.forget} style={styles.image} />
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address below and we will send you instructions to
          reset your password.
        </Text>

        <View style={styles.formContainer}>
          <View style={{ marginBottom: 10, marginTop: 10 }}>
          <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.Medium,
                    marginVertical: 8,
                    color: COLORS.primary,
                    marginLeft: 15
                  }}> Email </Text>

        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      </View>
      <Text style={styles.footerText}>
          Remember your password? <Text style={styles.link}>Log in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: -30,
    maxWidth: '90%',
    color: COLORS.secondary,
    padding: 20,
    marginTop: -30,
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
    width: 250,
    borderColor: "#A9A9A9",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 40,
    marginLeft: 15,
  },
  button: {
    backgroundColor: COLORS.secondary,
    padding: 14,
    borderRadius: 5,
    alignItems: "center",
    width: 250,
    height: 50,
    marginLeft: 15,
    marginTop: -20,   
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: -20,
    marginBottom: 150
    
  },
  link: {
    color: COLORS.primary, // Set your link color
    fontWeight: "bold",
  },
  image: {
    width: "30%",
    height: 100,
    resizeMode: "contain",
    marginBottom: 50,
    marginStart: 110,
    marginTop: 40,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    margin: 10,
    padding: 10,
    elevation: 6,
    marginBottom: 40,
    marginTop: -10
   
  },

});
