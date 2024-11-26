import React, { createContext, useContext, useEffect } from "react";
import * as Notifications from "expo-notifications";

const NotificationsContext = createContext();

export const NotificationsContextProvider = ({ children }) => {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      },
    });

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NotificationsContext.Provider value={{}}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
