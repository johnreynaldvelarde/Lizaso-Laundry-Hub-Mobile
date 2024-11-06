import React from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/colors";
import { fonts } from "../../constants/fonts";

export default function Payment() {
  // Sample payment history data
  const paymentHistory = [
    { 
      id: "1", 
      date: "Yesterday", 
      time: "2:05 PM", 
      amount: "260" 
    },
    { id: "2", 
      date: "Oct 29, 2024", 
      time: "11.00 AM", 
      amount: "180" 
    },
    { id: "3", 
      date: "Oct 29, 2024", 
      time: "4:00 PM", 
      amount: "200" 
    }, 
    { id: "4", 
      date: "Oct 22, 2024", 
      time: "10:30 PM", 
      amount: "380" 
    },
    { id: "5", 
      date: "Oct 15, 2024", 
      time: "1:15 PM", 
      amount: "190" 
    },
    { id: "6", 
      date: "Oct 08, 2024", 
      time: "1:15 PM", 
      amount: "190" 
    },
    { id: "7", 
      date: "Oct 08, 2024", 
      time: "3:15 PM", 
      amount: "290" 
    },
  ];

  // Group transactions by date
  const groupedHistory = paymentHistory.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);
    return acc;
  }, {});

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.paymentDate}>{item.date}</Text>
      {item.transactions.map((transaction) => (
        <View key={transaction.id} style={styles.paymentItem}>
          <View style = {styles.itemTop}>
            <Text style={styles.timeTitle}>Time:</Text>
            <Text style={styles.amountTitle}>Amount: </Text>
          </View>
          <View style = {styles.itemFooter}>
            <Text style={styles.paymentTime}>{transaction.time}</Text>
            <Text style={styles.paymentAmount}>{transaction.amount}.00</Text>
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
          
          <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.bottomContainer}>
            <FlatList
              data={formattedData}
              renderItem={renderItem}
              keyExtractor={(item) => item.date}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            />
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
  dateGroup: {
   padding: 15,
  },
  paymentItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    elevation: 5,
   
  },
  paymentDate: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  itemTop:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginStart: 10,
    marginEnd: 10,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginStart: 10,
    marginEnd: 10,
  },
  paymentTime: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: COLORS.text3,
  },
  paymentAmount: {
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: COLORS.text3,
  },

  timeTitle:{
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: COLORS.text3,
  },
  amountTitle:{
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: COLORS.text3,
    
  }

});
