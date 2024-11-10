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
import { updateProfile } from "../../../data/api/authApi";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Edit_Profile() {
  const { userDetails, fetchUserDetails } = useAuth();
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState(userDetails.mobile_number);
  const [email, setEmail] = useState(userDetails.email);
  const [username, setUsername] = useState(userDetails.username);
  const [firstname, setFirstName] = useState(userDetails.firstname);
  const [middlename, setMiddleName] = useState(userDetails.middlename);
  const [lastname, setLastName] = useState(userDetails.lastname);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!username) {
      newErrors.username = "Username is required";
    }

    if (!firstname) {
      newErrors.firstname = "First name is required";
    }

    if (!lastname) {
      newErrors.lastname = "Last name is required";
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
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleUpdateProfile = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = {
        mobile_number: phoneNumber,
        email: email,
        username: username,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
      };

      setLoading(true);

      try {
        const response = await updateProfile(userDetails.userId, data);

        if (response.success) {
          await fetchUserDetails(await AsyncStorage.getItem("accessToken"));
          Alert.alert("Success", response.message);
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
              Edit Profile
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
                    marginStart: 10,
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
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 20,
                }}
              >
                <TextInput
                  placeholder="Enter your email address"
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
                    marginStart: 10,
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
                }}
              >
                Firstname
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.firstname ? COLORS.error : COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 20,
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
                    marginStart: 10,
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
                  paddingLeft: 20,
                }}
              >
                <TextInput
                  placeholder="Enter your middle name (if applicable)"
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
                }}
              >
                Lastname
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.lastname ? COLORS.error : COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 20,
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
                    marginStart: 10,
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
                  marginLeft: 13,
                }}
              >
                Username
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.username ? COLORS.error : COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 20,
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
                    marginStart: 10,
                  }}
                >
                  {errors.username}
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 5,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleUpdateProfile}
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
                    fontFamily: fonts.Bold,
                    textAlign: "center",
                  }}
                >
                  Update Profile
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
  container: {
    flex: 1,
    padding: 5,
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
    flex: 1,
    marginBottom: 15,
    padding: 5,
    justifyContent: "center",
  },
});
