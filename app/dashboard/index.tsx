import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import Map from "../components/map";
import Slider from "../components/slider";
import Timing from "../components/timing";
import config from "../config";
import { FestivalLayoutComponents } from "../FestivalLayoutComponents";
import Features from "./../components/features";
import GoldRates from "./../components/goldrates";
import GoldCostContext from "./goldContext";

export default function Dashboard() {
  const goldcost = useContext(GoldCostContext);
  const [event, setEvent] = useState('Default');
  // Track last back press time
  const LayoutComponent = FestivalLayoutComponents[event] || FestivalLayoutComponents.Default;
  const getEvent = async () => {
    let token = await AsyncStorage.getItem('userToken');
    token = JSON.parse(token || '{}');
    try {
      const response = await axios.get(`${config.apiBaseUrl}/current-event`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('jeewdtufiggsuiha',response.data);
      if(response.data.status){
        setEvent(response.data.data.name || 'Default');
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getEvent();
  });
  return (
    <>
      <LayoutComponent>

        <ScrollView style={{ flex: 1, backgroundColor: 'transparent', marginBottom: '16%' }}>
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
      </LayoutComponent>
    </>
  );
}
