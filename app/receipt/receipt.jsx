import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "expo-router";
import { fonts } from "../../constants/fonts";
import COLORS from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import logo from "../../assets/images/logo_small.png";
import useAuth from "../context/AuthContext";
import usePolling from "../../hooks/usePolling";
import { getReceipt } from "../../data/api/getApi";
import { formatDateNow, getCurrentDay } from "../../constants/method";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

export default function Receipt() {
  const route = useRoute();
  const currentDay = getCurrentDay();
  const { userDetails } = useAuth();
  const navigation = useNavigation();
  const { assignment_id, base_price, payment_method, service_name } =
    route.params;

  const fetchReceipt = useCallback(async () => {
    const response = await getReceipt(assignment_id);
    return response.data;
  }, [assignment_id]);

  const {
    data: receipt,
    loading,
    error,
    setIsPolling,
  } = usePolling(fetchReceipt, 50000);

  const receiptRef = useRef();

  useFocusEffect(
    useCallback(() => {
      setIsPolling(true);

      return () => {
        setIsPolling(false);
      };
    }, [])
  );

  const downloadReceipt = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 0.8,
      });

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status === "granted") {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Success", "Receipt downloaded successfully!");
      } else {
        Alert.alert("Permission Denied", "Unable to access media library.");
      }
    } catch (error) {
      console.error("Failed to capture and save receipt", error);
      Alert.alert("Error", "Failed to download receipt. Please try again.");
    }
  };

  const relatedItems = receipt?.related_items || {
    item_ids: [],
    item_names: [],
    item_prices: [],
    quantities: [],
    related_item_totals: [],
  };

  const { item_ids, item_names, item_prices, quantities, related_item_totals } =
    relatedItems;

  return (
    <LinearGradient
      colors={["#5787C8", "#71C7DA"]}
      locations={[0, 0.8]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.5, y: 0 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Details</Text>
        </View>

        <View style={styles.bottomContainer}>
          <ScrollView
            ref={receiptRef} // Set the ref to the ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.breakdownContainer}>
              <View style={styles.storeHeader}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.storeName}>
                  Lizaso <Text style={styles.laundryHub}>Laundry Hub</Text>
                </Text>
              </View>

              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  <Text style={styles.boldText}>Customer Name: </Text>
                  {userDetails.fullname}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.boldText}>Payment Method: </Text>
                  {payment_method}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.boldText}>Date: </Text>
                  {formatDateNow()}
                </Text>
              </View>

              <View style={styles.serviceContainer}>
                <View style={styles.serviceRow}>
                  <Text style={styles.serviceHeader}>Service Type</Text>
                  <Text style={styles.serviceHeader}>Load</Text>
                  <Text style={styles.serviceHeader}>Amount</Text>
                </View>
                <View style={styles.serviceRow}>
                  <View style={styles.viewContainer}>
                    <Text style={styles.serviceText}>{service_name}</Text>
                    <Text style={styles.basePrice}>
                      Base Price:{" "}
                      <Text
                        style={{
                          fontFamily: fonts.SemiBold,
                          color:
                            receipt.isActive === 1 &&
                            receipt.valid_days.includes(currentDay)
                              ? "grey"
                              : COLORS.secondary,
                          textDecorationLine:
                            receipt.isActive === 1 &&
                            receipt.valid_days.includes(currentDay)
                              ? "line-through"
                              : "none",
                        }}
                      >
                        ₱{base_price}
                      </Text>
                    </Text>

                    {receipt.isActive === 1 &&
                      receipt.valid_days.includes(currentDay) && (
                        <Text style={styles.discountPrice}>
                          Discount Promo:{" "}
                          <Text
                            style={{
                              fontFamily: fonts.SemiBold,
                              color: COLORS.error,
                            }}
                          >
                            ₱{receipt.discount_price}
                          </Text>
                        </Text>
                      )}
                  </View>

                  <View>
                    <Text style={styles.serviceText}>{receipt.weight}</Text>
                  </View>

                  <Text style={styles.serviceText}>
                    ₱{receipt.base_total_amount}
                  </Text>
                </View>
              </View>

              <View style={styles.relatedItemsContainer}>
                <Text style={styles.relatedItemsTitle}>Related Items</Text>
                <View style={styles.relatedItemsRow}>
                  <Text style={styles.relatedItemsHeader}>Item Name</Text>
                  <Text style={styles.relatedItemsHeader}>Quantity</Text>
                  <Text style={styles.relatedItemsHeader}>Amount</Text>
                </View>

                {receipt?.related_items?.item_names?.length > 0 ? (
                  receipt.related_items.item_names.map((name, index) => (
                    <View style={styles.relatedItemsRow} key={index}>
                      <Text style={styles.relatedItemsText}>{name}</Text>
                      <Text style={styles.relatedItemsText}>
                        {receipt.related_items.quantities[index]}
                      </Text>
                      <Text style={styles.relatedItemsText}>
                        ₱{receipt.related_items.item_prices[index]}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noItemsText}>
                    No related items available
                  </Text>
                )}
              </View>

              <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmountText}>
                  Total Amount: ₱{receipt.final_total}
                </Text>
                <Text style={styles.thankYouText}>
                  Thank you for your business!
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Download Receipt Button */}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={downloadReceipt}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="download"
                size={20}
                color={COLORS.white}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.proceedButtonText}>Download Receipt</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: COLORS.white,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  breakdownContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginBottom: 20,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  storeName: {
    fontFamily: fonts.Bold,
    fontSize: 20,
    color: COLORS.secondary,
    marginLeft: 10,
  },
  laundryHub: {
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
  },
  detailsContainer: {
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailText: {
    fontFamily: fonts.Regular,
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 5,
  },
  boldText: {
    fontFamily: fonts.SemiBold,
  },
  serviceContainer: {
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  serviceHeader: {
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    color: COLORS.primary,
  },
  serviceText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: COLORS.primary,
  },
  basePrice: {
    fontFamily: fonts.Regular,
    fontSize: 10,
    color: COLORS.primary,
    textAlign: "center",
  },
  discountPrice: {
    fontFamily: fonts.Regular,
    fontSize: 10,
    color: COLORS.primary,
    textAlign: "center",
  },
  relatedItemsContainer: {
    marginVertical: 10,
  },
  relatedItemsTitle: {
    fontFamily: fonts.SemiBold,
    fontSize: 16,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 5,
  },
  relatedItemsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  relatedItemsHeader: {
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    color: COLORS.primary,
  },
  noItemsText: {
    marginTop: 10,
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
  },
  totalAmountContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  totalAmountText: {
    fontFamily: fonts.Bold,
    fontSize: 18,
    color: COLORS.secondary,
  },
  thankYouText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 5,
  },
  relatedItemsText: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: COLORS.textDark,
  },
  proceedButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  proceedButtonText: {
    fontFamily: fonts.Bold,
    color: COLORS.white,
    fontSize: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginVertical: 15,
  },
  viewContainer: {
    alignItems: "flex-start", // Aligns all content within the View to the left
  },
});
