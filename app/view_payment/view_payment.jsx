import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";

export default function View_Payment() {
    const navigation = useNavigation();
    const route = useRoute();

    // Destructure parameters directly from `route.params`
    const { date, time, amount, referenceNumber } = route.params;

    const TransactionImage = {
        forget: require("@/assets/images/td_icon.png"),
    };

    return (
        <LinearGradient
            colors={["#5787C8", "#71C7DA"]}
            locations={[0, 0.8]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.5, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={30} color={COLORS.white} />
                        <Text style={styles.headerText}>Transaction Details</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.bottomContainer}>
                        <View style={styles.transacIcon}>
                            <Image source={TransactionImage.forget} style={styles.image} />
                        </View>
                            <View style={styles.detailsContainer}>
                            <View style = {styles.headerContainer}>
                                    <Text style = {styles.headTitle}>Transfer from </Text>
                                    <Text style = {styles.customerNumber}>09123456789</Text>
                                    <Text style = {styles.headTo}>to</Text>
                                    <Text style = {styles.laundryNumber}>09234567890</Text>
                            </View>
                            
                                    <View style={styles.dateItem}> 
                                        <Text style={styles.date}>Date:</Text>
                                        <Text style= {styles.transactionDate}> {date}</Text>
                                    </View>

                                    <View style = {styles.timeItem}>
                                        <Text style={styles.time}>Time:</Text>
                                        <Text style={styles.transactionTime}>{time}</Text>
                                    </View>
                                    
                                    <View style = {styles.amountItem}>
                                        <Text style={styles.amount}>Amount:  </Text>
                                        <Text style={styles.transactionAmount}> ₱ {amount}.00</Text>
                                    </View>

                                    <View style = {styles.referenceItem}>
                                    <Text style={styles.ref}>Reference Number: </Text> 
                                    <Text style={styles.transactionRef}>{referenceNumber}</Text> 
                                    </View>
                                    
                            </View>
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
  bottomContainer: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginVertical: 10,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.Bold,
    color: COLORS.white,
    marginStart: 60,
  },
  headerContainer:{
    backgroundColor: COLORS.white,
    padding: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  headTitle:{
    fontSize: 18,
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: fonts.Bold,
  },
  customerNumber:{
    fontSize: 18,
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: fonts.Bold,
  },
  headTo:{
    fontSize: 18,
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: fonts.Bold,
  },
  laundryNumber:{
    fontSize: 18,
    textAlign: "center",
    color: COLORS.primary,
    fontFamily: fonts.Bold,
  },
  date: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
  },
  transactionDate:{
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
},
time:{
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
},
transactionTime:{
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
},
amount:{
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
},

transactionAmount:{
    fontSize: 18,
    textAlign: "left",
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
},
ref:{
    fontSize: 18,
    textAlign: "left",
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
},
transactionRef:{
    fontSize: 18,
    textAlign: "left",
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
},
image: {
    width: "30%",
    height: 100,
    resizeMode: "contain",
    marginStart: 118,
    marginTop: 20,
  },

detailsContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 100,
},
borderLine: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
},
dateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    
},
timeItem:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
},
amountItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
},
referenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 30,
},
});
