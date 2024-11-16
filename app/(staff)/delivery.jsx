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
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { fonts } from "../../constants/fonts";
import COLORS from "../../constants/colors";
import { FlashList } from "@shopify/flash-list";
import { Portal } from "@gorhom/portal";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { timeAgo } from "../../constants/datetime";
import { useFocusEffect } from "expo-router";
import { getLaundryDelivery } from "../../data/api/getApi";
import usePolling from "../../hooks/usePolling";
import useAuth from "../context/AuthContext";
import { useHandleGoToMessage } from "../../components/method/useHandleGoToMessage";
import { Styles } from "../style/deliveryStyle";
import { ReadyBottomSheet } from "../../components/staff/ReadyBottomSheet";
import {
  updateServiceRequestOngoingDelivery,
  updateServiceRequestReadyDelivery,
} from "../../data/api/putApi";

export default function Delivery() {
  const { userDetails } = useAuth();
  const handleGoToMessage = useHandleGoToMessage();
  const [filter, setFilter] = useState("All");
  const bottomReadyDeliverySheet = useRef(null);
  const bottomOngoingSheet = useRef(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const [selectedService, setSelectedService] = useState([]);
  const [isloading, setisLoading] = useState(false);

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

  // #Data Section
  const fetchLaundryDelivery = useCallback(async () => {
    const response = await getLaundryDelivery(
      userDetails.storeId,
      userDetails.userId
    );
    return response.data;
  }, [userDetails.storeId, userDetails.userId]);

  const {
    data: deliveryData,
    loading,
    error,
    setIsPolling,
  } = usePolling(fetchLaundryDelivery, 2000);

  useFocusEffect(
    useCallback(() => {
      setIsPolling(true);

      return () => {
        setIsPolling(false);
      };
    }, [])
  );

  const readyCount = Array.isArray(deliveryData)
    ? deliveryData.filter(
        (service) => service.request_status === "Ready for Delivery"
      ).length
    : 0;

  const ongoingCount = Array.isArray(deliveryData)
    ? deliveryData.filter(
        (service) => service.request_status === "Out for Delivery"
      ).length
    : 0;

  // Filter services based on the selected tab
  const filteredServices = deliveryData.filter((service) => {
    if (filter === "All") {
      return (
        service.request_status === "Ready for Delivery" ||
        service.request_status === "Out for Delivery"
      );
    }
    if (filter === "Nearest") {
      return (
        service.request_status === "Ready for Delivery" ||
        service.request_status === "Out for Delivery"
      );
    }
    if (filter === "Attempted Delivery")
      return service.request_status === "Attempted Delivery";
    return true;
  });

  const sortedServices = filteredServices.sort((a, b) => {
    if (filter === "All") {
      if (
        a.request_status === "Out for Delivery" &&
        b.request_status !== "Out for Delivery"
      ) {
        return -1;
      }
      if (
        a.request_status !== "Out for Delivery" &&
        b.request_status === "Out for Delivery"
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

  // For Modal Ready Delivery
  const openReadyDeliveryModal = (service) => {
    setSelectedService(service);
    bottomReadyDeliverySheet.current?.expand();
  };

  const openOngoingModal = (service) => {
    setSelectedService(service);
    bottomOngoingSheet.current?.expand();
  };
  const closeOngoingModal = () => {
    bottomOngoingSheet.current?.close();
  };

  const closeReadyDeliveryModal = () => {
    bottomReadyDeliverySheet.current?.close();
  };

  const handleGotoFinishDelivery = (service) => {
    setSelectedService(service);
  };

  const handleGetReadyDelivery = async (id) => {
    setisLoading(true);
    try {
      const response = await updateServiceRequestReadyDelivery(id);
      if (response && response.success) {
        bottomReadyDeliverySheet.current?.close();
      } else {
      }
    } catch (error) {
      console.error("Error getting request:", error.message || error);
    } finally {
      // Ensure this is only called once
      if (bottomReadyDeliverySheet.current) {
        bottomReadyDeliverySheet.current.close();
      }
      setisLoading(false); // Reset the loading state after the process finishes
    }
  };

  const handleFinishDelivery = async (id) => {
    setisLoading(true);
    try {
      const response = await updateServiceRequestOngoingDelivery(id);
      if (response && response.success) {
        // Assuming `response.success` is a success indicator
        bottomOngoingSheet.current?.close();
      } else {
      }
    } catch (error) {
      console.error("Error finishing delivery:", error.message || error);
    } finally {
      // Ensure this is only called once, even if there's an error
      if (bottomOngoingSheet.current) {
        bottomOngoingSheet.current.close();
      }
      setisLoading(false); // Reset the loading state
    }
  };

  const renderItem = ({ item }) => {
    let iconName;
    let backgroundColor;
    let iconComponent;

    if (item.request_status === "Ready for Delivery") {
      iconName = "time-outline";
      backgroundColor = COLORS.accent;
      iconComponent = (
        <Ionicons name={iconName} size={24} color={COLORS.white} />
      );
      statusText = "Ready for delivery";
    } else if (item.request_status === "Out for Delivery") {
      iconName = "truck-delivery-outline";
      iconComponent = (
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={COLORS.white}
        />
      );
      backgroundColor = COLORS.success;
      // iconComponent = <AnimatedIcon />;
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
    }

    return (
      <Pressable
        style={Styles.itemContainer}
        onPress={() => {
          if (item.request_status === "Ready for Delivery") {
            openReadyDeliveryModal(item);
          } else if (item.request_status === "Out for Delivery") {
            openOngoingModal(item);
          } else {
          }
        }}
        activeOpacity={
          item.request_status === "Ready for Delivery" ||
          item.request_status === "Out for Delivery"
            ? 0.2
            : 1
        }
      >
        <View style={Styles.itemDetails}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={Styles.customerText}>{item.customer_fullname}</Text>
              <Text style={Styles.locationText}>{item.address_line}</Text>
              {/* <Text style={Styles.itemText}>{item.payment_method}</Text> */}
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
                      style={[Styles.button, Styles.messageButton]}
                    >
                      <Ionicons
                        name="chatbubble-ellipses"
                        size={24}
                        color={COLORS.primary}
                      />
                      {item.unread_messages > 0 && (
                        <View style={Styles.badge}>
                          <Text
                            style={[
                              Styles.badgeText,
                              { fontSize: item.unread_messages > 99 ? 10 : 12 },
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
                <View style={[Styles.button, { backgroundColor }]}>
                  {iconComponent}
                </View>
                <View style={{ alignItems: "center" }}>
                  {item.request_status === "Ready for Delivery" && (
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: fonts.Regular,
                          fontSize: 12,
                          color: COLORS.primary,
                        }}
                      >
                        Ready for
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.Regular,
                          fontSize: 12,
                          color: COLORS.primary,
                          marginTop: -6, // Adjust this value to reduce the gap
                        }}
                      >
                        delivery
                      </Text>
                    </View>
                  )}
                  {item.request_status === "Out for Delivery" && (
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: fonts.Regular,
                          fontSize: 12,
                          color: COLORS.primary,
                        }}
                      >
                        On
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.Regular,
                          fontSize: 12,
                          color: COLORS.primary,
                          marginTop: -6,
                        }}
                      >
                        delivery
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View style={Styles.divider} />
          <View style={Styles.rowBetween}>
            <View style={Styles.requestStatusContainer}>
              <Text style={Styles.labelText}>Payment Method</Text>
              <View style={Styles.dateContainer}>
                <MaterialIcons
                  name="payments"
                  size={18}
                  color={COLORS.secondary}
                  style={{ paddingRight: 5 }}
                />
                <Text style={Styles.dateText}>
                  {/* {new Date(item.request_date).toLocaleString()} */}
                  {item.payment_method}
                </Text>
              </View>
            </View>
            <View style={Styles.requestStatusContainer}>
              <Text style={Styles.labelText}>Distance</Text>
              <View style={Styles.statusContainer}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={COLORS.success}
                  style={{ paddingRight: 2 }}
                />
                <Text style={Styles.statusText}>{item.distance}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={Styles.container}>
      {/* Upper Design */}
      <View style={{ padding: 2 }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.Bold,
              fontSize: 25,
              color: COLORS.secondary,
            }}
          >
            Laundry Delivery
          </Text>
        </View>

        <View style={Styles.container_header}>
          {/* Ready for Delivery */}
          <View style={[Styles.card, Styles.readyCard]}>
            <Text style={[Styles.cardTitle, Styles.readyText]}>
              Ready for Delivery
            </Text>
            <Text style={[Styles.cardCount, Styles.readyText]}>
              {readyCount}
            </Text>
          </View>

          {/* Ongoing Delivery */}
          <View style={[Styles.card, Styles.ongoingCard]}>
            <Text style={[Styles.cardTitle, Styles.ongoingText]}>
              Ongoing Delivery
            </Text>
            <Text style={[Styles.cardCount, Styles.ongoingText]}>
              {ongoingCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Design */}
      <View style={Styles.listContainer}>
        <View style={Styles.tabContainer}>
          <TouchableOpacity
            style={[Styles.tab, filter === "All" && Styles.activeTab]}
            onPress={() => setFilter("All")}
          >
            <Text
              style={[Styles.tabText, filter === "All" && Styles.activeTabText]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Styles.tab, filter === "Nearest" && Styles.activeTab]}
            onPress={() => setFilter("Nearest")}
          >
            <Text
              style={[
                Styles.tabText,
                filter === "Nearest" && Styles.activeTabText,
              ]}
            >
              Nearest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              Styles.tab,
              filter === "Attempted Delivery" && Styles.activeTab,
            ]}
            onPress={() => setFilter("Attempted Delivery")}
          >
            <Text
              style={[
                Styles.tabText,
                filter === "Return" && Styles.activeTabText,
              ]}
            >
              Return
            </Text>
          </TouchableOpacity>
        </View>
        <FlashList
          data={sortedServices}
          renderItem={renderItem}
          keyExtractor={(item) => item.request_id.toString()}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
        />
      </View>

      {/* For Ready for delivery */}
      <Portal>
        <BottomSheet
          ref={bottomReadyDeliverySheet}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: COLORS.white }}
          handleIndicatorStyle={{ backgroundColor: COLORS.primary }}
          backdropComponent={renderBackdrop}
        >
          {/* Header */}
          <View style={Styles.headerContainer}>
            <Text style={Styles.headerTitle}>Ready for Delivery</Text>

            <TouchableOpacity
              style={Styles.closeButton}
              onPress={closeReadyDeliveryModal}
            >
              <MaterialIcons name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={Styles.divider} />

          {/* Content */}
          <View style={Styles.contentContainer}>
            <View style={Styles.detailsCard}>
              {/* Customer Details */}
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Customer Name:</Text>
                <Text style={Styles.value}>
                  {selectedService.customer_fullname}
                </Text>
              </View>
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Address:</Text>
                <Text style={Styles.value}>{selectedService.address_line}</Text>
              </View>
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Service Name:</Text>
                <Text style={Styles.value}>{selectedService.service_name}</Text>
              </View>
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Payment Method:</Text>
                <Text style={Styles.value}>
                  {selectedService.payment_method}
                </Text>
              </View>
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Distance:</Text>
                <Text style={Styles.value}>{selectedService.distance}</Text>
              </View>
              {/* <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Total Price:</Text>
                <Text style={Styles.success}>
                  ₱{selectedService.default_price}
                </Text>
              </View> */}
            </View>
          </View>
          {/* Button Bottom */}
          <View style={Styles.buttonContainer}>
            <TouchableOpacity
              style={Styles.finishButton}
              onPress={() => handleGetReadyDelivery(selectedService.request_id)}
            >
              {isloading ? (
                <ActivityIndicator size="large" color={COLORS.white} />
              ) : (
                <Text style={Styles.submitButtonText}>Proceed to delivery</Text>
              )}
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </Portal>

      {/* For Ongoing */}
      <Portal>
        <BottomSheet
          ref={bottomOngoingSheet}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: COLORS.white }}
          handleIndicatorStyle={{ backgroundColor: COLORS.primary }}
          backdropComponent={renderBackdrop}
        >
          {/* Header */}
          <View style={Styles.headerContainer}>
            <Text style={Styles.headerTitle}>Ongoing Delivery</Text>

            <TouchableOpacity
              style={Styles.closeButton}
              onPress={closeOngoingModal}
            >
              <MaterialIcons name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={Styles.divider} />

          {/* Content */}
          <View style={Styles.contentContainer}>
            <View style={Styles.detailsCard}>
              {/* Customer Details */}
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Customer Name:</Text>
                <Text style={Styles.value}>
                  {selectedService.customer_fullname}
                </Text>
              </View>
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Address:</Text>
                <Text style={Styles.value}>{selectedService.address_line}</Text>
              </View>
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Service Name:</Text>
                <Text style={Styles.value}>{selectedService.service_name}</Text>
              </View>
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Payment Method:</Text>
                <Text style={Styles.value}>
                  {selectedService.payment_method}
                </Text>
              </View>
              <View style={Styles.detailsContainer}>
                <Text style={Styles.label}>Distance:</Text>
                <Text style={Styles.value}>{selectedService.distance}</Text>
              </View>
            </View>
          </View>
          {/* Button Bottom */}
          <View style={Styles.buttonContainer}>
            <TouchableOpacity
              style={Styles.finishButton}
              onPress={() => handleFinishDelivery(selectedService.request_id)}
            >
              {isloading ? (
                <ActivityIndicator size="large" color={COLORS.white} />
              ) : (
                <Text style={Styles.submitButtonText}>Complete Delivery</Text>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={Styles.finishButton}
              onPress={() => handleAttemptDelivery(selectedService.request_id)} // Handle the attempt delivery
            >
              {isloading ? (
                <ActivityIndicator size="large" color={COLORS.white} />
              ) : (
                <>
                  <AntDesign name="back" size={24} color={COLORS.white} />
                </>
              )}
            </TouchableOpacity> */}
          </View>
        </BottomSheet>
      </Portal>
    </SafeAreaView>
  );
}
