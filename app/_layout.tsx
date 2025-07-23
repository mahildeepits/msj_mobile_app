import { Slot, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import BottomNavigation from "./components/bottomNavigation";
import Menu from "./components/menu";

export default function RootLayout() {
  const [user, setUser] = useState(0);
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
    if(routeName === 'index'){
      setUser(0);
    }else{
      setUser(1);
    }
  },[routeName])
  return (
    <View style={{ flex: 1 }}>
      {user && <Menu />}
      <Slot /> {/* Renders the current active screen */}
      {user && <BottomNavigation />}
    </View>
  );
}
