import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';

const tableData = [
  { title: 'Bank Name', key: 'bank_name' },
  { title: 'Account Name', key: 'account_name' },
  { title: 'Account Number', key: 'account_number' },
  { title: 'IFSC Code', key: 'ifsc_code' },
  { title: 'Branch Name', key: 'branch_name' },
];

export default function BankDetails({ goldcost }: any) {
  const [bankDetails, setBankDetails] = useState(null);
  const [addressDetails, setAddressDetails] = useState(null);

  const flatListData = useMemo(() => {
    if (!bankDetails) return [];
    return tableData.map(item => ({
      ...item,
      value: bankDetails[item.key] || '',
    }));
  }, [bankDetails]);

  const getBankDetails = async () => {
    // console.log('Fetching bank details...');
    try {
      let token = await AsyncStorage.getItem('userToken');
      token = JSON.parse(token || '{}');
      const response = await axios.get(`${config.apiBaseUrl}/bank-details`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept': "application/json"
        },
      });
      if(response.data.data){
        if(response.data.data !== bankDetails){
          setBankDetails(response.data.data);
          await AsyncStorage.setItem('bankDetails', JSON.stringify(response.data.data));
        }
      }
      // console.log('bank details',response.data.data);
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };
  const syncBankDetails = async () => {
      let cacheBankDetails = await AsyncStorage.getItem('bankDetails');
      let cacheAddressDetails = await AsyncStorage.getItem('addressDetails');
      cacheBankDetails = JSON.parse(cacheBankDetails || '{}');
      cacheAddressDetails = JSON.parse(cacheAddressDetails || '{}');
      setBankDetails(cacheBankDetails);
      setAddressDetails(cacheAddressDetails);
  }
  
  const getAddressDetails = async () => {
    // console.log('Fetching address details...');
    try {
      let token = await AsyncStorage.getItem('userToken');
      token = JSON.parse(token || '{}');
      const response = await axios.get(`${config.apiBaseUrl}/adress-details`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept': "application/json"
        },
      });
      if(response.data.data){
        if(response.data.data !== addressDetails){
          setAddressDetails(response.data.data);
          await AsyncStorage.setItem('addressDetails', JSON.stringify(response.data.data));
        }
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
    }
  };

  useEffect(() => {
    syncBankDetails()
    getBankDetails();
    getAddressDetails();
  }, []);
  const getBankImage = (bankName:any) => {
    let nameOfBank = bankName.toLowerCase();
    
    if(nameOfBank.includes('axis')){
      return require('../../assets/images/axis.png');
    }else if(nameOfBank.includes('sbi')){
      return require('../../assets/images/sbi.png');
    }else if(nameOfBank.includes('kotak')){
      return require('../../assets/images/kotak.png');
    }else if(nameOfBank.includes('indu')){
      return require('../../assets/images/indus.png');
    }else if(nameOfBank.includes('icici')){
      return require('../../assets/images/icici.png');
    }
    return require('../../assets/images/hdfc.png');
  }
  return (
    <ScrollView style={{flex:1,marginBottom:'16%'}} >
      <View style={{ flex: 1, backgroundColor: '#C2DFD6', paddingTop: 45 }}>
        {/* Bank details */}
        <View>
          <View style={{ width: '100%', backgroundColor: '#fff', padding: 10 }}>
            <Image
              source={getBankImage(bankDetails?.bank_name ?? 'Loading..')}
              style={{ width: '100%', height: 60, resizeMode: 'contain',marginBottom:10 }}
            />
            <View style={{ paddingVertical: 10, paddingHorizontal: 5 }}>
                <View style={styles.row}>
                  <Text style={[styles.cell, { width: '40%' }]}>Bank Name</Text>
                  <Text style={[styles.cell, { width: '10%' }]}>:</Text>
                  <Text style={[styles.cell, { width: '50%' }]}>{bankDetails?.bank_name ?? 'Loading..'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cell, { width: '40%' }]}>Name</Text>
                  <Text style={[styles.cell, { width: '10%' }]}>:</Text>
                  <Text style={[styles.cell, { width: '50%' }]}>{bankDetails?.account_name ?? 'Loading..'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cell, { width: '40%' }]}>Account Number</Text>
                  <Text style={[styles.cell, { width: '10%' }]}>:</Text>
                  <Text style={[styles.cell, { width: '50%' }]}>{bankDetails?.account_number ?? 'Loading..'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cell, { width: '40%' }]}>IFSC Code</Text>
                  <Text style={[styles.cell, { width: '10%' }]}>:</Text>
                  <Text style={[styles.cell, { width: '50%' }]}>{bankDetails?.ifsc_code ?? 'Loading..'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.cell, { width: '40%' }]}>Branch Name</Text>
                  <Text style={[styles.cell, { width: '10%' }]}>:</Text>
                  <Text style={[styles.cell, { width: '50%' }]}>{bankDetails?.branch_name ?? 'Loading..'}</Text>
                </View>
            </View>
          </View>
        </View>

        {/* Basic Information */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            paddingVertical: 5,
            marginTop: 10,
            alignSelf: 'center',
            borderBottomWidth: 1,
          }}
        >
          OUR CONTACT DETAILS
        </Text>
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ padding: 5, fontWeight: 'bold' }}>
            <FontAwesome5 name="phone-alt" size={14} /> Phone : {addressDetails?.phone || 'Loading..'}
          </Text>
          <Text
            style={{
              padding: 5,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            <Entypo name="mail" size={16} /> Email : {addressDetails?.email || 'Loading..'}
          </Text>
          <Text style={{ padding: 5, fontWeight: 'bold' }}>
            <Entypo name="address" size={16} /> Address : {addressDetails?.address || 'Loading..'}
          </Text>
        </View>

        {/* Follow us */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 5,
          }}
        >
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => {
              const instagramURL = 'instagram://user?username=mohindersinghjeweller';
              const instagramWebURL = 'https://instagram.com/mohindersinghjeweller';
              Linking.canOpenURL(instagramURL).then((supported) => {
                supported ? Linking.openURL(instagramURL) : Linking.openURL(instagramWebURL);
              });
            }}
          >
            <Image source={require('../../assets/images/instagram.png')} style={styles.image} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => {
              const whatsappURL = 'whatsapp://send?phone=+917009985404';
              const whatsappWebURL = 'https://wa.me/+917009985404';
              Linking.canOpenURL(whatsappURL).then((supported) => {
                supported ? Linking.openURL(whatsappURL) : Linking.openURL(whatsappWebURL);
              });
            }}
          >
            <Image source={require('../../assets/images/whatsapp.png')} style={styles.image} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => {
              const facebookURL = 'fb://profile/mohinderjewellers';
              const facebookWebURL = 'https://facebook.com/mohinderjewellers';
              Linking.canOpenURL(facebookURL).then((supported) => {
                supported ? Linking.openURL(facebookURL) : Linking.openURL(facebookWebURL);
              });
            }}
          >
            <Image source={require('../../assets/images/facebook.png')} style={styles.image} />
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View
          style={{
            alignSelf: 'center',
            marginTop: 0,
            justifyContent: 'center',
            padding: 10,
            borderBottomWidth: 1,
          }}
        >
          <Image source={require('../../assets/images/logo.png')} style={{ width: 200, height: 65 }} />
        </View>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            paddingTop: 5,
            alignSelf: 'center',
            width: '70%',
            textAlign: 'center',
          }}
        >
          Wide collection of customized jewellery
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            paddingBottom: 5,
            alignSelf: 'center',
            width: '70%',
            textAlign: 'center',
          }}
        >
          Since 1975 in Amritsar, India
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
  },
  directionsButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  image: {
    width: 60,
    height: 60,
  },
});
