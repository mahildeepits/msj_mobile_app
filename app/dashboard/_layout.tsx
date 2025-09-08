import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import axios from "axios";
import Constants from 'expo-constants';
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, PermissionsAndroid, View } from "react-native";
import Toast from "react-native-toast-message";
import config from "../config";
import { useRatesStore } from "../ratesStore";
import { socketService } from "../socketService";
import BottomNavigation from "./../components/bottomNavigation";
import Menu from "./../components/menu";
import GoldCostContext from "./goldContext";
import { NotificationsProvider } from "./notificationContext";

export default function DashboardLayout({ navigation }: any) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const rates: any = useRatesStore((state) => state.rates);
  const [goldCurrentRate, setGoldCurrentRate] = useState(null);
  const segments = useSegments(); 
  const [routeName, setRouteName] = useState('');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  const [backendGoldRate, setBackendGoldRate] = useState<any>();
  const lastBackPress = useRef<number | null>(null);

  // Double-back-to-exit handling
  useEffect(() => {
    const onBackPress = () => {
      const current = segments[segments.length - 1];
      console.log(current);
      // Only apply double back exit logic on /dashboard/index
      if (!current || current === 'dashboard') {
        const now = Date.now();
        if (lastBackPress.current && now - lastBackPress.current < 2000) {
          BackHandler.exitApp();
          return true;
        } else {
          Toast.show({
            type: 'info',
            text1: 'Press again to exit',
            position: 'top',
            visibilityTime: 2000,
          });
          lastBackPress.current = now;
          return true;
        }
      }
      // Not on main screen: let Expo Router handle it (navigate back or pop stack)
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, [segments]);

  useEffect(() => {
    const current: any = segments[segments.length - 1];
    if (current === undefined || current === 'index') {
      setRouteName('index');
    } else {
      setRouteName(current);
    }
  }, [segments]);

  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    }
  }, []);
  const getRateFromBackend = async () => {
    try {
        let userToken = await AsyncStorage.getItem('userToken');
        userToken = JSON.parse(userToken || '{}');
        let response = await axios.get(`${config.apiBaseUrl}/gold-rate`, {
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        });
        if(response.data.status){
          setBackendGoldRate(response.data.data.gold_cost);
          if(goldCurrentRate == null){
            setGoldCurrentRate(response.data.data.gold_cost);
          }
        }
        console.log('success in getting backend gold rate', response.data);
      } catch (error) {
        console.log('Error getting backend gold rate', error);
      }
  }
  const setGoldRateInBackend = async () => {
    try {
        let userToken = await AsyncStorage.getItem('userToken');
        userToken = JSON.parse(userToken || '{}');
        let response = await axios.post(`${config.apiBaseUrl}/gold-rate`,{
            gold_rate: goldCurrentRate,
          }, {
            headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        });
        if (response.data.status) {
          setBackendGoldRate(goldCurrentRate);
          console.log('get set go', response.data);
        }
      } catch (error) {
        console.log('Error getting gold rate', error);
      }
  }
  const getAndSetGoldRate = async () => {
    if(goldCurrentRate == null){
       await getRateFromBackend();
    }
    console.log('goldRate', rates?.rates?.goldCost);
    if(rates?.rates?.goldCost){
      setGoldCurrentRate(rates?.rates?.goldCost)
    }
    if((goldCurrentRate && backendGoldRate) && ((goldCurrentRate - backendGoldRate) >= 50 || (goldCurrentRate - backendGoldRate) <= -50)){
      await setGoldRateInBackend();
    }
  }
  useEffect(() => {
      getAndSetGoldRate();
  }, [rates]);

  useEffect(() => {
    const getUser = async () => {
      const userJson: any = await AsyncStorage.getItem('user');
      console.log('userJson', userJson);
      setUser(JSON.parse(userJson) || null);
    }
    getUser();
  }, []);

  useEffect(() => {
    // iOS permission
    messaging().requestPermission().then(async (authStatus) => {
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        sendToken(token);
      }
    });
    // android permission
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then(async (res) => {
      if (res === 'granted') {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        sendToken(token);
      }
    });
    // Foreground listener
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification?.title || 'New Notification', remoteMessage.notification?.body || '');
    });
    // Background/quit listener
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkUnreadNotifications = async () => {
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
          const hasUnread = notifications.some(
            (notif: any) => !notif.seen_by?.includes(user.id)
          );
          setHasUnreadNotifications(hasUnread);
        } else {
          setHasUnreadNotifications(false);
        }
      } catch (error) {
        console.log('Error checking unread notifications:', error);
        setHasUnreadNotifications(false);
      }
    }
    checkUnreadNotifications();
  }, [user]);

  const refreshUnreadNotifications = async () => {
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
        const hasUnread = notifications.some(
          (notif: any) => !notif.seen_by?.includes(user.id)
        );
        setHasUnreadNotifications(hasUnread);
      } else {
        setHasUnreadNotifications(false);
      }
    } catch (error) {
      console.log('Error refreshing unread notifications:', error);
      setHasUnreadNotifications(false);
    }
  };

  const sendToken = async (token: any) => {
    await AsyncStorage.setItem('pushToken', JSON.stringify(token));
    let apiToken = await AsyncStorage.getItem('userToken');
    apiToken = JSON.parse(apiToken || '{}');
    let response = await axios.get(`${config.apiBaseUrl}/expo-token?token=${token}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });
    console.log('token', token);
    console.log('response', response.data);
  }

  return (
    <GoldCostContext.Provider value={goldCurrentRate}>
      <NotificationsProvider>
        <View style={{ flex: 1, marginTop: 40, backgroundColor: '#C2DFD6' }}>
          {user && <Menu />}
          <Slot /> {/* Renders the current active screen */}
          {user && <BottomNavigation navigation={navigation} />}
          <Toast />
        </View>
      </NotificationsProvider>
    </GoldCostContext.Provider>
  );
}
