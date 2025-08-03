import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const tableData = [
  { title: 'Bank Name', key: 'bank_name' },
  { title: 'Account Name', key: 'account_name' },
  { title: 'Account Number', key: 'account_number' },
  { title: 'IFSC Code', key: 'ifsc_code' },
  { title: 'Branch Name', key: 'branch_name' },
];
export default function BankDetails(){
  const [bankDetails, setBankDetails] = useState();
  const [addressDetails, setAddressDetails] = useState();
  const flatListData = useMemo(() => {
  if (!bankDetails) return [];
  return tableData.map(item => ({
    ...item,
    value: bankDetails[item.key] || '',
  }));
}, [bankDetails]);
  const getBankDetails = async () => {
    console.log('Fetching bank details...');
    let token = await AsyncStorage.getItem('userToken');
    token = JSON.parse(token || '{}');
    const response = await axios.get(`https://endlessly-outgoing-cowbird.ngrok-free.app/api/bank-details`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    setBankDetails(response.data.data);

  }
  const getAddressDetails = async () => {
    console.log('Fetching address details...');
    let token = await AsyncStorage.getItem('userToken');
    token = JSON.parse(token || '{}');
    const response = await axios.get(`https://endlessly-outgoing-cowbird.ngrok-free.app/api/adress-details`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    setAddressDetails(response.data.data);

  }
  useEffect(() => {
    getBankDetails();
    getAddressDetails();
  }, []);
  return (
    <View style={{flex: 1,backgroundColor:'#C2DFD6',paddingTop:75}}>
      <View>
        {/* Bank details */}
        <View style={{ }}>
          {/* <Text style={{fontSize:16,fontWeight:'bold',paddingVertical:10,alignSelf:'center'}}>OUR BANK DETAILS</Text> */}
          <View style={{width:'100%',backgroundColor:'#fff',padding:10,}}>
            <Image source={require('../../assets/images/bank1.png')} style={{width: '100%', height: 60, resizeMode: 'contain'}}/>
            <View style={{paddingVertical:10,paddingHorizontal:5}}>
              {flatListData.length === 0 ? (
                <Text>Loading bank details...</Text>
              ) : (
                <FlatList
                  data={flatListData}
                  keyExtractor={(item) => item.title}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <Text style={[styles.cell,{width:'40%'}]}>{item.title}</Text>
                      <Text style={[styles.cell,{width:'10%'}]}>:</Text>
                      <Text style={[styles.cell,{width:'50%'}]}>{item.value}</Text>
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        </View>
        {/* Basic Information */}
        <Text style={{fontSize:16,fontWeight:'bold',paddingVertical:5,marginTop:10,alignSelf:'center',borderBottomWidth:1}}>OUR CONTACT DETAILS</Text>
        <View style={{alignItems:'center',marginVertical:10,}}>
          <Text style={{padding: 5,fontWeight:'bold'}}><FontAwesome5 name="phone-alt" size={14} />  Phone : {addressDetails?.phone || ''} </Text>
          <Text style={{padding: 5,fontWeight:'bold',textAlign:'center'}}><Entypo name="mail" size={16} />  Email : {addressDetails?.email || ''} </Text>
          <Text style={{padding: 5,fontWeight:'bold'}}><Entypo name="address" size={16} />  Address : {addressDetails?.address || ''} </Text>
        </View>
        
        {/* follow us */}
        {/* <Text style={{fontSize:16,fontWeight:'bold',marginTop:10,paddingVertical:5,alignSelf:'center',borderBottomWidth:1}}>FOLLOW US ON</Text> */}
        <View style={{flexDirection:'row',gap:10,justifyContent:'center',alignItems:'center',paddingVertical:5}}>
          <TouchableOpacity
            style={styles.directionsButton}
          >
            <Image source={require('../../assets/images/instagram.png')} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.directionsButton}
          >
            <Image source={require('../../assets/images/whatsapp.png')} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.directionsButton}
          >
            <Image source={require('../../assets/images/facebook.png')} style={styles.image} />
          </TouchableOpacity>
        </View>
        {/* Logo */}
        
        <View style={{alignSelf:'center',marginTop:0,justifyContent:'center',padding:10,borderBottomWidth:1}}>
          <Image source={require('../../assets/images/logo.png')} style={{width:200,height:65}} />
        </View>
        <Text style={{fontSize:12,fontWeight:'bold',paddingTop:5,alignSelf:'center',width:'70%',textAlign:'center'}}>Wide collection of customized jewellery</Text>
        <Text style={{fontSize:12,fontWeight:'bold',paddingBottom:5,alignSelf:'center',width:'70%',textAlign:'center'}}> Since 1975 in Amritsar, India</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    paddingHorizontal:10,
    paddingVertical:5,
    // textAlign: 'center',
    fontSize:14
  },
  directionsButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    // backgroundColor:'rgba(0,0,0,0.15)'
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  image:{
    width:60,
    height:60,
  }
})