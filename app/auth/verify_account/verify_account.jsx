import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import useAuth from "../../context/AuthContext";
import COLORS from "../../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { fonts } from "../../../constants/fonts";
import login_background from "../../../assets/images/login_background.jpg";
import email_verified from "../../../assets/images/email_verified.jpg";
import { Portal } from "@gorhom/portal";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet/";
import {
  login,
  register,
  updateAccountIsVerified,
  updateEmailForVerified,
} from "../../../data/api/authApi";
import { useRoute } from "@react-navigation/native";
import {
  generateRandomCode,
  sendVerificationEmail,
} from "../../../utils/emailUtils";
import { getCheckCustomerDetails } from "../../../data/api/getApi";

export default function Verify_Account() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userDetails } = useAuth();
  const [snapPoints, setSnapPoints] = useState(["40%"]);
  const bottomSheetRef = useRef(null);
  const [email, setEmail] = useState(userDetails.email);
  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (email) {
      const newCode = generateRandomCode();
      setGeneratedCode(newCode);
      sendVerificationEmail(email, newCode);
    }
  }, [email]);

  useEffect(() => {
    let interval;

    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
      setTimer(60);
    }

    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );
  const openModal = () => {
    bottomSheetRef.current?.expand();
  };

  const closeModal = () => {
    bottomSheetRef.current?.close();
  };

  const handleChange = (value, index) => {
    if (/^\d$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Automatically focus the next input if value is entered
      if (value !== "" && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

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
    switch (field) {
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleUpdateEmail = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = {
        email: email,
      };
      setLoading(true);
      try {
        const response = await updateEmailForVerified(userDetails.userId, data);

        if (response.success) {
          Alert.alert(
            "Email Changed",
            "Your email has been successfully updated.",
            [
              {
                text: "OK",
                onPress: () => {
                  closeModal();
                },
              },
            ]
          );
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: response.message,
          }));
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = () => {
    setError("");

    const enteredCode = code.join("");
    if (enteredCode.length !== 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (enteredCode === generatedCode) {
        Alert.alert("Success", "Account verified successfully!", [
          {
            text: "OK",
            onPress: async () => {
              try {
                const response = await updateAccountIsVerified(
                  userDetails.userId
                );
                if (response.success) {
                  const details = await getCheckCustomerDetails(
                    userDetails.userId
                  );
                  if (details.success !== false) {
                    const { storeIdIsNull, addressIdIsNull } = details.data;

                    if (storeIdIsNull || addressIdIsNull) {
                      navigation.navigate("auth/complete/address");
                    } else {
                      navigation.navigate("(customer)");
                    }
                  } else {
                    console.log(details);
                  }
                } else {
                  console.log(response.message);
                }
              } catch (error) {
                console.error(
                  "Error during login or fetching user details:",
                  error
                );
              }
            },
          },
        ]);
      } else {
        setError("Invalid code. Please try again.");
      }
    }, 1000);
  };

  const handleResendCode = () => {
    if (isResendDisabled) return;
    setIsResendLoading(true);
    const newCode = generateRandomCode();
    setGeneratedCode(newCode);

    sendVerificationEmail(email, newCode)
      .then(() => {
        Alert.alert(
          "Verification Code Sent",
          "A new verification code has been sent to your email."
        );
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "There was an issue resending the verification code. Please try again later."
        );
      })
      .finally(() => {
        setIsResendDisabled(true);
        setIsResendLoading(false);
      });
  };

  useEffect(() => {
    if (email !== "") {
      setIsLoading(true);
      setTimeout(() => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setIsVerified(isValidEmail);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsVerified(false);
    }
  }, [email]);

  return (
    <ImageBackground
      source={login_background}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["#5787C890", "#ffffff90", "#ffffff"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ marginBottom: 50 }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back-outline"
                size={30}
                color={COLORS.white}
              ></Ionicons>
              <Text style={styles.backText}> Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image source={email_verified} style={styles.image} />
            </View>
            <Text style={styles.header}>Verify Your Account</Text>
            <Text style={styles.subHeader}>
              A 4-digit verification code has been sent to:{" "}
              <Text style={styles.email}>{email}</Text>
            </Text>

            <View style={styles.inputContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  value={digit}
                  onChangeText={(value) => handleChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      digit === "" &&
                      index > 0
                    ) {
                      inputRefs.current[index - 1].focus();
                    }
                  }}
                />
              ))}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Verifying..." : "Verify Account"}
              </Text>
            </TouchableOpacity>

            {/* Resend Code and Change Email Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 20,
              }}
            >
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResendDisabled}
              >
                <Text
                  style={{
                    color: isResendDisabled ? "gray" : COLORS.primary,
                    fontFamily: fonts.SemiBold,
                  }}
                >
                  {isResendDisabled
                    ? `Resend Code (${timer}s)` // Show remaining time
                    : "Resend Code"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  openModal();
                }}
                disabled={isResendDisabled}
              >
                <Text
                  style={{
                    color: COLORS.secondary,
                    fontFamily: fonts.SemiBold,
                  }}
                >
                  Change Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Sheet */}
          <Portal>
            <BottomSheet
              ref={bottomSheetRef}
              index={-1}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              backgroundStyle={{
                backgroundColor: COLORS.white,
                borderRadius: 20,
              }}
              handleIndicatorStyle={{ backgroundColor: COLORS.primary }}
              backdropComponent={renderBackdrop}
            >
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Change Email</Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <MaterialIcons
                    name="close"
                    size={24}
                    color={COLORS.secondary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View
                style={{
                  padding: 20,
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <View style={{ marginBottom: 12 }}>
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
                      height: 50,
                      borderColor: errors.email ? COLORS.error : COLORS.border,
                      borderWidth: 1,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 20,
                    }}
                  >
                    <TextInput
                      placeholder="e.g., example@domain.com"
                      placeholderTextColor={COLORS.grey}
                      keyboardType="default"
                      value={email}
                      onChangeText={handleInputChange("email")}
                      style={{
                        flex: 1,
                        fontFamily: fonts.Regular,
                        fontSize: 15,
                      }}
                    />
                    {email !== "" && (
                      <View style={{ marginRight: 12 }}>
                        {isloading ? (
                          <ActivityIndicator
                            size="small"
                            color={COLORS.secondary}
                          />
                        ) : (
                          <TouchableOpacity>
                            {isVerified ? (
                              <AntDesign
                                name="checkcircle"
                                size={25}
                                color={COLORS.success}
                              />
                            ) : (
                              <MaterialIcons
                                name="cancel"
                                size={25}
                                color={COLORS.error}
                              />
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
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
                <View>
                  <TouchableOpacity
                    onPress={handleUpdateEmail}
                    disabled={loading}
                    style={{
                      backgroundColor: COLORS.secondary,
                      borderRadius: 8,
                      marginTop: 10,
                      padding: 10,
                      opacity: loading ? 0.7 : 1,
                      height: 50,
                      justifyContent: "center",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator size="large" color={COLORS.white} />
                    ) : (
                      <>
                        <Ionicons
                          name="mail-outline"
                          size={25}
                          color={COLORS.white}
                          style={{ marginRight: 10 }}
                        />
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: 15,
                            fontFamily: fonts.SemiBold,
                            textAlign: "center",
                          }}
                        >
                          Update Email
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheet>
          </Portal>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    marginLeft: 10,
    marginVertical: 15,
  },
  backText: {
    fontSize: 20,
    color: COLORS.white,
    fontFamily: fonts.SemiBold,
  },
  image: {
    height: 200,
    width: "100%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: COLORS.white,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    textAlign: "center",
    marginBottom: 10,
    color: COLORS.text,
  },
  subHeader: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: fonts.Regular,
    color: COLORS.subtitle,
    marginBottom: 20,
  },
  email: {
    fontFamily: fonts.Bold,
    color: COLORS.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  error: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: fonts.Regular,
  },
  button: {
    backgroundColor: COLORS.success,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#a5d6a7",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: fonts.SemiBold,
    fontSize: 18,
    color: COLORS.primary,
  },
  closeButton: {
    backgroundColor: COLORS.light,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 5,
    width: "100%",
  },
});
