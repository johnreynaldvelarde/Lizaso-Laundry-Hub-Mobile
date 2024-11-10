import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import COLORS from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../../constants/fonts";
import { useNavigation } from "expo-router";
import { updateResetPassword } from "../../../data/api/authApi"; // Assuming this is the API for password reset
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ResetPassword() {
  const { userDetails, fetchUserDetails, logout } = useAuth();
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!password) {
      newErrors.password = "New password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (value) => {
    switch (field) {
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigation.navigate("auth/sign-in/index");
  };

  const handleResetPassword = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = {
        currentPassword,
        password,
      };

      setLoading(true);

      try {
        const response = await updateResetPassword(userDetails.userId, data);

        if (response.success) {
          Alert.alert(
            "Success",
            response.message,
            [
              {
                text: "OK",
                onPress: () => {
                  handleLogout();
                },
              },
            ],
            { cancelable: false } // Prevents closing the alert by tapping outside
          );
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            currentPassword: response.message,
          }));
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong, please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back-sharp"
            size={20}
            color={COLORS.secondary}
          ></Ionicons>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginHorizontal: 25 }}>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                marginTop: 15,
                fontSize: 30,
                fontFamily: fonts.SemiBold,
                color: COLORS.primary,
              }}
            >
              Reset Password
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Current Password Field */}
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.Medium,
                  marginVertical: 8,
                  color: COLORS.primary,
                }}
              >
                Current Password
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.currentPassword
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
                  placeholder="Enter current password"
                  placeholderTextColor={COLORS.grey}
                  secureTextEntry={isCurrentPasswordShown}
                  value={currentPassword}
                  onChangeText={handleInputChange("currentPassword")}
                  style={{ width: "100%", fontFamily: fonts.Regular }}
                />
                <TouchableOpacity
                  onPress={() =>
                    setIsCurrentPasswordShown(!isCurrentPasswordShown)
                  }
                  style={{ position: "absolute", right: 12 }}
                >
                  {isCurrentPasswordShown ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.primary} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.currentPassword && (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.error,
                    fontSize: 12,
                    marginTop: 4,
                    marginStart: 10,
                  }}
                >
                  {errors.currentPassword}
                </Text>
              )}
            </View>

            {/* New Password Field */}
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.Medium,
                  marginVertical: 8,
                  color: COLORS.primary,
                }}
              >
                New Password
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.password ? COLORS.error : COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor={COLORS.grey}
                  secureTextEntry={isPasswordShown}
                  value={password}
                  onChangeText={handleInputChange("password")}
                  style={{ width: "100%", fontFamily: fonts.Regular }}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={{ position: "absolute", right: 12 }}
                >
                  {isPasswordShown ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.primary} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.error,
                    fontSize: 12,
                    marginTop: 4,
                    marginStart: 10,
                  }}
                >
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Confirm Password Field */}
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.Medium,
                  marginVertical: 8,
                  color: COLORS.primary,
                }}
              >
                Confirm Password
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.confirmPassword
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
                  placeholder="Confirm new password"
                  placeholderTextColor={COLORS.grey}
                  secureTextEntry={isConfirmPasswordShown}
                  value={confirmPassword}
                  onChangeText={handleInputChange("confirmPassword")}
                  style={{ width: "100%", fontFamily: fonts.Regular }}
                />
                <TouchableOpacity
                  onPress={() =>
                    setIsConfirmPasswordShown(!isConfirmPasswordShown)
                  }
                  style={{ position: "absolute", right: 12 }}
                >
                  {isConfirmPasswordShown ? (
                    <Ionicons name="eye-off" size={24} color={COLORS.primary} />
                  ) : (
                    <Ionicons name="eye" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.error,
                    fontSize: 12,
                    marginTop: 4,
                    marginStart: 10,
                  }}
                >
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={loading}
              style={{
                backgroundColor: COLORS.secondary,
                borderRadius: 10,
                marginTop: 10,
                padding: 10,
                opacity: loading ? 0.7 : 1,
                height: 50,
                justifyContent: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator size="large" color={COLORS.white} />
              ) : (
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 15,
                    fontFamily: fonts.SemiBold,
                    textAlign: "center",
                  }}
                >
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    marginVertical: 10,
    marginBottom: 15,
  },
  backText: {
    fontSize: 20,
    marginLeft: 5,
    color: COLORS.secondary,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
  formContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: fonts.SemiBold,
    fontSize: 16,
  },
});
