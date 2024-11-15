import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { Portal } from "@gorhom/portal";
import { fonts } from "../../constants/fonts";
import COLORS from "../../constants/colors";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { format } from "date-fns";
import QRCode from "react-native-qrcode-svg";
import { getCurrentDay } from "../../constants/method";
import { updateByCustomerCancelRequest } from "../../data/api/putApi";

export default function OrderItem({ item, index }) {
  const navigaton = useNavigation();
  const currentDay = getCurrentDay();
  const [loading, setLoading] = useState(false);
  const [collapsedStates, setCollapsedStates] = useState(
    item.progress.map(() => true)
  );

  const toggleCollapsible = (index) => {
    const newStates = [...collapsedStates];
    newStates[index] = !newStates[index];
    setCollapsedStates(newStates);
  };

  // Going to message page
  const handleGoToMessage = async (id, name) => {
    navigaton.navigate("message/chat", {
      user_id: id,
      name: name,
    });
  };

  const handleReview = async (id) => {
    navigaton.navigate("review/review", {
      service_request_id: id,
    });
  };

  // Going to message page
  const handleViewRecipt = async (
    id,
    payment_method,
    service_default_price,
    service_name
  ) => {
    navigaton.navigate("receipt/receipt", {
      assignment_id: id,
      payment_method: payment_method,
      base_price: service_default_price,
      service_name: service_name,
    });
  };

  const handleCancelRequest = async (id) => {
    Alert.alert(
      "Cancel Request",
      "Do you want to cancel this request?",
      [
        {
          text: "No",
          onPress: () => console.log("Request not canceled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await cancelRequest(id);
            } catch (error) {
              console.error("Error canceling request:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const cancelRequest = async (id) => {
    setLoading(true);

    try {
      const response = await updateByCustomerCancelRequest(id);

      console.log(response.message);

      if (response.success) {
        console.log("Request canceled successfully");
      } else {
        console.error(response.message);
        Alert.alert("Attention", response.message);
      }
    } catch (error) {
      console.error("Error canceling request:", error);
      Alert.alert("Error", "There was an error canceling your request.");
    } finally {
      setLoading(false);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);

  const enlargeQRCode = (qrCode) => {
    setSelectedQRCode(qrCode);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedQRCode(null);
  };

  const {
    id,
    assignment_id,
    user_id,
    tracking_code,
    service_name,
    service_default_price,
    request_status,
    user_name,
    qr_code,
    payment_method,
    unread_messages,
    promo_discount_price,
    promo_is_active,
    promo_valid_days,
    promo_start_date,
    promo_end_date,
  } = item.service_request;

  return (
    <View style={styles.orderContainer}>
      <View style={styles.orderDetailsContainer}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderTrackTitle}>Tracking Number:</Text>
            <Text style={styles.orderTrackNumber}>{tracking_code}</Text>
            <Text style={styles.orderInfo}>
              Status:{" "}
              <Text
                style={{
                  fontFamily: fonts.SemiBold,
                  color:
                    request_status === "Pending Pickup"
                      ? COLORS.accent
                      : request_status === "Ongoing Pickup"
                      ? COLORS.success
                      : request_status === "Completed Pickup"
                      ? COLORS.secondary
                      : request_status === "In Laundry"
                      ? COLORS.third
                      : "#6C757D",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                {request_status}
              </Text>
            </Text>
            <Text style={styles.orderInfo}>
              Selected Service:{" "}
              <Text
                style={{
                  fontFamily: fonts.SemiBold,
                  color: COLORS.secondary,
                }}
              >
                {service_name}
              </Text>
            </Text>

            <Text style={styles.orderInfo}>
              Base Price:{" "}
              <Text
                style={{
                  fontFamily: fonts.SemiBold,
                  color:
                    promo_is_active === 1 &&
                    promo_valid_days.includes(currentDay)
                      ? "grey"
                      : COLORS.secondary,
                  textDecorationLine:
                    promo_is_active === 1 &&
                    promo_valid_days.includes(currentDay)
                      ? "line-through"
                      : "none",
                }}
              >
                ₱{service_default_price}
              </Text>
            </Text>

            {promo_is_active === 1 && promo_valid_days.includes(currentDay) && (
              <Text style={styles.orderInfo}>
                Discount Promo:{" "}
                <Text
                  style={{
                    fontFamily: fonts.SemiBold,
                    color: COLORS.error,
                  }}
                >
                  ₱{promo_discount_price}
                </Text>
              </Text>
            )}
          </View>
          <View>
            <TouchableOpacity
              style={styles.qrCodeContainer}
              onPress={() => enlargeQRCode(qr_code)}
            >
              <QRCode value={qr_code} size={60} style={styles.qrCodeImage} />
              <Text style={styles.tapToEnlarge}>Tap to Enlarge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />
        <View style={{ flexDirection: "column" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderInfo}>
              Pickup or Delivery Staff:{" "}
              <Text
                style={{
                  fontFamily: fonts.Bold,
                  color: COLORS.secondary,
                }}
              >
                {user_name}
              </Text>
            </Text>
            <Text style={styles.orderInfo}>
              Total Amount:{" "}
              {assignment_id === "Waiting for total amount..." ? (
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    color: COLORS.primary,
                  }}
                >
                  Waiting for total amount
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: fonts.Bold,
                    color: COLORS.secondary,
                  }}
                >
                  ₱{item.total_amount}
                </Text>
              )}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={[
                styles.compeletePaymentButton,
                assignment_id === "Waiting for total amount..." && {
                  opacity: 0.5,
                },
              ]}
              onPress={() =>
                handleViewRecipt(
                  assignment_id,
                  payment_method,
                  service_default_price,
                  service_name
                )
              }
              disabled={assignment_id === "Waiting for total amount..."}
            >
              <Text style={styles.paymentText}>View Receipt</Text>
            </TouchableOpacity>

            {/* Message Button with Icon and Badge */}

            <View style={styles.iconWithBadge}>
              {user_id > 0 ? (
                <>
                  {request_status === "Completed Delivery" ||
                  request_status === "Completed" ? (
                    <TouchableOpacity
                      style={styles.reviewButton}
                      onPress={() => handleReview(id)}
                    >
                      <Ionicons name="star" size={24} color={COLORS.accent} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => handleGoToMessage(user_id, user_name)}
                    >
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={24}
                        color={COLORS.secondary}
                      />
                    </TouchableOpacity>
                  )}

                  {/* Badge element: Only show if unread_messages > 0 and request_status is not "Completed Delivery" or "Completed" */}
                  {unread_messages > 0 &&
                    request_status !== "Completed Delivery" &&
                    request_status !== "Completed" && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unread_messages}</Text>
                      </View>
                    )}
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => handleCancelRequest(id)}
                  style={styles.cancelButton}
                >
                  <MaterialIcons name="cancel" size={24} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Collapsible Button inside the floating box */}
        <TouchableOpacity
          onPress={() => toggleCollapsible(index)}
          style={styles.collapsibleButton}
        >
          <Text style={styles.collapsibleText}>
            {collapsedStates[index]
              ? "Show Track Progress"
              : "Hide Track Progress"}
          </Text>
        </TouchableOpacity>

        {/* Collapsible Content */}
        <Collapsible collapsed={collapsedStates[index]}>
          <View style={styles.progressContainer}>
            {item.progress.map((stage, stageIndex) => (
              <View key={stageIndex} style={styles.progressStep}>
                <View style={styles.iconContainer}>
                  <AntDesign
                    name={stage.completed ? "checkcircle" : "closecircle"}
                    size={24}
                    color={stage.completed ? COLORS.secondary : COLORS.border}
                    style={styles.icon}
                  />

                  {stageIndex < item.progress.length - 1 && (
                    <View
                      style={[
                        styles.verticalLine,
                        stage.completed
                          ? { backgroundColor: COLORS.secondary }
                          : { backgroundColor: COLORS.border },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.stageTitle}>{stage.stage}</Text>
                  {stage.status_date && (
                    <Text style={styles.dateText}>
                      {format(
                        new Date(stage.status_date),
                        "MMMM d, yyyy, h:mm a"
                      )}
                    </Text>
                  )}
                  <Text style={styles.description}>
                    {stage.completed
                      ? stage.description
                      : stage.false_description}
                  </Text>

                  {/*                   
                  {stage.completed && stage.status_date && (
                    <Text style={styles.dateText}>
                      Completed on: {stage.status_date}
                    </Text>
                  )} */}
                </View>
              </View>
            ))}
          </View>
        </Collapsible>
      </View>
      {/* Modal for Enlarged QR Code */}
      {selectedQRCode && (
        <Portal>
          <View style={styles.overlayContainer}>
            <TouchableOpacity
              onPress={closeModal}
              style={styles.overlayBackground}
            >
              <QRCode
                value={selectedQRCode}
                size={250}
                style={styles.enlargedQRCode}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Portal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    padding: 10,
  },
  orderDetailsContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.Bold,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  orderInfo: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
    marginBottom: 5,
  },
  orderTrackTitle: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: COLORS.primary,
  },
  orderTrackNumber: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: COLORS.text3,
    marginBottom: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 15,
  },
  compeletePaymentButton: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: "center",
  },
  paymentText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: fonts.SemiBold,
  },
  messageButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  cancelButton: {
    padding: 8,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  reviewButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  iconWithBadge: {
    position: "relative",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  collapsibleButton: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  collapsibleText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: fonts.SemiBold,
  },
  progressContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    position: "relative",
  },
  iconContainer: {
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  icon: {
    marginBottom: 5,
  },
  verticalLine: {
    width: 2,
    height: "100%",
    position: "absolute",
    top: 22,
    zIndex: 0,
  },
  progressItem: {
    marginLeft: 15,
    flex: 1,
  },
  stageTitle: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: COLORS.primary,
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.Medium,
    color: COLORS.primary,
  },
  dateText: {
    fontSize: 10,
    fontFamily: fonts.Regular,
    color: COLORS.secondary,
  },

  // qr image
  qrCodeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
  qrCodeImage: {
    width: 100,
    height: 100,
  },
  tapToEnlarge: {
    fontSize: 12,
    color: "#6C757D",
    marginTop: 5,
  },

  // Tap qr image
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: COLORS.white,
  },
  overlayBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  enlargedQRCode: {
    width: 300,
    height: 300,
  },
});
