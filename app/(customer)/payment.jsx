import React from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { useRouter } from "expo-router";



export default function Payment() {
  const router = useRouter();



  // Sample payment history data
  const paymentHistory = [
    {
      id: "1",
      date: "Yesterday",
      time: "2:05 PM",
      type: "Wash",
      amount: "260",
      status: "Completed",
      referenceNumber: "1234567890",
    },
    {
      id: "2",
      date: "Oct 29, 2024",
      time: "11.00 AM",
      type: "Dry",
      amount: "180",
      status: "Pending",
      referenceNumber: "0987654321"
    },
    {
      id: "3",
      date: "Oct 22, 2024",
      time: "10:30 PM",
      type: "Dry & Fold",
      amount: "380",
      status: "Completed",
      referenceNumber: "2345678901"
    },
    {
      id: "4",
      date: "Oct 15, 2024 ",
      time: "1:15 PM",
      type: "Fold",
      amount: "190",
      status: "Failed",
      referenceNumber: "3456789012"
    },
    {
      id: "5",
      date: "Oct 08, 2024 ",
      time: "1:15 PM",
      type: "Fold",
      amount: "190",
      status: "Failed",
      referenceNumber: "4567890123"
    },
  ];

  const handlePaymentDetails = (item) => {
    router.push({
        pathname: "/view_payment/view_payment",
        params: {
            date: item.date,
            time: item.time,
            amount: item.amount,
            referenceNumber: item.referenceNumber,
        },
    });
};

  

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style = {styles.dateItems}>
      <Text style = {styles.paymentDate}>{item.date}</Text>
    <View style={styles.paymentItem}>
      <View style = {styles.itemHeader}>
      <Text styles = {styles.paymentType}>Service: {item.type}</Text>
      <Text style = {[
        styles.paymentStatus,
        item.status === "Completed"
        ? styles.statusCompleted
        :item.status === "Pending"
        ? styles.statusPending
        :styles.statusFailed,
      ]}> {item.status}
      </Text> 
      </View>
      <Text style = {styles.paymentAmount}>Amount: ₱ {item.amount}.00</Text>
      <View style = {styles.itemFooter}>
      <Text style = {styles.paymentTime}>Time: {item.time}</Text>
      <TouchableOpacity onPress={() => handlePaymentDetails(item)}>
        <Text style={{ fontSize: 12, fontFamily: fonts.SemiBold, color: COLORS.secondary, }}>
            See More
          </Text>
      </TouchableOpacity>
      </View>
      </View>
     </View>
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
      <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>Payment History</Text>
        </View>
  
        <View style={styles.bottomContainer}>
          <View style={styles.listContainer}>
            <FlatList
              data={paymentHistory}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            />
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
    backgroundColor: COLORS.background, 
  },
  listContainer: {
    flex: 1,
    marginBottom: 40,
    marginTop: 10,
  },
  paymentItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  itemHeader:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  itemFooter: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 5,
  },
  paymentType: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: COLORS.text2,
    marginBottom: 5,
  },
  paymentDate: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
    margin: 10,
  },
  paymentTime:{
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: COLORS.text2,
  },
  paymentAmount: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: COLORS.text3,
    marginBottom: 5,
  },
  paymentStatus: {
    fontSize: 16,
    fontFamily: fonts.Bold,
  },
  statusCompleted: {
    color: "green",
  },
  statusPending: {
    color: "orange",
  },
  statusFailed: {
    color: "red",
  },
});
