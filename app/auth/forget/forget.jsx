import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import COLORS from "../../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { fonts } from "../../../constants/fonts";
import { isEmailExist } from "../../../data/api/authApi";
import axios from "axios";

export default function Forget() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [isCodeInput, setIsCodeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const validateFields = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email must be a valid format";
    }
    return newErrors;
  };

  const handleInputChange = (field) => (value) => {
    if (field === "email") {
      setEmail(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      refs[index + 1].current.focus();
    }
    if (!value) {
      setErrors((prevErrors) => ({ ...prevErrors, code: "" }));
    }
  };

  const handleForgotPassword = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await isEmailExist({ email });
        if (response.success) {
          const generatedCode = Math.floor(1000 + Math.random() * 9000);
          setCode(generatedCode);

          const templateParams = {
            to_email: email,
            message: generatedCode,
          };

          console.log(templateParams);

          try {
            const emailResponse = await axios.post(
              "https://api.emailjs.com/api/v1.0/email/send",
              {
                service_id: "service_touybgx", // Your EmailJS service ID
                template_id: "template_5iwb032", // Your template ID
                user_id: "30OlCuMZDD9sNnswg6VAX", // Your public key
                template_params: templateParams,
              }
            );

            console.log(emailResponse);

            if (emailResponse.status === 200) {
              setIsCodeInput(true); // Show the input for the code
              setResponseMessage(
                "A verification code has been sent to your email."
              );
            } else {
              setErrors((prevErrors) => ({
                ...prevErrors,
                email: "Failed to send verification email. Please try again.",
              }));
            }
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            setErrors((prevErrors) => ({
              ...prevErrors,
              email:
                "There was an error sending the verification email. Please try again.",
            }));
          }
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: response.message,
          }));
        }
      } catch (error) {
        console.error("Error during API request:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyCode = () => {
    const joinedCode = code.join("");
    if (joinedCode.length !== 4 || joinedCode.includes("")) {
      setErrors({ code: "Please enter a valid 4-digit code." });
    } else {
      console.log("Code verified:", joinedCode);
      // Proceed to reset password or next steps
    }
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
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
          <View style={styles.container}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={forgetImage.forget} style={styles.image} />
            </View>

            {isCodeInput ? (
              <>
                <Text style={styles.title}>Enter 4-Digit Code</Text>
                <Text style={styles.subtitle}>
                  We've sent a 4-digit code to your email. Please enter it
                  below.
                </Text>
                <View style={styles.formContainer}>
                  <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={refs[index]}
                        value={digit}
                        onChangeText={(value) => handleCodeChange(value, index)}
                        maxLength={1}
                        keyboardType="number-pad"
                        style={[
                          styles.codeInput,
                          {
                            borderColor: errors.code
                              ? COLORS.error
                              : COLORS.primary,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  {errors.code && (
                    <Text style={styles.errorText}>{errors.code}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleVerifyCode}
                  >
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                  Enter your email address below and we will send you
                  instructions to reset your password.
                </Text>
                <View style={styles.formContainer}>
                  <View style={{ marginBottom: 15 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: fonts.Medium,
                        marginVertical: 8,
                        color: COLORS.primary,
                        marginLeft: 5,
                      }}
                    >
                      Email
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: 48,
                        borderColor: errors.email
                          ? COLORS.error
                          : COLORS.primary,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22,
                      }}
                    >
                      <TextInput
                        placeholder="e.g., example@domain.com"
                        placeholderTextColor={COLORS.grey}
                        keyboardType="default"
                        value={email}
                        onChangeText={handleInputChange("email")}
                        style={{ width: "100%", fontFamily: fonts.Regular }}
                      />
                    </View>
                    {errors.email && (
                      <Text
                        style={{
                          fontFamily: fonts.Regular,
                          color: COLORS.error,
                          fontSize: 12,
                          marginTop: 4,
                          marginStart: 20,
                        }}
                      >
                        {errors.email}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleForgotPassword}
                    disabled={loading} // Disable the button while loading
                  >
                    <View style={styles.buttonContent}>
                      {loading ? (
                        <ActivityIndicator size="large" color={COLORS.white} />
                      ) : (
                        <Text style={styles.buttonText}>Send</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.footerText}>
                  Remember your password?{" "}
                  <Text onPress={() => navigation.goBack()} style={styles.link}>
                    Log in
                  </Text>
                </Text>
              </>
            )}
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
    padding: 30,
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
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    textAlign: "center",
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    fontFamily: fonts.Regular,
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    height: 50,
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
