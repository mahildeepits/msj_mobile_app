import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Map from "../components/map";
import Slider from "../components/slider";
import Features from "./../components/features";
import GoldRates from "./../components/goldrates";
import GoldCostContext from "./goldContext";

export default function Dashboard() {
  const goldcost:any = useContext(GoldCostContext);
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#C2DFD6', marginBottom: '16%' }}>
      {/* Slider  */}
      <Slider />

      {/* Animated Feature Boxes */}
      <Features />

      {/* Gold Price Box */}
      <GoldRates goldRate={goldcost} />

      {/* Timing Bar */}
      <View style={styles.timingBar}>
        <Ionicons name="time-outline" size={18} />
        <Text style={styles.timingText}>  Our Today's Timing : 10AM - 9PM</Text>
      </View> 

      <Map />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
  timingBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10
  },
  timingText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
