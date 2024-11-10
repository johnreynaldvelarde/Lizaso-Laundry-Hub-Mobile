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
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import COLORS from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../../constants/fonts";
import { useNavigation } from "expo-router";
import {
  updateAddressCustomer,
  updateProfile,
} from "../../../data/api/authApi";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { regions, cities, provinces } from "../../../data/countrySelection";

export default function Edit_Address() {
  const { userDetails, fetchUserDetails } = useAuth();
  const navigation = useNavigation();

  const [addressLine, setAddressLine] = useState(userDetails.header_address);
  const [country, setCountry] = useState("Philippines");
  const [region, setRegion] = useState(userDetails.sub_region);
  const [province, setProvince] = useState(userDetails.sub_province);
  const [city, setCity] = useState(userDetails.sub_city);
  const [postalCode, setPostalCode] = useState(userDetails.postal_code);
  const [latitude, setLatitude] = useState(userDetails.latitude);
  const [longitude, setLongitude] = useState(userDetails.longitude);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!addressLine) {
      newErrors.addressLine = "Address is required";
    } else if (addressLine.length < 5) {
      newErrors.addressLine = "Address must be at least 5 characters long";
    } else if (!/[a-zA-Z0-9\s,.-]/.test(addressLine)) {
      newErrors.addressLine =
        "Address can only contain letters, numbers, spaces, commas, periods, and hyphens";
    }

    if (!country) {
      newErrors.country = "Country is required";
    }

    if (!region) {
      newErrors.region = "Region is required";
    }

    if (!province) {
      newErrors.province = "Province is required";
    }

    if (!city) {
      newErrors.city = "City is required";
    }

    if (!postalCode) {
      newErrors.postalCode = "Postal Code is required";
    }

    return newErrors;
  };

  const handleInputChange = (field) => (value) => {
    switch (field) {
      case "addressLine":
        setAddressLine(value);
        break;
      case "country":
        setCountry(value);
        break;
      case "region":
        setRegion(value);
        setProvince("");
        break;
      case "province":
        setProvince(value);
        setCity("");
        break;
      case "city":
        setCity(value);
        break;
      case "postalCode":
        setPostalCode(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleUpdateAddress = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = {
        address_line: addressLine,
        country: country,
        region: region,
        province: province,
        city: city,
        postal_code: postalCode,
        latitude: latitude,
        longitude: longitude,
      };

      console.log(data);

      setLoading(true);

      try {
        const response = await updateAddressCustomer(
          userDetails.addressId,
          data
        );

        if (response.success) {
          await fetchUserDetails(await AsyncStorage.getItem("accessToken"));
          Alert.alert("Success", response.message);
        } else {
          Alert.alert("Warning", response.message);
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
              Update Address
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Address Line */}
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.Medium,
                  marginVertical: 8,
                  color: COLORS.primary,
                }}
              >
                Address
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.addressLine
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
                  placeholder="Enter your address"
                  placeholderTextColor={COLORS.grey}
                  keyboardType="default"
                  value={addressLine}
                  onChangeText={handleInputChange("addressLine")}
                  style={{ width: "100%", fontFamily: fonts.Regular }}
                />
              </View>
              {errors.addressLine && (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.error,
                    fontSize: 12,
                    marginTop: 4,
                    marginStart: 10,
                  }}
                >
                  {errors.addressLine}
                </Text>
              )}
            </View>

            {/* Country */}
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.Medium,
                  marginVertical: 8,
                  color: COLORS.primary,
                }}
              >
                Country
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.country ? COLORS.error : COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Enter your country"
                  placeholderTextColor={COLORS.grey}
                  keyboardType="default"
                  value={country}
                  onChangeText={handleInputChange("country")}
                  style={{ width: "100%", fontFamily: fonts.Regular }}
                  editable={false}
                />
              </View>
              {errors.country && (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.error,
                    fontSize: 12,
                    marginTop: 4,
                    marginStart: 10,
                  }}
                >
                  {errors.country}
                </Text>
              )}
            </View>

            {/* Region Selection */}
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.Medium,
                  marginVertical: 8,
                  color: COLORS.primary,
                }}
              >
                Region
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.region ? COLORS.error : COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <Picker
                  selectedValue={region}
                  onValueChange={(itemValue) =>
                    handleInputChange("region")(itemValue)
                  }
                  style={{ width: "100%", fontFamily: fonts.Regular }}
                >
                  <Picker.Item label="Select a region" value="" />
                  {regions.map((regionName) => (
                    <Picker.Item
                      key={regionName}
                      label={regionName}
                      value={regionName}
                    />
                  ))}
                </Picker>
              </View>
              {errors.region && (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.error,
                    fontSize: 12,
                    marginTop: 4,
                    marginStart: 10,
                  }}
                >
                  {errors.region}
                </Text>
              )}
            </View>

            {/* Province Selection */}
            {region && (
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.Medium,
                    marginVertical: 8,
                    color: COLORS.primary,
                  }}
                >
                  Province
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: errors.province
                      ? COLORS.error
                      : COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 8,
                    justifyContent: "center",
                    paddingLeft: 22,
                  }}
                >
                  <Picker
                    selectedValue={province}
                    onValueChange={(itemValue) =>
                      handleInputChange("province")(itemValue)
                    }
                    style={{ width: "100%", fontFamily: fonts.Regular }}
                  >
                    <Picker.Item label="Select a province" value="" />
                    {provinces[region]?.map((provinceName) => (
                      <Picker.Item
                        key={provinceName}
                        label={provinceName}
                        value={provinceName}
                      />
                    ))}
                  </Picker>
                </View>
                {errors.province && (
                  <Text
                    style={{
                      fontFamily: fonts.Regular,
                      color: COLORS.error,
                      fontSize: 12,
                      marginTop: 4,
                      marginStart: 10,
                    }}
                  >
                    {errors.province}
                  </Text>
                )}
              </View>
            )}

            {/* City Selection */}
            {province && (
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.Medium,
                    marginVertical: 8,
                    color: COLORS.primary,
                  }}
                >
                  City
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: errors.city ? COLORS.error : COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 8,
                    justifyContent: "center",
                    paddingLeft: 22,
                  }}
                >
                  <Picker
                    selectedValue={city}
                    onValueChange={(itemValue) =>
                      handleInputChange("city")(itemValue)
                    }
                    style={{ width: "100%", fontFamily: fonts.Regular }}
                  >
                    <Picker.Item label="Select a city" value="" />
                    {cities[province]?.map((cityName) => (
                      <Picker.Item
                        key={cityName}
                        label={cityName}
                        value={cityName}
                      />
                    ))}
                  </Picker>
                </View>
                {errors.city && (
                  <Text
                    style={{
                      fontFamily: fonts.Regular,
                      color: COLORS.error,
                      fontSize: 12,
                      marginTop: 4,
                      marginStart: 10,
                    }}
                  >
                    {errors.city}
                  </Text>
                )}
              </View>
            )}

            {/* Postal Code*/}
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.Medium,
                  marginVertical: 8,
                  color: COLORS.primary,
                }}
              >
                Postal Code
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.postalCode
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
                  placeholder="Enter the postal code"
                  placeholderTextColor={COLORS.grey}
                  keyboardType="numeric"
                  value={postalCode}
                  onChangeText={handleInputChange("postalCode")}
                  style={{ width: "100%", fontFamily: fonts.Regular }}
                />
              </View>
              {errors.postalCode && (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.error,
                    fontSize: 12,
                    marginTop: 4,
                    marginStart: 10,
                  }}
                >
                  {errors.postalCode}
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
              onPress={handleUpdateAddress}
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
                  Update Address
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
  },
});
