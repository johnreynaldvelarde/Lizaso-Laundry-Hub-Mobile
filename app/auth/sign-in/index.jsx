import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import COLORS from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../../constants/fonts";
import { login } from "../../../data/api/authApi";
import useAuth from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCheckCustomerDetails } from "../../../data/api/getApi";
import login_background from "../../../assets/images/login_background.jpg";

export default function SignIn() {
  const { userDetails, fetchUserDetails } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();
  const router = useRouter();

  const validateFields = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (value) => {
    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleLogin = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const data = {
        username: username,
        password: password,
      };

      try {
        const response = await login(data);

        if (response.success) {
          await AsyncStorage.setItem("accessToken", response.accessToken);

          await fetchUserDetails(response.accessToken);
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

  useEffect(() => {
    if (userDetails.user_type) {
      if (userDetails.user_type === "Customer") {
        const fetchDetails = async () => {
          const details = await getCheckCustomerDetails(userDetails.userId);
          if (details.success !== false) {
            const { storeIdIsNull, addressIdIsNull, isVerified } = details.data;
            if (!isVerified) {
              navigation.navigate("auth/verify_account/verify_account");
            } else if (storeIdIsNull || addressIdIsNull) {
              navigation.navigate("auth/complete/address");
            } else {
              navigation.navigate("(customer)");
            }
          } else {
            console.log(details);
          }
        };
        fetchDetails();
      } else {
        navigation.navigate("(staff)");
      }
    }
  }, [userDetails]);

  const handleForgetPassword = () => {
    navigation.navigate("auth/forget/forget", {});
  };

  return (
    <ImageBackground
      source={login_background}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["#ffffff", "#ffffff90", "#5787C8"]} // 80 here indicates opacity
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../../assets/images/lizaso_logo.png")}
                  style={styles.logo}
                />
                <Text style={styles.welcomeText}> Welcome to</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 1,
                    gap: 1,
                    marginBottom: -5,
                  }}
                >
                  <Text style={styles.lizasoText}> Lizaso</Text>
                  <Text style={styles.laundryhubText}> Laundry Hub </Text>
                </View>
              </View>

              <View style={styles.titleContainer}>
                <View style={styles.formContainer}>
                  {/* Username Field */}
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: fonts.Medium,
                        marginVertical: 8,
                        color: COLORS.primary,
                      }}
                    >
                      Username
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: 48,
                        borderColor: errors.password
                          ? COLORS.error
                          : COLORS.primary,
                        borderWidth: 1,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center", //hereeeee
                        paddingLeft: 22,
                      }}
                    >
                      <TextInput
                        placeholder="Enter your username"
                        placeholderTextColor={COLORS.grey}
                        keyboardType="default"
                        style={{ width: "100%", fontFamily: fonts.Regular }}
                        value={username}
                        onChangeText={handleInputChange("username")}
                      />
                    </View>
                    {errors.username && (
                      <Text
                        style={{
                          color: COLORS.error,
                          fontFamily: fonts.Regular,
                          fontSize: 12,
                          marginTop: 4,
                          marginStart: 10,
                        }}
                      >
                        {errors.username}
                      </Text>
                    )}
                  </View>

                  {/* Password Field */}
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: fonts.Medium,
                        marginVertical: 8,
                        color: COLORS.primary,
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
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center", //hereeeee
                        paddingLeft: 22,
                      }}
                    >
                      <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor={COLORS.grey}
                        secureTextEntry={!isPasswordShown}
                        style={{ width: "100%", fontFamily: fonts.Regular }}
                        value={password}
                        onChangeText={handleInputChange("password")}
                      />
                      <TouchableOpacity
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                        style={{ position: "absolute", right: 12 }}
                      >
                        <Ionicons
                          name={isPasswordShown ? "eye" : "eye-off"}
                          size={24}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <Text
                        style={{
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

                  <TouchableOpacity onPress={handleForgetPassword}>
                    <Text
                      style={{
                        textAlign: "right",
                        color: COLORS.primary,
                        marginVertical: 5,
                        fontFamily: fonts.Regular,
                      }}
                    >
                      Forget Password?
                    </Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <TouchableOpacity
                    onPress={handleLogin}
                    style={{
                      backgroundColor: COLORS.secondary,
                      borderRadius: 40,
                      marginTop: 10,
                      padding: 10,
                      opacity: loading ? 0.7 : 1,
                      height: 50,
                      width: 270,
                      justifyContent: "center",
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator size="large" color={COLORS.white} />
                    ) : (
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: 16,
                          fontFamily: fonts.Bold,
                          textAlign: "center",
                        }}
                      >
                        Login
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Register Link */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 5,
                gap: 2,
                marginBottom: 50,
                marginTop: -10,
              }}
            >
              <Text style={{ color: COLORS.primary, fontFamily: fonts.Medium }}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: fonts.SemiBold,
                  }}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  welcomeText: {
    fontSize: 20,
    color: COLORS.subtitle,
    textAlign: "center",
    fontFamily: fonts.Regular,
  },

  lizasoText: {
    fontSize: 24,
    color: COLORS.secondary,
    fontFamily: fonts.Bold,
  },
  laundryhubText: {
    fontSize: 24,
    color: COLORS.primary,
    fontFamily: fonts.Bold,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    height: 48,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 22,
  },
  errorBorder: {
    borderColor: "red",
  },
  titleContainer: {
    marginTop: 20,
  },
});
