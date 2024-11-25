import * as Crypto from "expo-crypto";
import CryptoJS from "crypto-js";
import Constants from "expo-constants";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const SECRET_KEY = Constants.expoConfig.extra.secretKey;

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export const truncateMessage = (message, limit = 30) => {
  return message.length > limit ? message.slice(0, limit) + "..." : message;
};

export const formatDate = (dateString) => {
  const date = parseISO(dateString); // Parse the date string to a Date object
  if (isToday(date)) {
    return format(date, "hh:mm a"); // Format as "8:08 PM"
  } else if (isYesterday(date)) {
    return "Yesterday"; // Format for yesterday
  } else if (date.getTime() > Date.now() - 604800000) {
    // Within the last week
    return format(date, "eee"); // Format as "Tue"
  } else {
    return format(date, "MMM d"); // Format as "Oct 1"
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance.toFixed(1);
};

export const formatDateNow = () => {
  return new Date().toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const encryptMessage = (message) => {
  const encryptedMessage = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  return encryptedMessage;
};

export const decryptMessage = (encryptedMessage) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};

export const getCurrentDay = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  return daysOfWeek[today.getDay()];
};

export const formatTimeNotification = (dateString) => {
  if (!dateString) {
    return "No date available";
  }

  const notificationDate = new Date(dateString);

  if (isNaN(notificationDate.getTime())) {
    return "Invalid date";
  }

  // Format the date
  if (isToday(notificationDate)) {
    return format(notificationDate, "hh:mm a");
  } else {
    return format(notificationDate, "MMMM d, yyyy");
  }
};

export const iconMapping = {
  "Pending Pickup": "calendar",
  "Ongoing Pickup": "car-outline",
  "Completed Pickup": "checkmark-done-outline",
  "At Store": "storefront-outline",
  "In Queue": "ellipsis-horizontal-circle-outline",
  "In Laundry": "water-outline",
  "Laundry Complete": "shirt-outline",
};
