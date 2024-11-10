import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../../constants/colors";
import { fonts } from "../../../constants/fonts";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import useAuth from "../../context/AuthContext";
import { getStoreList } from "../../../data/api/getApi";
import { updateCustomerDetails } from "../../../data/api/putApi";
import { calculateDistance } from "../../../constants/method";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Store_Selection() {
  const route = useRoute();
  const { data } = route.params;
  const { userDetails, fetchUserDetails } = useAuth();
  const navigation = useNavigation();
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStoreList();
      setStore(response.data);
    };
    fetchData();
  }, []);

  const handleStoreSelect = (storeId) => {
    setSelectedStoreId((prevId) => (prevId === storeId ? null : storeId));
  };

  const renderStoreItem = ({ item }) => {
    const storeLat = parseFloat(item.latitude);
    const storeLon = parseFloat(item.longitude);

    const distance = calculateDistance(
      parseFloat(data.latitude),
      parseFloat(data.longitude),
      storeLat,
      storeLon
    );

    const isSelected = selectedStoreId === item.id;

    return (
      <TouchableOpacity
        style={[styles.storeItem, isSelected && styles.selectedItem]}
        onPress={() => handleStoreSelect(item.id)}
      >
        <View style={styles.storeInfoContainer}>
          <View>
            <Text style={[styles.storeName, isSelected && styles.selectedText]}>
              {item.store_name}
            </Text>
            <Text
              style={[styles.storeAddress, isSelected && styles.selectedText]}
            >
              {item.address_line1}
            </Text>
            <Text
              style={[styles.storeAddress1, isSelected && styles.selectedText]}
            >
              {item.city}, {item.province}
            </Text>
          </View>
        </View>
        <Text style={[styles.distanceText, isSelected && styles.selectedText]}>
          {distance} km
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!selectedStoreId) {
      Alert.alert(
        "No Store Selected",
        "Please select a store before submitting.",
        [{ text: "OK" }]
      );
      setLoading(false);
      return;
    }

    const customerData = {
      store_id: selectedStoreId,
      address_line: data.addressLine,
      country: data.country,
      region: data.region,
      province: data.province,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      postal_code: data.postal_code,
    };

    try {
      const response = await updateCustomerDetails(
        userDetails.userId,
        customerData
      );

      if (response.success) {
        await fetchUserDetails(await AsyncStorage.getItem("accessToken"));
        router.push("/auth/sign-in");
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Select a store</Text>
          <Text style={styles.subtitle}>
            Enter your address and select a store for quick laundry service!
          </Text>
        </View>

        {/* Store Selection List */}
        <View style={styles.listContainer}>
          <FlashList
            data={store}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.id}
            extraData={selectedStoreId}
            estimatedItemSize={50}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.bottomButton} onPress={handleSubmit}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 22,
  },
  listContainer: {
    flex: 1,
  },
  textContainer: {
    marginVertical: 10,
  },
  title: {
    marginTop: 15,
    fontSize: 22,
    fontFamily: fonts.Bold,
    marginVertical: 5,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.Regular,
    color: COLORS.primary,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginVertical: 10,
  },
  backText: {
    fontSize: 18,
    marginLeft: 8,
    color: COLORS.secondary,
    fontFamily: fonts.SemiBold,
  },
  storeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: COLORS.secondary,
  },
  selectedText: {
    color: COLORS.white,
  },
  storeName: {
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: COLORS.primary,
  },
  storeAddress: {
    fontSize: 14,
    fontFamily: fonts.Medium,
    color: COLORS.secondary,
  },
  storeAddress1: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: COLORS.primary,
  },
  bottomButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: fonts.Bold,
  },
  distanceText: {
    fontSize: 15,
    fontFamily: fonts.Bold,
    color: COLORS.secondary,
  },
});
