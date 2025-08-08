import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RateChangeIndicator } from './RateChangeIndicator';

export default function GoldRates({goldRate}:any){
  const [goldRate24k, setGoldRate24k] = useState(0);
  const [goldRate22k, setGoldRate22k] = useState(0);
  const [goldRate20k, setGoldRate20k] = useState(0);
  const [goldRate18k, setGoldRate18k] = useState(0);
  const [goldRate14k, setGoldRate14k] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    setGoldRate24k(goldRate);
    let goldCost22k = Number(getGoldRate(22, goldRate));
    let goldCost20k = Number(getGoldRate(20, goldRate));
    let goldCost18k = Number(getGoldRate(18, goldRate));
    let goldCost14k = Number(getGoldRate(14, goldRate));
    setGoldRate22k(goldCost22k);
    setGoldRate20k(goldCost20k);
    setGoldRate18k(goldCost18k);
    setGoldRate14k(goldCost14k);
    setCurrentTime(new Date());
  },[goldRate])
  const getGoldRate = (carat:any, rate24k:any) =>  {
    return ((carat / 24) * rate24k).toFixed(2);
  }
  return (
    <>
     <View style={styles.goldRateBox}>
        <Text style={styles.goldLabel}>LIVE HALLMARKED GOLD RATES</Text>
      </View>
      <View style={[styles.goldRateBox, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
        <Text style={styles.goldSub}>24 K FINE GOLD (10 G)</Text>
        <View > <RateChangeIndicator value={goldRate24k} showCurrenyFormat={true} showDecimals={false} styleFormat={styles.goldPrice} /></View>
        <View style={{ flexDirection: 'row', backgroundColor: '#C2DFD6', paddingHorizontal: 10, borderRadius: 2 }}>
          <Text style={styles.goldUpdates}>Last Updated:</Text>
          <Text style={[styles.goldUpdates, { fontWeight: '500', color: 'rgb(12, 134, 12)' }]}> {currentTime.toLocaleString()} </Text>
        </View>
      </View>
      <Text style={styles.caratMainText}>All Gold Rates With Purity </Text>
      <View style={styles.caratBoxMainContainer}>
        <View style={styles.caratBoxContainer}>
          <View style={[styles.caratBox,{borderRightWidth:1,borderBottomWidth:1,borderColor:'rgba(255,255,255,0.4)'}]}>
            <Text style={[styles.caratText,styles.caratBoxLine]}><FontAwesome5 name="coins" size={14} color="#007A5E" /> 22 K</Text>
            <View> <RateChangeIndicator value={goldRate22k} showCurrenyFormat={true} showDecimals={false} styleFormat={styles.caratRate} /> </View>
          </View>
          <View style={[styles.caratBox,{borderLeftWidth:1,borderBottomWidth:1,borderColor:'rgba(255,255,255,0.4)'}]}>
            <Text style={[styles.caratText,styles.caratBoxLine]}><FontAwesome5 name="coins" size={14} color="#007A5E" /> 20 K</Text>
            <View> <RateChangeIndicator value={goldRate20k} showCurrenyFormat={true} showDecimals={false} styleFormat={styles.caratRate} /> </View>
          </View>
        </View>
        <View style={styles.caratBoxContainer}>
          <View style={[styles.caratBox,{borderRightWidth:1,borderTopWidth:1,borderColor:'rgba(255,255,255,0.4)'}]}>
            <Text style={[styles.caratText,styles.caratBoxLine]}><FontAwesome5 name="coins" size={14} color="#007A5E" /> 18 K</Text>
            <View> <RateChangeIndicator value={goldRate18k} showCurrenyFormat={true} showDecimals={false} styleFormat={styles.caratRate} /> </View>
          </View>
          <View style={[styles.caratBox,{borderLeftWidth:1,borderTopWidth:1,borderColor:'rgba(255,255,255,0.4)'}]}>
            <Text style={[styles.caratText,styles.caratBoxLine]}><FontAwesome5 name="coins" size={14} color="#007A5E" /> 14 K</Text>
            <View> <RateChangeIndicator value={goldRate14k} showCurrenyFormat={true} showDecimals={false} styleFormat={styles.caratRate} /> </View>
          </View>
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
    caratBoxMainContainer:{
    backgroundColor: "rgba(0,0,0,0.1)",
    marginBottom:20,
  },
  caratBoxContainer:{
    flexDirection: "row",
    justifyContent: "space-around",
    // marginVertical: 5
  },
  caratBox:{
    // backgroundColor: "white",
    alignItems: "center",
    width:"50%"
  },
  caratBoxLine:{
    borderBottomColor:'rgba(0,0,0,0.5)',
    borderBottomWidth:2,
    borderRadius:10,
  },
  caratText:{
    fontSize:16,
    fontWeight:'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  caratRate:{
    fontSize:16,
    fontWeight:'bold',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  caratMainText:{
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor:'#C2DFD6',
    width:'100%',
    alignSelf:'center',
    borderRadius:2,
    color:'rgba(0,0,0,1)',
    textTransform:'uppercase',
    paddingVertical:10
  }
});