import React, { createContext, useState, useContext, useEffect } from "react";
import * as Notifications from "expo-notifications";

// Create a Notifications Context
const NotificationsContext = createContext(null);

// Context provider to manage notifications
export const NotificationsContextProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("You need to enable notifications in your settings.");
        }
      } catch (error) {
        console.error("Error requesting notification permissions:", error);
      }
    };

    // Request notification permissions on mount
    requestNotificationPermissions();

    // Foreground notification listener
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification); // Set notification in state
      });

    // Background notification listener
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotification(response.notification); // Handle background notification click
      });

    // Cleanup subscriptions on component unmount
    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  return (
    <NotificationsContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the Notifications context in components
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsContextProvider"
    );
  }
  return context;
};
