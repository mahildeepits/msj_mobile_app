import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
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
  return (
    <GoldCostContext.Provider value={rates?.rates?.goldCost}>

    <View style={{ flex: 1 }}>
      {user && <Menu />}
      <Slot /> {/* Renders the current active screen */}
      {user && <BottomNavigation navigation={navigation}/>}
      <Toast />
    </View>
    </GoldCostContext.Provider>
  );
}
