import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // or wherever you are importing this from
import { fonts } from "../../constants/fonts";
import COLORS from "../../constants/colors";
import { useNavigation } from "expo-router";

export const ServiceItem = ({ item, isExpanded, onToggle }) => {
  const navigation = useNavigation();
  const handleGoToSelectService = async (id, name) => {
    navigation.navigate("select/select", {
      service_id: id,
      service_name: name,
    });
  };

  return (
    <View style={styles.serviceItem}>
      <Image style={styles.serviceImage} />

      <View style={styles.serviceInfo}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.serviceName}>{item.service_name}</Text>
            {item.description ? (
              <Text style={styles.serviceDescription}>{item.description}</Text>
            ) : null}
            <Text style={styles.servicePrice}>PHP {item.default_price}</Text>
            {item.isActive &&
              isExpanded && ( // Show promo details if expanded
                <>
                  <Text style={styles.promoTitle}>Promo Valid Days:</Text>
                  <Text style={styles.promoDetails}>
                    {Array.isArray(item.valid_days)
                      ? item.valid_days.join(", ")
                      : item.valid_days}
                  </Text>
                </>
              )}
          </View>
          <View
            style={{
              padding: 10,
              flexDirection: "row",
            }}
          >
            {item.isActive && !isExpanded && (
              <Text style={styles.promoBadge}>Promo</Text>
            )}
            {item.isActive && (
              <TouchableOpacity
                onPress={onToggle}
                style={styles.collapseIconContainer}
              >
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={COLORS.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Pressable
          style={styles.serviceButton}
          onPress={() =>
            handleGoToSelectService(item.service_id, item.service_name)
          }
        >
          <Text style={styles.buttonText}>Choose This Service</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
    position: "relative",
  },

  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: COLORS.background,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  serviceName: {
    fontFamily: fonts.Bold,
    color: COLORS.primary,
    fontSize: 18,
  },
  serviceDescription: {
    fontFamily: fonts.Regular,
    fontSize: 12,
    color: COLORS.subtitle,
  },
  servicePrice: {
    fontFamily: fonts.Bold,
    fontSize: 15,
    color: COLORS.secondary,
  },
  promoBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.error,
    color: COLORS.white,
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    textAlign: "center",
  },
  serviceButton: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary_light,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: COLORS.secondary,
    fontFamily: fonts.SemiBold,
  },
  carouselTitleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  carouselTitle: {
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: COLORS.white,
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
  carouselContent: {
    paddingVertical: 10,
  },
  collapseIconContainer: {
    marginTop: 25,
    marginEnd: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  promoTitle: {
    marginTop: 5,
    color: COLORS.primary,
    fontFamily: fonts.Bold,
  },
  promoDetails: {
    marginTop: 2,
    fontFamily: fonts.Regular,
    color: COLORS.subtitle,
  },
});
