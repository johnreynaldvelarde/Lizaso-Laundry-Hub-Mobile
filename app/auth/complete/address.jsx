import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import COLORS from "../../../constants/colors";
import { fonts } from "../../../constants/fonts";
import { useNavigation, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { cities, provinces, regions } from "../../../data/countrySelection";
import * as Location from "expo-location";

export default function Address() {
  const { userDetails } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  const [addressLine, setAddressLine] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const backAction = () => {
      // Prevent the back action
      return true;
    };

    // Add the listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup the listener
    return () => backHandler.remove();
  }, []);

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
    // Update state based on the field
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

    // Clear errors related to the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const handleCompleteAddressAndGotoSelectionStore = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const location = await getCurrentLocation();

      if (!location) {
        setLoading(false);
        return;
      }

      const data = {
        addressLine: addressLine,
        country: country,
        region: region,
        province: province,
        city: city,
        postal_code: postalCode,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      try {
        navigation.navigate("auth/complete/store_selection", { data });
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{
                marginTop: 15,
                fontSize: 22,
                fontFamily: fonts.Bold,
                marginVertical: 12,
                color: COLORS.primary,
              }}
            >
              Enter Your Address and Location
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fonts.Regular,
                color: COLORS.primary,
              }}
            >
              Enter your address and select a store for quick laundry service!
            </Text>
          </View>

          {/* Address Line */}
          <View style={{ marginBottom: 12 }}>
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
                borderColor: errors.addressLine ? COLORS.error : COLORS.primary,
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
                  borderColor: errors.province ? COLORS.error : COLORS.primary,
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
                borderColor: errors.postalCode ? COLORS.error : COLORS.primary,
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

          <TouchableOpacity
            onPress={handleCompleteAddressAndGotoSelectionStore}
            disabled={loading}
            style={{
              backgroundColor: COLORS.secondary,
              marginBottom: 20,
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
                Next
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
});
