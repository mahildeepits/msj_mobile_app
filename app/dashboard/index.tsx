import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useRef } from "react";
import { BackHandler, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import Map from "../components/map";
import Slider from "../components/slider";
import Timing from "../components/timing";
import Features from "./../components/features";
import GoldRates from "./../components/goldrates";
import GoldCostContext from "./goldContext";

export default function Dashboard() {
  const goldcost = useContext(GoldCostContext);
  // Track last back press time
  const lastBackPressed = useRef<number | null>(null);
const onBackPress:any = async () => {
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      if (user) {
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
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#C2DFD6', marginBottom: '16%' }}>
        {/* Slider */}
        <Slider />
        {/* Animated Feature Boxes */}
        <Features />
        {/* Gold Price Box */}
        <GoldRates goldRate={goldcost} />
        {/* Timing Bar */}
        <Timing />
        {/* Map */}
        <Map />
      </ScrollView>
      <Toast />
    </>
  );
}
