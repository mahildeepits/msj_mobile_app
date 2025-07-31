import { Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function CalculatorScreen(){
  const [goldCarat, setGoldCarat] = useState('22');
  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState('g');
  const [makingCharges, setMakingCharges] = useState('');
  const [result, setResult] = useState(false);
  const [goldRate, setGoldRate] = useState(9177.6); // Example gold rate per gram
  const [calculatedTotalAmount, setCalculatedTotalAmount] = useState(0);
  const hallmarkingCharges = 45;
  const packingCharges = 100;
  const gst = 0.03;
  const [weightAmount, setWeightAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const calculate = () => {
    setResult(true)
  };
  const handleCaratChange = (value:any) => {
    setGoldCarat(value);
  }
  const calculations = () => {
    const safeWeight = isNaN(weight) ? 0 : weight;
    const weightInGrams = (weightUnit === 'kg' ? safeWeight * 1000 : safeWeight);
    const goldValue = goldRate * weightInGrams;
    const mc = parseFloat(makingCharges) || 0;
    const beforeGST = goldValue + mc + hallmarkingCharges + packingCharges;
    const gstValue = Number((beforeGST * gst).toFixed(2));
    const grandTotal = Number((beforeGST + gstValue).toFixed(2));
    setWeightAmount(Number(goldValue.toFixed(2)));
    setGstAmount(gstValue);
    setCalculatedTotalAmount(grandTotal);
  };
  useEffect(() => {
    calculations();
  }, [goldCarat, weight, weightUnit, makingCharges, goldRate]);

  const reset = () => {
    setGoldCarat('22');
    setWeight(0);
    setWeightUnit('g');
    setMakingCharges('');
    setWeightAmount(0);
    setGstAmount(0);
    setCalculatedTotalAmount(0);  
    setResult(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
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
            onValueChange={(value) => setMakingCharges(value)}
            value={makingCharges}
            placeholder={{ label: "Select Making Charges", value: null }}
            style={{
              viewContainer: styles.selectContainer,
              inputIOS: styles.selectInput,
              inputAndroid: styles.selectInput,
              placeholder: { color: '#999',marginTop:-8,fontSize:12 },
            }}
            items={[
              { label: 'Nwabi', value: '0' },
              { label: 'Long Set', value: '0' },
              { label: 'Bangles', value: '0' },
              { label: 'Gents Ring', value: '0' },
              { label: 'Chain', value: '0' },
            ]}
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
            <Text style={styles.resultsTextCal} >₹ {weightAmount}</Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.resultsMainText} >Making Charges</Text>
            <Text style={styles.resultsTextColon} > : </Text>
            <Text style={styles.resultsTextCal} >0% / ₹0 </Text>
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
            <Text style={styles.resultsTextCal} >3% / ₹{gstAmount}</Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.resultsMainText} >Grand Total</Text>
            <Text style={styles.resultsTextColon} > : </Text>
            <Text style={styles.resultsTextCal} >₹ {calculatedTotalAmount}</Text>
          </View>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2DFD6',
    paddingTop:20
  },
  form:{
    marginTop:55,
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