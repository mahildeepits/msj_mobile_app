import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import BottomNavigation from "./../components/bottomNavigation";
import Menu from "./../components/menu";
export default function DashboardLayout({navigation}:any) {
  const [user, setUser] = useState(null);
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
    const getUser = async () => {
      const userJson:any  = await AsyncStorage.getItem('user');
      console.log('userJson', userJson);
      setUser(JSON.parse(userJson) || null);
    }
    getUser();
  },[])
  return (
    <View style={{ flex: 1 }}>
      {user && <Menu />}
      <Slot /> {/* Renders the current active screen */}
      {user && <BottomNavigation navigation={navigation}/>}
      <Toast />
    </View>
  );
}
