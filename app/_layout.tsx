import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
export default function RootLayout() {
  const router = useRouter();
  useEffect(() => {
    const handleAuthUser = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      if(user){
        // User is authenticated, navigate to dashboard
        console.log('User is authenticated', user);
        router.navigate('/dashboard');
      }
    }
    handleAuthUser();
  })
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <Toast />
    </View>
  );
}
