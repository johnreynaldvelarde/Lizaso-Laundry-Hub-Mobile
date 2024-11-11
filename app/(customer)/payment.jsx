import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import usePolling from "../../hooks/usePolling";
import { useFocusEffect, useNavigation } from "expo-router";
import useAuth from "../context/AuthContext";
import { getPaymentHistory } from "../../data/api/getApi";
import { FontAwesome5 } from "@expo/vector-icons";
import noOrdersImage from "../../assets/images/no_data_table.jpg";

export default function Payment() {
  const { userDetails } = useAuth();
  const navigaton = useNavigation();

  const fetchPaymentHistory = useCallback(async () => {
    const response = await getPaymentHistory(userDetails.userId);
    return response.data;
  }, [userDetails.userId]);

  const {
    data: history,
    loading,
    error,
    setIsPolling,
  } = usePolling(fetchPaymentHistory, 50000);

  useFocusEffect(
    useCallback(() => {
      setIsPolling(true);

      return () => {
        setIsPolling(false);
      };
    }, [])
  );

  const handleViewRecipt = async (
    id,
    payment_method,
    base_price,
    service_name
  ) => {
    navigaton.navigate("receipt/receipt", {
      assignment_id: id,
      payment_method: payment_method,
      base_price: base_price,
      service_name: service_name,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const sortedPaymentHistory = [...history].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const groupedHistory = sortedPaymentHistory.reduce((acc, transaction) => {
    const date = formatDate(transaction.created_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);
    return acc;
  }, {});

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.paymentDate}>{item.date}</Text>
      {item.transactions.map((transaction) => (
        <View key={transaction.transaction_id} style={styles.paymentItem}>
          <View style={styles.itemTop}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{ fontFamily: fonts.SemiBold, color: COLORS.primary }}
                >
                  Status:
                </Text>

                <View
                  style={{
                    marginLeft: 5,
                    backgroundColor:
                      transaction.transaction_status === "Pending"
                        ? COLORS.error
                        : COLORS.secondary,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.white,
                      fontFamily: fonts.Medium,
                    }}
                  >
                    {transaction.transaction_status}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{ fontFamily: fonts.SemiBold, color: COLORS.primary }}
                >
                  Code:
                </Text>

                <View style={{ marginLeft: 5 }}>
                  <Text
                    style={{
                      color: COLORS.subtitle,
                      fontFamily: fonts.Medium,
                    }}
                  >
                    {transaction.transaction_code}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                handleViewRecipt(
                  transaction.assignment_id,
                  transaction.payment_method,
                  transaction.default_price,
                  transaction.service_name
                )
              }
              style={styles.iconButton}
            >
              <FontAwesome5 name="receipt" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemMiddle}>
            <Text style={styles.timeTitle}>Time:</Text>
            <Text style={styles.amountTitle}>Amount:</Text>
          </View>
          <View style={styles.itemFooter}>
            <Text style={styles.paymentTime}>
              {new Date(transaction.created_at).toLocaleTimeString()}
            </Text>
            <Text style={styles.paymentAmount}>{transaction.total_amount}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  // Prepare data in the format for FlatList
  const formattedData = Object.keys(groupedHistory).map((date) => ({
    date,
    transactions: groupedHistory[date],
  }));

  return (
    <LinearGradient
      colors={["#5787C8", "#71C7DA"]}
      locations={[0, 0.8]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.5, y: 0 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>Payment History</Text>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.listContainer}>
            {history.length === 0 ? (
              <View style={styles.noOrdersContainer}>
                <Image
                  source={noOrdersImage}
                  style={styles.noOrdersImage}
                  resizeMode="contain"
                />
                <Text style={styles.noOrdersText}>
                  You currently have no payment records
                </Text>
              </View>
            ) : (
              <FlatList
                data={formattedData}
                renderItem={renderItem}
                keyExtractor={(item) => item.date}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={100}
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
  dateGroup: {
    padding: 15,
  },
  paymentItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 5,
    padding: 15,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  paymentDate: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: COLORS.secondary,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentTime: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: COLORS.text,
  },
  paymentAmount: {
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: COLORS.text3,
  },

  timeTitle: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: COLORS.primary,
  },
  amountTitle: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: COLORS.primary,
  },
  codeTitle: {
    fontFamily: fonts.Regular,
    color: COLORS.primary,
  },
  iconButton: {
    backgroundColor: COLORS.accent,
    padding: 8,
    borderRadius: 8,
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
    fontSize: 15,
    color: COLORS.subtitle,
    textAlign: "center",
  },
});
