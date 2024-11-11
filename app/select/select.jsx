import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import COLORS from "../../constants/colors";
import { route, useNavigation } from "expo-router";
import useAuth from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import { fonts } from "../../constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { createNewServiceReuqest } from "../../data/api/postApi";
import QRCode from "react-native-qrcode-svg";

export default function Select() {
  const { userDetails } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { service_id, service_name } = route.params;
  const [name, setName] = useState(userDetails.fullname);
  const [notes, setNotes] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("Cash on Delivery");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Customer name is required";
    }
    return newErrors;
  };
  const handleInputChange = (field) => (value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "notes":
        setNotes(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleSubmit = async () => {
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!selectedPayment) {
        Alert.alert("Attention", "You must select a payment method.");
        return;
      }

      const data = {
        store_id: userDetails.storeId,
        service_type_id: service_id,
        service_name: service_name,
        customer_name: name,
        notes: notes,
        payment_method: selectedPayment,
      };

      setLoading(true);

      try {
        const response = await createNewServiceReuqest(
          userDetails.userId,
          data
        );

        if (response.success) {
          setQrCodeData(response.qr_code);
          setModalVisible(true);
        } else {
          Alert.alert("Attention", response.message);
          return;
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setModalVisible(false);

    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          {/* Back Button */}
          <View style={{ marginTop: 10 }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>
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
              Service Details
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fonts.Regular,
                color: COLORS.primary,
              }}
            >
              Complete the details of service request below
            </Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.serviceBox}>
              <Text style={styles.serviceTitle}>{service_name}</Text>
            </View>

            {/* Customer Name Input */}
            <View style={{ marginBottom: 20, marginTop: 20 }}>
              <Text style={styles.paymentTitle}>Customer Name:</Text>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: errors.name ? COLORS.error : COLORS.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.grey}
                  keyboardType="default"
                  value={name}
                  onChangeText={handleInputChange("name")}
                  style={{ width: "100%", fontFamily: fonts.Regular }}
                />
              </View>
              {errors.name && (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.error,
                    fontSize: 12,
                    marginTop: 4,
                    marginStart: 10,
                  }}
                >
                  {errors.name}
                </Text>
              )}
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.paymentTitle}>Payment Method:</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    selectedPayment === "Cash on Delivery" &&
                      styles.selectedPaymentButton,
                  ]}
                  onPress={() => setSelectedPayment("Cash on Delivery")}
                >
                  <Text
                    style={[
                      styles.paymentText,
                      selectedPayment === "Cash on Delivery" &&
                        styles.selectedPaymentText,
                    ]}
                  >
                    Cash on Delivery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    selectedPayment === "GCash" && styles.selectedPaymentButton,
                  ]}
                  onPress={() => setSelectedPayment("GCash")}
                >
                  <Text
                    style={[
                      styles.paymentText,
                      selectedPayment === "GCash" && styles.selectedPaymentText,
                    ]}
                  >
                    GCash
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Additional Notes Input */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.notesLabel}>Additional Notes:</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Enter any special requests or notes here..."
                multiline
                onChangeText={handleInputChange("notes")}
              />
            </View>
          </View>
        </View>
        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={{ padding: 20 }}>
            <Text style={styles.modalText}>
              Wait for the staff to scan this QR code to update the progress of
              your laundry order
            </Text>
          </View>

          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 8,
            }}
          >
            <View style={{ borderWidth: 2, borderColor: COLORS.border }}>
              {qrCodeData && (
                <QRCode
                  value={qrCodeData}
                  size={250}
                  color="white"
                  backgroundColor={COLORS.black}
                />
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleClose()}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  container_sub: {
    flex: 1,
    marginHorizontal: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  backText: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: COLORS.secondary,
    marginLeft: 5,
  },
  buttonContainer: {
    padding: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  serviceBox: {
    backgroundColor: COLORS.secondary_light,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  serviceTitle: {
    fontFamily: fonts.Bold,
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: "center",
  },
  serviceDescription: {
    fontFamily: fonts.Regular,
    fontSize: 14,
    color: COLORS.subtitle,
    marginBottom: 15,
  },
  input: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  paymentTitle: {
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 5,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  paymentButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  selectedPaymentButton: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  paymentText: {
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    color: COLORS.primary,
  },
  selectedPaymentText: {
    color: COLORS.white,
  },
  notesLabel: {
    fontFamily: fonts.SemiBold,
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 5,
    marginTop: 10,
  },
  notesInput: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    marginBottom: 15,
    textAlign: "left", // Aligns text to the left
    textAlignVertical: "top", // Aligns text to the top for multiline
  },
  submitButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: fonts.Bold,
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalText: {
    fontFamily: fonts.Regular,
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
    padding: 10,
  },
  closeButtonText: {
    fontFamily: fonts.SemiBold,
    color: COLORS.white,
    fontSize: 16,
  },
});
