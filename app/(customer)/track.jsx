import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useState } from "react";
import COLORS from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";

import OrderItem from "../../components/customer/OrderItem";
import { getLaundryTrackOrder } from "../../data/api/getApi";
import usePolling from "../../hooks/usePolling";
import { useFocusEffect } from "expo-router";
import noOrdersImage from "../../assets/images/no_data_table.jpg";
import useAuth from "../context/AuthContext";

export default function Track() {
  const { userDetails } = useAuth();

  const fetchTrackOrder = useCallback(async () => {
    const response = await getLaundryTrackOrder(userDetails.userId);
    return response.data;
  }, [userDetails.userId]);

  const {
    data: orders,
    loading,
    error,
    setIsPolling,
  } = usePolling(fetchTrackOrder, 1000);

  useFocusEffect(
    useCallback(() => {
      setIsPolling(true);

      return () => {
        setIsPolling(false);
      };
    }, [])
  );

  const renderOrderItem = ({ item, index }) => (
    <OrderItem item={item} index={index} />
  );

  return (
    <LinearGradient
      colors={["#5787C8", "#71C7DA"]}
      locations={[0, 0.8]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.5, y: 0 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Title for Laundry Items */}
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>Track Your Laundry Order</Text>
        </View>

        {/* FlatList to display multiple orders */}
        <View style={styles.bottomContainer}>
          <View style={styles.listContainer}>
            {orders.length === 0 ? (
              <View style={styles.noOrdersContainer}>
                <Image
                  source={noOrdersImage}
                  style={styles.noOrdersImage}
                  resizeMode="contain"
                />
                <Text style={styles.noOrdersText}>No laundry orders yet</Text>
              </View>
            ) : (
              <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselTitle: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.Bold,
    color: COLORS.white,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    flex: 1,
    marginBottom: 40,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    padding: 20, // Optional padding
  },
  noOrdersImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noOrdersText: {
    fontFamily: fonts.SemiBold,
    fontSize: 18,
    color: COLORS.subtitle,
    textAlign: "center",
  },
});
