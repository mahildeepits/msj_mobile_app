import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../config";

type NotificationsContextType = {
  hasUnread: boolean;
  refreshUnread: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType>({
  hasUnread: false,
  refreshUnread: async () => {},
});

export const NotificationsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [hasUnread, setHasUnread] = useState(false);

  const refreshUnread = async () => {
    try {
      let userToken = await AsyncStorage.getItem('userToken');
      userToken = JSON.parse(userToken || '{}');

      const response = await axios.get(`${config.apiBaseUrl}/notifications`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        }
      });

      const notifications = response.data.data || [];
      let userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (user) {
        const hasUnreadNotifications = notifications.some(
          (notif: any) => !notif.seen_by?.includes(user.id)
        );
        setHasUnread(hasUnreadNotifications);
      } else {
        setHasUnread(false);
      }
    } catch (error) {
      console.log('Error checking unread notifications:', error);
      setHasUnread(false);
    }
  };

  // Refresh unread on mount
  useEffect(() => {
    refreshUnread();
  }, []);

  return (
    <NotificationsContext.Provider value={{ hasUnread, refreshUnread }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
