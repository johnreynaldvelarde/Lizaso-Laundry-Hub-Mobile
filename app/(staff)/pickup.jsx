import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { fonts } from "../../constants/fonts";
import COLORS from "../../constants/colors";
import { FlashList } from "@shopify/flash-list";
import { Portal } from "@gorhom/portal";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { timeAgo } from "../../constants/datetime";
import { useFocusEffect, useNavigation } from "expo-router";
import { getLaundryPickup, getNotification } from "../../data/api/getApi";
import {
  updateServiceRequestBackToPending,
  updateServiceRequestCancel,
  updateServiceRequestFinishiPickup,
  updateServiceRequestGetLaundry,
} from "../../data/api/putApi";
import usePolling from "../../hooks/usePolling";
import { useAuth } from "../context/AuthContext";
import CustomNotifications from "../../components/common/customNotifications";

const AnimatedIcon = () => {
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name="hourglass-outline" size={24} color={COLORS.white} />
    </Animated.View>
  );
};

export default function Pickup() {
  const { userDetails, socket } = useAuth();
  const navigation = useNavigation();
  const userData = { user_id: userDetails.userId };
  const [notificationCount, setNotificationCount] = useState(0);
  const [filter, setFilter] = useState("All");
  const bottomSheetRef = useRef(null);
  const bottomPendingSheet = useRef(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const [selectedService, setSelectedService] = useState(null);

  // #Data Section
  const fetchLaundryPickup = useCallback(async () => {
    const response = await getLaundryPickup(
      userDetails.storeId,
      userDetails.userId
    );
    return response.data;
  }, [userDetails.storeId, userDetails.userId]);

  const fetchNotification = useCallback(async () => {
    try {
      let response;
      if (userDetails.user_type === "Delivery Staff") {
        response = await getNotification(userDetails.storeId, "Delivery Staff");
      }
      if (response && response.data) {
        setNotificationCount(response.data.length);
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationCount(0);
      return [];
    }
  }, [userDetails.storeId, userDetails.user_type]);

  useFocusEffect(
    useCallback(() => {
      fetchNotification();
      if (socket) {
        const handleNotification = (data) => {
          // CustomNotifications(data.title, data.message, {});
          fetchNotification();
        };

        socket.on("notificationsModule", handleNotification);

        return () => {
          socket.off("notificationsModule", handleNotification);
        };
      }
    }, [fetchNotification, socket])
  );

  const {
    data: pickupData,
    loading,
    error,
    setIsPolling,
  } = usePolling(fetchLaundryPickup, 2000);

  useFocusEffect(
    useCallback(() => {
      setIsPolling(true);

      return () => {
        setIsPolling(false);
      };
    }, [])
  );

  const pendingCount = Array.isArray(pickupData)
    ? pickupData.filter(
        (service) => service.request_status === "Pending Pickup"
      ).length
    : 0;

  const ongoingCount = Array.isArray(pickupData)
    ? pickupData.filter(
        (service) => service.request_status === "Ongoing Pickup"
      ).length
    : 0;

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const openPendingModal = (service) => {
    setSelectedService(service);
    bottomPendingSheet.current?.expand();
  };

  const openOngoingModal = (service) => {
    setSelectedService(service);
    bottomSheetRef.current?.expand();
  };

  const closeOngoingModal = (service) => {
    setSelectedService(service);
    bottomSheetRef.current?.close();
  };

  const closePendingModal = (service) => {
    setSelectedService(service);
    bottomPendingSheet.current?.close();
  };

  // PENDING ONGOING TO COMPLETED PICKUP
  const handleFinishPickup = async (id) => {
    try {
      const response = await updateServiceRequestFinishiPickup(id);
      if (response) {
      } else {
        console.error("Failed to get request:", response.message);
      }
    } catch (error) {
      console.error("Error getting request:", error);
    } finally {
      bottomSheetRef.current?.close();
    }
  };

  //#PICKUP ONGOING TO PENDING
  const handleReturnToPending = async (id) => {
    try {
      const response = await updateServiceRequestBackToPending(id, userData);
      if (response) {
        console.log("Request back to pending successfully.");
      } else {
        console.error("Failed to get request:", response.message);
      }
    } catch (error) {
      console.error("Error getting request:", error);
    } finally {
      bottomSheetRef.current?.close();
    }
  };

  //#PICKUP PENDING TO ONGOING
  const handleGetLaundry = async (id) => {
    try {
      const response = await updateServiceRequestGetLaundry(id, userData);
      if (response) {
        console.log("Request get laundry successfully.");
      } else {
        console.error("Failed to get request:", response.message);
      }
    } catch (error) {
      console.error("Error getting request:", error);
    } finally {
      bottomPendingSheet.current?.close();
    }
  };

  //#PICKUP PENDING TO CANCEL
  const handleCancelRequest = async (id) => {
    // startLoading();
    try {
      const response = await updateServiceRequestCancel(id, userData);
      if (response) {
        console.log("Request cancelled successfully.");
      } else {
        console.error("Failed to cancel request:", response.message);
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
    } finally {
      // stopLoading();
      bottomPendingSheet.current?.close();
    }
  };

  // Going to another screen
  const handleGoToMessage = async (id, name) => {
    navigation.navigate("message/chat", {
      user_id: id,
      name: name,
    });
  };

  const handleGoToNotification = async (id) => {
    navigation.navigate("notification/notification_staff");
  };

  // Filter services based on the selected tab
  const filteredServices = pickupData.filter((service) => {
    if (filter === "All") {
      return (
        service.request_status === "Pending Pickup" ||
        service.request_status === "Ongoing Pickup"
      );
    }
    if (filter === "Nearest") {
      return (
        service.request_status === "Pending Pickup" ||
        service.request_status === "Ongoing Pickup"
      );
    }
    if (filter === "Cancel") return service.request_status === "Canceled";
    return true;
  });

  const sortedServices = filteredServices.sort((a, b) => {
    if (filter === "All") {
      if (
        a.request_status === "Ongoing Pickup" &&
        b.request_status !== "Ongoing Pickup"
      ) {
        return -1;
      }
      if (
        a.request_status !== "Ongoing Pickup" &&
        b.request_status === "Ongoing Pickup"
      ) {
        return 1;
      }
      return new Date(a.request_date) - new Date(b.request_date);
    }

    if (filter === "Nearest") {
      const distanceA = parseFloat(a.distance);
      const distanceB = parseFloat(b.distance);
      return distanceA - distanceB;
    }

    return new Date(a.request_date) - new Date(b.request_date);
  });

  const renderItem = ({ item }) => {
    let iconName;
    let backgroundColor;
    let iconComponent;
    let statusText;

    if (item.request_status === "Pending Pickup") {
      iconName = "time-outline";
      backgroundColor = COLORS.accent;
      iconComponent = (
        <Ionicons name={iconName} size={24} color={COLORS.white} />
      );
      statusText = "Pending";
    } else if (item.request_status === "Ongoing Pickup") {
      backgroundColor = COLORS.success;
      iconComponent = <AnimatedIcon />;
      statusText = "Ongoing";
    } else if (item.request_status === "Cancel") {
      iconName = "book-cancel-outline";
      iconComponent = (
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={COLORS.white}
        />
      );
      backgroundColor = COLORS.error;
      statusText = "Cancel";
    }

    return (
      <Pressable
        style={styles.itemContainer}
        onPress={() => {
          if (item.request_status === "Pending Pickup") {
            openPendingModal(item);
          } else if (item.request_status === "Ongoing Pickup") {
            openOngoingModal(item);
          } else {
          }
        }}
        activeOpacity={
          item.request_status === "Pending Pickup" ||
          item.request_status === "Ongoing Pickup"
            ? 0.2
            : 1
        }
      >
        <View style={styles.itemDetails}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.customerText}>{item.customer_fullname}</Text>
              <Text style={styles.itemText}>{item.service_name}</Text>
              <Text style={styles.locationText}>{item.address_line}</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "flex-start", gap: 2 }}
            >
              {item.request_status !== "Canceled" &&
                item.request_status !== "Pending Pickup" && (
                  <View style={{ position: "relative" }}>
                    <TouchableOpacity
                      onPress={() =>
                        handleGoToMessage(
                          item.customer_id,
                          item.customer_fullname
                        )
                      }
                      style={[styles.button, styles.messageButton]}
                    >
                      <Ionicons
                        name="chatbubble-ellipses"
                        size={24}
                        color={COLORS.primary}
                      />
                      {item.unread_messages > 0 && (
                        <View style={styles.badge}>
                          <Text
                            style={[
                              styles.badgeText,
                              { fontSize: item.unread_messages > 99 ? 10 : 12 }, // Adjust font size based on the unread count
                            ]}
                          >
                            {item.unread_messages > 99
                              ? "99+"
                              : item.unread_messages}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              <View style={{ alignItems: "center" }}>
                <View style={[styles.button, { backgroundColor }]}>
                  {iconComponent}
                </View>
                <Text
                  style={{
                    fontFamily: fonts.Regular,
                    fontSize: 12,
                    color: COLORS.primary,
                  }}
                >
                  {statusText}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <View style={styles.requestStatusContainer}>
              <Text style={styles.labelText}>Request Date</Text>
              <View style={styles.dateContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={COLORS.secondary}
                  style={{ paddingRight: 5 }}
                />
                <Text style={styles.dateText}>
                  {new Date(item.request_date).toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.requestStatusContainer}>
              <Text style={styles.labelText}>Distance</Text>
              <View style={styles.statusContainer}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={COLORS.success}
                  style={{ paddingRight: 2 }}
                />
                <Text style={styles.statusText}>{item.distance}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={["#5787C8", "#71C7DA"]}
      locations={[0, 0.8]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.5, y: 0 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Upper Design */}
        <View style={{ marginBottom: 1, marginStart: 20, marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
              paddingRight: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: fonts.SemiBold,
                  fontSize: 18,
                  color: COLORS.white,
                }}
              >
                {userDetails.fullname}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5
                  name="store"
                  size={15}
                  color={COLORS.white}
                  style={{ marginRight: 5 }} // space between icon and text
                />
                <Text
                  style={{
                    fontFamily: fonts.Medium,
                    fontSize: 15,
                    color: COLORS.white,
                  }}
                >
                  {userDetails.storeName}
                </Text>
              </View>
            </View>

            {/* Notification Bell Icon */}
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                onPress={handleGoToNotification}
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.white,
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <Ionicons
                  name="notifications-sharp"
                  size={24}
                  color={COLORS.white}
                />
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text
                      style={[
                        styles.badgeText,
                        { fontSize: notificationCount > 99 ? 10 : 12 },
                      ]}
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Design */}
        <View style={styles.listContainer}>
          {/* Upper */}
          <View style={{ marginBottom: 15, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: fonts.Bold,
                fontSize: 20,
                color: COLORS.primary,
              }}
            >
              Laundry Pickup
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
                marginTop: 5,
                gap: 15,
              }}
            >
              {/*Pending Design*/}
              <View
                style={{
                  height: 80,
                  width: "45%",
                  backgroundColor: "#fde4d3",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#ff7043",
                  justifyContent: "center",
                  alignItems: "center",
                  // Shadow Section
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.5,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.Bold,
                      fontSize: 24,
                      color: "#ff7043",
                    }}
                  >
                    {pendingCount}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.Medium,
                      fontSize: 16,
                      color: "#ff7043",
                      marginTop: 2,
                    }}
                  >
                    Pending
                  </Text>
                </View>
              </View>
              {/*Ongoing Design*/}
              <View
                style={{
                  height: 80,
                  width: "45%",
                  backgroundColor: "#e4f8e4",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#4caf50",
                  justifyContent: "center",
                  alignItems: "center",
                  // Shadow Section
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.5,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.Bold,
                      fontSize: 24,
                      color: "#4caf50",
                    }}
                  >
                    {ongoingCount}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.Medium,
                      fontSize: 16,
                      color: "#4caf50",
                      marginTop: 2,
                    }}
                  >
                    Ongoing
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, filter === "All" && styles.activeTab]}
              onPress={() => setFilter("All")}
            >
              <Text
                style={[
                  styles.tabText,
                  filter === "All" && styles.activeTabText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, filter === "Nearest" && styles.activeTab]}
              onPress={() => setFilter("Nearest")}
            >
              <Text
                style={[
                  styles.tabText,
                  filter === "Nearest" && styles.activeTabText,
                ]}
              >
                Nearest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, filter === "Cancel" && styles.activeTab]}
              onPress={() => setFilter("Cancel")}
            >
              <Text
                style={[
                  styles.tabText,
                  filter === "Cancel" && styles.activeTabText,
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <FlashList
              data={sortedServices}
              renderItem={renderItem}
              keyExtractor={(item) => item.request_id.toString()}
              contentContainerStyle={{ paddingBottom: 60 }}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={100}
            />
            {/* {loading && pickupData.length ? (
              <ActivityIndicator size="large" color={COLORS.secondary} />
            ) : error ? (
              <ActivityIndicator size="large" color={COLORS.secondary} />
            ) : !pickupData.length ? (
              <Text style={{ textAlign: "center", color: COLORS.secondary }}>
                No Data
              </Text>
            ) : (
              
            )} */}
          </View>
        </View>
        {/* For Pending */}
        <Portal>
          <BottomSheet
            ref={bottomPendingSheet}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backgroundStyle={{ backgroundColor: COLORS.white }}
            handleIndicatorStyle={{ backgroundColor: COLORS.primary }}
            backdropComponent={renderBackdrop}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Pending Pickup</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closePendingModal}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={COLORS.secondary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                marginStart: 20,
                marginEnd: 20,
                marginTop: 20,
              }}
            >
              <Text style={{ fontFamily: fonts.SemiBold, fontSize: 16 }}>
                Customer Details
              </Text>
              <Text
                style={{
                  fontFamily: fonts.SemiBold,
                  fontSize: 15,
                  color: "white",
                  backgroundColor: COLORS.accent,
                  borderRadius: 15,
                  paddingHorizontal: 20,
                }}
              >
                {selectedService?.service_name || "No Service Selected"}
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.divider,
                  borderRadius: 10,
                  paddingTop: 10,
                }}
              >
                <View>
                  {selectedService && (
                    <>
                      <View style={{ paddingStart: 20, marginBottom: 10 }}>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Text
                            style={{
                              fontFamily: fonts.Bold,
                              fontSize: 14,
                              color: COLORS.text3,
                            }}
                          >
                            Customer:
                          </Text>
                          <Text
                            style={{
                              fontFamily: fonts.Medium,
                              fontSize: 14,
                              color: COLORS.primary,
                            }}
                          >
                            {selectedService.customer_fullname}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Text
                            style={{
                              fontFamily: fonts.Bold,
                              fontSize: 14,
                              color: COLORS.text3,
                            }}
                          >
                            Location:
                          </Text>
                          <Text
                            style={{
                              fontFamily: fonts.Medium,
                              fontSize: 14,
                              color: COLORS.secondary,
                              flexShrink: 1,
                              flexWrap: "wrap",
                              maxWidth: "80%",
                            }}
                          >
                            {selectedService.address_line}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Text
                            style={{
                              fontFamily: fonts.Bold,
                              fontSize: 14,
                              color: COLORS.text3,
                            }}
                          >
                            Distance:
                          </Text>
                          <Text
                            style={{
                              fontFamily: fonts.Medium,
                              fontSize: 14,
                              color: COLORS.success,
                            }}
                          >
                            {selectedService.distance}
                          </Text>
                        </View>
                      </View>
                      {/* Divider */}
                      <View
                        style={{
                          height: 1,
                          backgroundColor: "#ddd",
                          width: "100%",
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: COLORS.secondary,
                          borderRadius: 20,
                          marginTop: 10,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          maxWidth: "90%",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.Medium,
                            color: COLORS.white,
                            fontSize: 12,
                          }}
                        >
                          {timeAgo(selectedService.request_date)}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: "center",
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.Medium,
                            color: COLORS.primary,
                            fontSize: 10,
                          }}
                        >
                          Waiting for confirmation
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>

              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 10,
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: COLORS.light,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                    onPress={() =>
                      handleCancelRequest(selectedService.request_id)
                    }
                  >
                    <Text
                      style={{
                        fontFamily: fonts.SemiBold,
                        fontSize: 16,
                        color: COLORS.black,
                      }}
                    >
                      Cancel request
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.finishButton}
                    onPress={() => handleGetLaundry(selectedService.request_id)}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.SemiBold,
                        fontSize: 16,
                        color: COLORS.white,
                      }}
                    >
                      Get the laundry
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BottomSheet>
        </Portal>
        {/* For Ongoing */}
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backgroundStyle={{
              backgroundColor: COLORS.white,
              borderRadius: 20,
            }}
            handleIndicatorStyle={{ backgroundColor: COLORS.primary }}
            backdropComponent={renderBackdrop}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Ongoing Pickup</Text>
              <TouchableOpacity
                onPress={closeOngoingModal}
                style={styles.closeButton}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={COLORS.secondary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginStart: 20,
                marginEnd: 20,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.SemiBold,
                  fontSize: 16,
                  color: COLORS.text3,
                }}
              >
                Customer Details
              </Text>
              <Text
                style={{
                  fontFamily: fonts.SemiBold,
                  fontSize: 15,
                  color: "white",
                  backgroundColor: COLORS.success,
                  borderRadius: 15,
                  paddingHorizontal: 20,
                  paddingVertical: 2,
                  maxWidth: "50%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {selectedService?.service_name || "No Service Selected"}
              </Text>
            </View>

            <View style={styles.contentContainer}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.divider,
                  borderRadius: 10,
                  paddingTop: 10,
                }}
              >
                <View>
                  {selectedService && (
                    <>
                      <View style={{ paddingStart: 20, marginBottom: 10 }}>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Text
                            style={{
                              fontFamily: fonts.Bold,
                              fontSize: 14,
                              color: COLORS.text3,
                            }}
                          >
                            Customer:
                          </Text>
                          <Text
                            style={{
                              fontFamily: fonts.Medium,
                              fontSize: 14,
                              color: COLORS.primary,
                            }}
                          >
                            {selectedService.customer_fullname}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Text
                            style={{
                              fontFamily: fonts.Bold,
                              fontSize: 14,
                              color: COLORS.text3,
                            }}
                          >
                            Location:
                          </Text>
                          <Text
                            style={{
                              fontFamily: fonts.Medium,
                              fontSize: 14,
                              color: COLORS.secondary,
                              flexShrink: 1,
                              flexWrap: "wrap",
                              maxWidth: "80%",
                            }}
                          >
                            {selectedService.address_line}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: "#ddd",
                          width: "100%",
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: COLORS.secondary,
                          borderRadius: 20,
                          marginTop: 10,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          maxWidth: "90%",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.Medium,
                            color: COLORS.white,
                            fontSize: 12,
                          }}
                        >
                          {timeAgo(selectedService.request_date)}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: "center",
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.Medium,
                            color: COLORS.primary,
                            fontSize: 10,
                          }}
                        >
                          Waiting for Pickup
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
              {/* Bottom Button */}
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 10,
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: COLORS.light,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                    onPress={() =>
                      handleReturnToPending(selectedService.request_id)
                    }
                  >
                    <Text
                      style={{
                        fontFamily: fonts.SemiBold,
                        fontSize: 16,
                        color: COLORS.black,
                      }}
                    >
                      Return to pending
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.finishButton}
                    onPress={() =>
                      handleFinishPickup(selectedService.request_id)
                    }
                  >
                    <Text
                      style={{
                        fontFamily: fonts.SemiBold,
                        fontSize: 16,
                        color: COLORS.white,
                      }}
                    >
                      Finish Pickup
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BottomSheet>
        </Portal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: fonts.SemiBold,
    fontSize: 18,
    color: COLORS.primary,
  },
  closeButton: {
    backgroundColor: COLORS.light,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
  },
  finishButton: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    alignItems: "center",
    width: "55%",
  },
  container: {
    flex: 1,
  },
  firstContainer: {
    padding: 16,
  },
  listContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 20,
    // Shadow Section
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.Bold,
    marginBottom: 16,
    color: "#333",
  },
  itemContainer: {
    padding: 18,
    backgroundColor: COLORS.white,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
  },
  itemDetails: {
    flexDirection: "column",
    width: "100%",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  customerText: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  itemText: {
    fontSize: 12,
    fontFamily: fonts.Medium,
    color: COLORS.primary,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 5,
    width: "100%",
  },
  requestStatusContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  dateContainer: {
    flexDirection: "row",
  },
  statusContainer: {
    flexDirection: "row",
  },
  labelText: {
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: COLORS.primary,
  },
  dateText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: COLORS.black,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: COLORS.primary,
  },
  tabContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginBottom: 12,
    gap: 12,
    alignItems: "center",
  },
  tab: {
    flex: 1,
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },

  tabText: {
    fontSize: 15,
    color: COLORS.secondary,
    fontFamily: fonts.SemiBold,
  },

  activeTabText: {
    color: COLORS.white,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  messageButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 5,
  },
  badge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: COLORS.message,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
