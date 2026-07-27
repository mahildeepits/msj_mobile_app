import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { RateChangeIndicator } from '../components/RateChangeIndicator';
import VideoComponent from '../components/video';
import config from '../config';
import GoldCostContext from './goldContext';

export default function CalculatorScreen(){
  const [goldCarat, setGoldCarat] = useState('22');
  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState('g');
  const [makingCharges, setMakingCharges] = useState([]);
  const [result, setResult] = useState(false);
  const [goldRate, setGoldRate]:any = useState(); // Example gold rate per gram
  const goldcost:any = useContext(GoldCostContext);
  const [calculatedTotalAmount, setCalculatedTotalAmount] = useState(0);
  const [hallmarkingCharges,setHallmarkingCharges] = useState(0);
  const [packingCharges,setPackingCharges] = useState(0);
  const [gst,setGst] = useState(0.00);
  const [weightAmount, setWeightAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [makingChargesInput,setMakingChargesInput] = useState([])
  const [selectedMakingCharges, setSelectedMakingCharges]:any = useState('');
  const [applicableMakingCharge,setApplicableMakingCharge] = useState(0);
  const calculate = () => {
    setResult(true)
  };
  const getMakingCharges = async () => {
    let token = await AsyncStorage.getItem('userToken');
    token = JSON.parse(token || '{}');
    const response = await axios.get(`${config.apiBaseUrl}/making-charges`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': "application/json"
      }
    });
    // console.log(response.data.data[0].id);
    const allData = response.data.data; // full array
    const dataById:any = {};
    const chargesInputData:any = [];
    allData.forEach((item:any) => {
      dataById[item.id] = item;
      chargesInputData.push({
        value: item.id,
        label: item.product_name,
      })
    });
    setMakingCharges(dataById);
    setMakingChargesInput(chargesInputData);
  }
  useEffect(() => {
    getMakingCharges();
  },[])

  const handleCaratChange = (value:any) => {
    setGoldCarat(value);
  }
  const calculations = () => {
    const safeWeight = isNaN(weight) ? 0 : weight;
    const weightInGrams = (weightUnit === 'kg' ? safeWeight * 1000 : safeWeight);
    const goldValue = (((parseInt(goldCarat) / 24) * goldRate)) * weightInGrams;
    const mc = handleSelectMakingCharges(selectedMakingCharges, goldValue) || 0;
    const beforeGST = goldValue + mc + hallmarkingCharges + packingCharges;
    const gstValue = Number(((beforeGST * gst)/100).toFixed(2));
    const grandTotal = Number((beforeGST + gstValue).toFixed(2));
    setWeightAmount(Number(goldValue.toFixed(2)));
    setGstAmount(gstValue);
    setCalculatedTotalAmount(grandTotal);
  };
  useEffect(() => {
    calculations();
  }, [goldCarat, weight, weightUnit, selectedMakingCharges, goldRate]);
  useEffect(() => {
    const ratePerGram = Number(goldcost/10).toFixed(2);
    setGoldRate(ratePerGram);
  }, [goldcost]);
  const reset = () => {
    setGoldCarat('22');
    setWeight(0);
    setWeightUnit('g');
    setSelectedMakingCharges('');
    setWeightAmount(0);
    setGstAmount(0);
    setCalculatedTotalAmount(0);  
    setResult(false);
  };
  const handleSelectMakingCharges = (value:any, goldRatePerGram:any) => {
    let applicableCharges = 0;
    let chargeData = makingCharges[value] || null;
    if(chargeData){
      let currentCharges = chargeData?.making_charge || 0;
      if(currentCharges > 0){
        applicableCharges = (goldRatePerGram * currentCharges) / 100;
      }
      
      setHallmarkingCharges(chargeData?.hallmarking_charge || 0);
      setPackingCharges(chargeData?.packing_charge || 0);
      setGst(chargeData?.gst_charge || 0.00);
    }
    applicableCharges = parseFloat(applicableCharges.toFixed(2));
    setApplicableMakingCharge(applicableCharges);
    return applicableCharges;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container}>
        <View style={{marginBottom: 30}}>
          <View style={styles.form}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',marginBottom:10}}>
              <FontAwesome5 name="money-bill-wave-alt" size={14} color="#007A5E" />
              <Text style={{textAlign: 'center',fontSize: 10,paddingBottom:5,textTransform: 'uppercase',width:'80%'}}> Select your desired GOLD and know the prices</Text>
            </View>
            <View style={[styles.mb20]}>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    weightUnit === 'g' && styles.radioButtonActive,
                  ]}
                  onPress={() => setWeightUnit('g')}
                >
                  <FontAwesome5 name="coins" size={14} color="#007A5E" />
                  <Text style={[{marginHorizontal: 5},weightUnit === 'g' ? styles.radioTextActive : styles.radioText]}>Grams</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    weightUnit === 'kg' && styles.radioButtonActive,
                  ]}
                  onPress={() => setWeightUnit('kg')}
                >
                  <FontAwesome5 name="coins" size={14} color="#007A5E" />
                  <Text style={[{marginHorizontal: 5},weightUnit === 'kg' ? styles.radioTextActive : styles.radioText]}>Kilograms</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
                <TextInput
                  value={weight > 0 ?JSON.stringify(weight) : ''}
                  onChangeText={(text) => setWeight(parseFloat(text))}
                  keyboardType="numeric"
                  placeholder="Enter weight here"
                  style={styles.input}
                  placeholderTextColor={'#999'}
                  
                />
            </View>
            <View style={styles.mb20}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <TouchableOpacity onPress={() => handleCaratChange('22')}><Text style={[styles.caratBox,(goldCarat == '22')? styles.activeCaratBox : '']}>22 K</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleCaratChange('20')}><Text style={[styles.caratBox,(goldCarat == '20')? styles.activeCaratBox : '']}>20 K</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleCaratChange('18')}><Text style={[styles.caratBox,(goldCarat == '18')? styles.activeCaratBox : '']}>18 K</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleCaratChange('14')}><Text style={[styles.caratBox,(goldCarat == '14')? styles.activeCaratBox : '']}>14 K</Text></TouchableOpacity>
              </View>
            </View>
            <View style={styles.mb20}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedMakingCharges(value)}
                value={selectedMakingCharges}
                placeholder={{ label: "Select Making Charges", value: null }}
                style={{
                  viewContainer: styles.selectContainer,
                  inputIOS: styles.selectInput,
                  inputAndroid: styles.selectInput,
                  placeholder: { color: '#999',marginTop:-8,fontSize:12 },
                }}
                items={makingChargesInput}
              />
            </View>
            <View >
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,styles.radioButtonActive,
                  ]}
                  onPress={reset}
                >
                  <FontAwesome name='refresh' size={14} color={'#007A5E'} />
                  <Text style={[{textAlign: 'center',fontWeight:'bold',color:'#007A5E',marginHorizontal:5}]}>RESET</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                  ]}
                  onPress={calculate}
                >
                  <Entypo name="print" size={16}  />
                  <Text style={[{textAlign: 'center',fontWeight:'bold',marginHorizontal:5,}]}>CALCULATE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={result ? styles.show : styles.hide}>
            <Text style={{fontSize: 18,fontWeight:'bold',marginVertical:10,textAlign:'center'}}>RESULTS</Text>
            <View style={{padding: 15, backgroundColor: 'white',}}>
              <View style={styles.resultBox}>
                <Text style={styles.resultsMainText} >Gold Weight</Text>
                <Text style={styles.resultsTextColon} > : </Text>
                <Text style={styles.resultsTextCal} >{weight} {weightUnit == 'g' ? 'Grams' : 'Kilograms'}</Text>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultsMainText} >Gold Weight Amount ( {goldCarat} K )</Text>
                <Text style={styles.resultsTextColon} > : </Text>
                <View style={styles.resultsTextCal} ><RateChangeIndicator value={weightAmount} showCurrenyFormat={true} showDecimals={false} styleFormat={{textAlign:'right'}} /></View>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultsMainText} >Making Charges</Text>
                <Text style={styles.resultsTextColon} > : </Text>
                <Text style={styles.resultsTextCal} >{makingCharges[selectedMakingCharges]?.making_charge || 0}% / ₹{applicableMakingCharge} </Text>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultsMainText} >Hallmarking Charges</Text>
                <Text style={styles.resultsTextColon} > : </Text>
                <Text style={styles.resultsTextCal} >{hallmarkingCharges}</Text>
              </View>
              <View style={styles.resultBox} >
                <Text style={styles.resultsMainText} >Packing Charges</Text>
                <Text style={styles.resultsTextColon} > : </Text>
                <Text style={styles.resultsTextCal} >{packingCharges} </Text>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultsMainText} >GST </Text>
                <Text style={styles.resultsTextColon} > : </Text>
                <Text style={styles.resultsTextCal} >{gst}% / ₹{gstAmount}</Text>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultsMainText} >Grand Total</Text>
                <Text style={styles.resultsTextColon} > : </Text>
                <View style={styles.resultsTextCal} ><RateChangeIndicator value={calculatedTotalAmount} showCurrenyFormat={true} showDecimals={false} styleFormat={{textAlign:'right'}} /></View>
              </View>
            </View>
          </View>
          <VideoComponent />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2DFD6',
    marginBottom:55,
    // paddingBottom:30
  },
  form:{
    marginTop:45,
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:5,
  },
  mb20:{
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color:'balck',
    fontWeight:'bold'
  },
  input: {
    height: 40,
    fontSize:16,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  result: {
    fontSize: 24,
    marginTop: 20,
  },
  caratBox:{
    paddingVertical: 7,
    paddingHorizontal:15,
    borderRadius:5,
    fontWeight:'bold',
    backgroundColor:'#C2DFD6',
    borderWidth:2,
    borderColor:'#C2DFD6'
  },
  activeCaratBox:{
    backgroundColor:'white',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  radioButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#C2DFD6',
    borderRadius: 5,
    backgroundColor: '#C2DFD6',
    width: '45%',
  },
  radioButtonActive: {
    backgroundColor: 'white',
  },
  radioText: {
    fontWeight: 'bold',
    color: 'black',
  },
  radioTextActive: {
    fontWeight: 'bold',
    color: '#007A5E',
  },
  selectInput: {
    fontSize: 14,
    marginTop: -8,
    marginHorizontal:2,
    margin:0,
    borderRadius: 5,
    color: 'black',
    // paddingRight: 10, // to ensure the text is not behind the icon
  },
  selectContainer:{
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 0,
    height: 40,
    fontSize: 12,
  },
  resultBox:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 7
  },
  resultsMainText:{
    width:'60%',
    fontWeight:'bold',
    color:'#007A5E'
  },
  resultsTextColon:{
    width:'5%',
    fontSize:14,
    fontWeight:800,
    color:'#007A5E'
  },
  resultsTextCal:{
    width:'35%',
    textAlign:'right'
  },
  show:{
    display: 'flex',
  },
  hide:{
    display: 'none',
  }
});