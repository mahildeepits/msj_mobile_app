import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import axios from "axios";
import Constants from 'expo-constants';
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, PermissionsAndroid, View } from "react-native";
import Toast from "react-native-toast-message";
import config from "../config";
import { FestivalLayoutComponents } from "../FestivalLayoutComponents";
import { useRatesStore } from "../ratesStore";
import { socketService } from "../socketService";
import BottomNavigation from "./../components/bottomNavigation";
import Menu from "./../components/menu";
import GoldCostContext from "./goldContext";


export default function DashboardLayout({navigation}:any) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const rates:any = useRatesStore((state) => state.rates);
  const segments = useSegments(); 
  const [routeName, setRouteName] = useState('');
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  const LayoutComponent = FestivalLayoutComponents['Diwali'] || FestivalLayoutComponents.Default;

  useEffect(() => {
    const current:any = segments[segments.length - 1];
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
  },[]);
  useEffect(( ) => {
    console.log('goldRate', rates?.rates?.goldCost);
  },[rates])
  useEffect(() => {
    const getUser = async () => {
      const userJson:any  = await AsyncStorage.getItem('user');
      console.log('userJson', userJson);
      setUser(JSON.parse(userJson) || null);
    }
    getUser();
  },[])

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
  const sendToken = async (token:any) => {
    await AsyncStorage.setItem('pushToken', JSON.stringify(token));
    let apiToken = await AsyncStorage.getItem('userToken');
    apiToken = JSON.parse(apiToken || '{}');
    let response = await axios.get(`${config.apiBaseUrl}/expo-token?token=${token}`,{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });
    console.log('token',token);
    console.log('response', response.data);

  }
   const lastBackPressed = useRef<number | null>(null);
    const onBackPress:any = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (user) {
        const current:any = segments[segments.length - 1];
        console.log('here is the current route', segments, current);
        if (current === undefined || current !== 'index') {
          // Not on the main screen: navigate back
          router.back();
          return false;
        }
        const now = Date.now();
        if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
          // Second back press within 2 seconds: exit app
          BackHandler.exitApp();
          return true;
        } else {
          // First back press: show toast and store time
          Toast.show({
            type: 'info',
            text1: 'Press back again to exit',
          });
          lastBackPressed.current = now;
          return true;
        }
      }

      // Default behavior if not logged in
      return false;
    };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
  }, []);
  return (
    <LayoutComponent>
      <GoldCostContext.Provider value={rates?.rates?.goldCost}>

      <View style={{ flex: 1, marginTop:40, backgroundColor: 'white' }}>
        {user && <Menu />}
        <Slot /> {/* Renders the current active screen */}
        {user && <BottomNavigation navigation={navigation}/>}
        <Toast />
      </View>
      </GoldCostContext.Provider>
    </LayoutComponent>
  );
}
