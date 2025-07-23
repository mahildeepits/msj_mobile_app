import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function GoldRates(){
  return (
    <>
     <View style={styles.goldRateBox}>
        <Text style={styles.goldLabel}>LIVE HALLMARKED GOLD RATES</Text>
      </View>
      <View style={[styles.goldRateBox, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
        <Text style={styles.goldSub}>24 K FINE GOLD (10 G)</Text>
        <Text style={styles.goldPrice}>₹ 97580</Text>
        <View style={{ flexDirection: 'row', backgroundColor: '#C2DFD6', paddingHorizontal: 10, borderRadius: 2 }}>
          <Text style={styles.goldUpdates}>Last Updated:</Text>
          <Text style={[styles.goldUpdates, { fontWeight: '500', color: 'rgb(12, 134, 12)' }]}> 11/July/2025 11:50 AM</Text>
        </View>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
    goldRateBox: {
        alignItems: "center",
        paddingVertical: 10,
    },
    goldLabel: {
        fontSize: 14,
        color: "#000",
        fontWeight: "bold",
    },
    goldPrice: {
        fontSize: 35,
        fontWeight: "bold",
        color: "#000",
        padding: 0,
    },
    goldSub: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#000",
    },
    goldUpdates: {
        fontSize: 10,
        fontWeight: "bold",
        color: "rgba(0,0,0,0.5)",
    },
});