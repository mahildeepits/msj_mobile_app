import React, { useContext } from "react";
import { ScrollView } from "react-native";
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
