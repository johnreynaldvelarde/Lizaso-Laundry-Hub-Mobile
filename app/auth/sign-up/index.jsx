import { LinearGradient } from "expo-linear-gradient";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import COLORS from "../../../constants/colors";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { fonts } from "../../../constants/fonts";
import { useNavigation, useRouter } from "expo-router";
import Checkbox from "expo-checkbox";
import { login, register } from "../../../data/api/authApi";
import { useAuth } from "../../context/AuthContext";

export default function SignUp() {
  const { userDetails, fetchUserDetails } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleIconPress = () => {
    setTooltipVisible(true);
    setTimeout(() => setTooltipVisible(false), 2000);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain only numbers";
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 digits";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email must be a valid format";
    }

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 5) {
      newErrors.username = "Username must be at least 5 characters long";
    }

    if (!firstname) {
      newErrors.firstname = "First name is required";
    }

    if (!lastname) {
      newErrors.lastname = "Last name is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
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

    return newErrors;
  };

  const handleInputChange = (field) => (value) => {
    // Update state based on the field
    switch (field) {
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "firstname":
        setFirstName(value);
        break;
      case "middlename":
        setMiddleName(value);
        break;
      case "lastname":
        setLastName(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  useEffect(() => {
    if (email !== "") {
      setLoading(true);
      setTimeout(() => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setIsVerified(isValidEmail);
        setLoading(false);
      }, 1000);
    } else {
      setIsVerified(false);
    }
  }, [email]);

  const handleSignup = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!isChecked) {
        Alert.alert(
          "Attention",
          "You must agree to the terms before signing up."
        );
        return;
      }

      const data = {
        mobile_number: phoneNumber,
        email: email,
        username: username,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        password: password,
        isAgreement: isChecked,
      };

      setLoading(true);

      try {
        const response = await register(data);

        if (response.success) {
          const login_response = await login({
            username: username,
            password: password,
          });

          await AsyncStorage.setItem("accessToken", login_response.accessToken);

          await fetchUserDetails(login_response.accessToken);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: response.message,
          }));
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTermAndConditons = () => {
    navigation.navigate("auth/term/term", {});
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#ffffff", "#5787C8"]}
      locations={[0, 0.5, 4]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={{ flex: 1, margin: 2 }}>
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
              size={30}
              color={COLORS.secondary}
            ></Ionicons>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <View style={{ marginVertical: 10 }}>
              <Text
                style={{
                  marginTop: 15,
                  fontSize: 30,
                  fontFamily: fonts.Bold,
                  marginVertical: 12,
                  color: COLORS.secondary,
                  marginLeft: 10,
                  marginTop: -5,
                }}
              >
                Create an Account
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: fonts.Regular,
                  color: COLORS.primary,
                  marginLeft: 10,
                  marginTop: -10,
                }}
              >
                Fast and easy laundry service at hand!
              </Text>
            </View>

            <View style={styles.formContainer}>
              {/* MOBILE NUMBER */}
              <View style={{ marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.Medium,
                    marginVertical: 8,
                    color: COLORS.primary,
                    marginLeft: 5,
                    marginTop: 20,
                  }}
                >
                  Mobile Number
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: errors.phoneNumber
                      ? COLORS.error
                      : COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: 15,
                  }}
                >
                  <TextInput
                    placeholder="+63"
                    placeholderTextColor={COLORS.primary}
                    editable={false}
                    style={{
                      width: "13%",
                      borderRightWidth: 1,
                      borderRightColor: errors.phoneNumber
                        ? COLORS.error
                        : COLORS.primary,
                      height: "100%",
                      fontFamily: fonts.Medium,
                    }}
                  />
                  <TextInput
                    placeholder="Enter your phone number"
                    placeholderTextColor={COLORS.grey}
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={handleInputChange("phoneNumber")}
                    style={{ width: "80%", fontFamily: fonts.Regular }}
                  />
                </View>
                {errors.phoneNumber && (
                  <Text
                    style={{
                      color: COLORS.error,
                      fontFamily: fonts.Regular,
                      fontSize: 12,
                      marginTop: 4,
                      marginStart: 20,
                    }}
                  >
                    {errors.phoneNumber}
                  </Text>
                )}
              </View>

              {/* Email */}
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
                    height: 48,
                    borderColor: errors.email ? COLORS.error : COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 8,
                    flexDirection: "row", // Ensures the icon is aligned horizontally with the input
                    alignItems: "center",
                    paddingLeft: 22,
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
                    }}
                  />
                  {email !== "" && (
                    <View style={{ marginRight: 12 }}>
                      {loading ? (
                        <ActivityIndicator
                          size="small"
                          color={COLORS.secondary}
                        />
                      ) : (
                        <TouchableOpacity onPress={handleIconPress}>
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

              {/* First name */}
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
                  Firstname
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: errors.firstname
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
                    placeholder="Enter your first name"
                    placeholderTextColor={COLORS.grey}
                    keyboardType="default"
                    value={firstname}
                    onChangeText={handleInputChange("firstname")}
                    style={{ width: "100%", fontFamily: fonts.Regular }}
                  />
                </View>
                {errors.firstname && (
                  <Text
                    style={{
                      fontFamily: fonts.Regular,
                      color: COLORS.error,
                      fontSize: 12,
                      marginTop: 4,
                      marginStart: 20,
                    }}
                  >
                    {errors.firstname}
                  </Text>
                )}
              </View>

              {/* Middle name */}
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
                  Middlename
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 22,
                  }}
                >
                  <TextInput
                    placeholder="Enter your middle name (optional)"
                    placeholderTextColor={COLORS.grey}
                    keyboardType="default"
                    value={middlename}
                    onChangeText={handleInputChange("middlename")}
                    style={{ width: "100%", fontFamily: fonts.Regular }}
                  />
                </View>
              </View>

              {/* Last name */}
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
                  Lastname
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: errors.lastname
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
                    placeholder="Enter your lastname"
                    placeholderTextColor={COLORS.grey}
                    keyboardType="default"
                    value={lastname}
                    onChangeText={handleInputChange("lastname")}
                    style={{ width: "100%", fontFamily: fonts.Regular }}
                  />
                </View>
                {errors.lastname && (
                  <Text
                    style={{
                      fontFamily: fonts.Regular,
                      color: COLORS.error,
                      fontSize: 12,
                      marginTop: 4,
                      marginStart: 20,
                    }}
                  >
                    {errors.lastname}
                  </Text>
                )}
              </View>

              {/* Username */}
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
                  Username
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: errors.username
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
                    placeholder="Enter your username"
                    placeholderTextColor={COLORS.grey}
                    keyboardType="default"
                    value={username}
                    onChangeText={handleInputChange("username")}
                    style={{ width: "100%", fontFamily: fonts.Regular }}
                  />
                </View>
                {errors.username && (
                  <Text
                    style={{
                      fontFamily: fonts.Regular,
                      color: COLORS.error,
                      fontSize: 12,
                      marginTop: 4,
                      marginStart: 20,
                    }}
                  >
                    {errors.username}
                  </Text>
                )}
              </View>

              {/* PASSWORD */}
              <View style={{ marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.Medium,
                    marginVertical: 8,
                    color: COLORS.primary,
                    marginLeft: 13,
                  }}
                >
                  Password
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: errors.password
                      ? COLORS.error
                      : COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 22,
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    placeholder="Enter your password"
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
                    {isPasswordShown == true ? (
                      <Ionicons
                        name="eye-off"
                        size={24}
                        color={COLORS.primary}
                      />
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
                      marginStart: 20,
                    }}
                  >
                    {errors.password}
                  </Text>
                )}
              </View>
            </View>

            {/* Terms and Conditons */}
            <View
              style={{
                marginBottom: 5,
                marginLeft: 13,
                justifyContent: "center",
              }}
            >
              <View style={{ flexDirection: "row", marginVertical: 6 }}>
                <Checkbox
                  value={isChecked}
                  onValueChange={setIsChecked}
                  color={isChecked ? COLORS.accent : undefined}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 13,
                    fontFamily: fonts.Medium,
                  }}
                >
                  I agree with terms the{" "}
                </Text>
                <TouchableOpacity onPress={handleTermAndConditons}>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 13,
                      fontFamily: fonts.Medium,
                    }}
                  >
                    terms and conditions.{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              style={{
                backgroundColor: COLORS.white,
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
                    color: COLORS.secondary,
                    fontSize: 15,
                    fontFamily: fonts.Bold,
                    textAlign: "center",
                  }}
                >
                  Register
                </Text>
              )}
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 15,
                marginBottom: 20,
                gap: 2,
              }}
            >
              <Text style={{ color: COLORS.black, fontFamily: fonts.Regular }}>
                Already have account?
              </Text>
              <TouchableOpacity
                onPress={() => router.navigate("/auth/sign-in")}
              >
                <Text
                  style={{ color: COLORS.white, fontFamily: fonts.SemiBold }}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    marginVertical: 10,
    marginBottom: 15,
  },
  backText: {
    fontSize: 24,
    marginLeft: 10,
    color: COLORS.secondary,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    elevation: 5,
    marginBottom: 15,
    padding: 20,
  },
});
