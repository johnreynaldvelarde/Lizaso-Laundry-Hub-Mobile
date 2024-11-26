import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { ServiceItem } from "../../components/customer/ServiceItem";
import usePolling from "../../hooks/usePolling";
import { getLaundryServices, getNotification } from "../../data/api/getApi";
import useAuth from "../context/AuthContext";
import CustomNotifications from "../../components/common/customNotifications";

export default function Home() {
  const navigation = useNavigation();
  const { userDetails, socket } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const bottomSelectedSheet = useRef(null);

  const fetchLaundryServices = useCallback(async () => {
    const response = await getLaundryServices(userDetails.storeId);
    return response.data;
  }, [userDetails.storeId]);

  const fetchNotification = useCallback(async () => {
    try {
      let response;
      if (userDetails.user_type === "Customer") {
        response = await getNotification(userDetails.userId, "Customer");
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
  }, [userDetails.userId, userDetails.user_type]);

  useFocusEffect(
    useCallback(() => {
      fetchNotification();

      if (socket) {
        const handleNotification = (data) => {
          // CustomNotifications(data.title, data.message, {});
          fetchNotification();
        };

        socket.on("notificationsModuleForCustomer", handleNotification);

        return () => {
          socket.off("notificationsModuleForCustomer", handleNotification);
        };
      }
    }, [fetchNotification, socket])
  );

  const {
    data: servicesData,
    loading,
    error,
    setIsPolling,
  } = usePolling(fetchLaundryServices, 10000);

  useFocusEffect(
    useCallback(() => {
      fetchNotification();
      setIsPolling(true);
      return () => {
        setIsPolling(false);
      };
    }, [fetchNotification, setIsPolling])
  );

  const openSelectedModal = (service) => {
    setSelectedService(service);
    bottomSelectedSheet.current?.expand();
  };

  const closeSelectModal = () => {
    bottomSelectedSheet.current?.close();
  };

  const handleGoToNotification = () => {
    navigation.navigate("notification/notification_customer");
  };

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderServiceItem = ({ item }) => {
    return (
      <ServiceItem
        select={openSelectedModal}
        item={item}
        isExpanded={!!expandedItems[item.service_id]}
        onToggle={() => toggleExpanded(item.service_id)}
      />
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
            style={[
              styles.header,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 20 }}>
              <Text style={styles.staffName}>{userDetails.fullname}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={COLORS.white}
                  style={{ marginRight: 1 }}
                />
                <View style={{ marginTop: 1 }}>
                  <Text
                    style={styles.address}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {userDetails.header_address}, {userDetails.sub_province},{" "}
                    {userDetails.sub_city}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleGoToNotification}
              style={styles.notificationIcon}
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

        {/* Bottom */}
        <View style={styles.listContainer}>
          <View style={styles.carouselTitleContainer}>
            <Text style={styles.carouselTitle}>
              Choose Your Laundry Service
            </Text>
          </View>
          <View style={{ marginTop: 10, marginBottom: 100 }}>
            <FlatList
              data={servicesData}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.service_id}
              contentContainerStyle={{ paddingBottom: 40, gap: 2 }}
              showsVerticalScrollIndicator={false}
            />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingRight: 20,
  },
  staffName: {
    fontFamily: fonts.SemiBold,
    fontSize: 18,
    color: COLORS.white,
  },
  address: {
    fontFamily: fonts.Medium,
    fontSize: 13,
    color: COLORS.white,
  },
  sub_add: {
    fontFamily: fonts.Medium,
    fontSize: 12,
    color: COLORS.white,
  },
  notificationIcon: {
    borderWidth: 1,
    borderColor: COLORS.white,
    padding: 5,
    borderRadius: 5,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    padding: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 30,
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
  carouselTitleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  carouselTitle: {
    fontSize: 20,
    fontFamily: fonts.Bold,
    color: COLORS.secondary,
    textAlign: "center",
  },
  carouselContainer: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  carouselItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 5,
    width: "100%",
  },
});
