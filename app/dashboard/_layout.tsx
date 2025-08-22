import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Slot, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import config from "../config";
import { useRatesStore } from "../ratesStore";
import { socketService } from "../socketService";
import BottomNavigation from "./../components/bottomNavigation";
import Menu from "./../components/menu";
import GoldCostContext from "./goldContext";



export default function DashboardLayout({navigation}:any) {
  const [user, setUser] = useState(null);
  const rates:any = useRatesStore((state) => state.rates);
  const segments = useSegments(); 
  const [routeName, setRouteName] = useState('');
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
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


  async function registerForPushNotificationsAsync() {
  
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        
        return;
      }else{
        const pushTokenString = {
          token: (await Notifications.getExpoPushTokenAsync({projectId})).data
        }
        return pushTokenString
      }
      
  }
  const sendToken = async (token:any) => {
    await AsyncStorage.setItem('pushToken', JSON.stringify(token));
    let apiToken = await AsyncStorage.getItem('userToken');
    apiToken = JSON.parse(apiToken || '{}');
    let response = await axios.get(`${config.apiBaseUrl}/expo-token?token=${token.token}`,{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });
    console.log('token',token);
    console.log('response', response.data);

  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => sendToken(token))
      .catch((error: any) => console.log('error', error));
    // const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });
    // const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
    // });
    // return () => {
    //   notificationListener.remove();
    //   responseListener.remove();
    // };
  }, []);
  return (
    <GoldCostContext.Provider value={rates?.rates?.goldCost}>

    <View style={{ flex: 1, marginTop:40, backgroundColor: 'white' }}>
      {user && <Menu />}
      <Slot /> {/* Renders the current active screen */}
      {user && <BottomNavigation navigation={navigation}/>}
      <Toast />
    </View>
    </GoldCostContext.Provider>
  );
}
