import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const tableData = [
  {title:'Bank Name','value':'HDFC BANK'},
  {title:'Account Name','value':'MOHINDER SINGH JEWELERS'},
  {title:'Account Number','value':'1234567890'},
  {title:'IFSC Code','value':'HDFC0001234'},
  {title:'Branch Name','value':'MAll ROAD, AMRITSAR, PUNJAB'},
]
export default function BankDetails(){
  return (
    <View style={{flex: 1,backgroundColor:'#C2DFD6',paddingTop:75}}>
      <View>
        {/* Bank details */}
        <View style={{ }}>
          {/* <Text style={{fontSize:16,fontWeight:'bold',paddingVertical:10,alignSelf:'center'}}>OUR BANK DETAILS</Text> */}
          <View style={{width:'100%',backgroundColor:'#fff',padding:10,}}>
                <Image source={require('../assets/images/bank1.png')} style={{width: '100%', height: 60, resizeMode: 'contain'}}/>
              <View style={{paddingVertical:10,paddingHorizontal:5}}>
                <FlatList
                  data={tableData}
                  keyExtractor={(item) => item.title.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <Text style={[styles.cell,{width:'40%'}]}>{item.title}</Text>
                      <Text style={[styles.cell,{width:'10%'}]}>::</Text>
                      <Text style={[styles.cell,{width:'50%'}]}>{item.value}</Text>
                    </View>
                  )}
                />
              </View>
          </View>
        </View>
        {/* Basic Information */}
        <Text style={{fontSize:16,fontWeight:'bold',paddingVertical:5,marginTop:10,alignSelf:'center',borderBottomWidth:1}}>OUR CONTACT DETAILS</Text>
        <View style={{alignItems:'center',marginVertical:10,}}>
          <Text style={{padding: 5,fontWeight:'bold'}}><FontAwesome5 name="phone-alt" size={14} />  Phone : +91 1234567890</Text>
          <Text style={{padding: 5,fontWeight:'bold'}}><Entypo name="mail" size={16} />  Email : info@mohindersinghjewellers.com</Text>
          <Text style={{padding: 5,fontWeight:'bold'}}><Entypo name="address" size={16} />  Address : Guru Bazar, Amritsar (143001) </Text>
        </View>
        
        {/* follow us */}
        {/* <Text style={{fontSize:16,fontWeight:'bold',marginTop:10,paddingVertical:5,alignSelf:'center',borderBottomWidth:1}}>FOLLOW US ON</Text> */}
        <View style={{flexDirection:'row',gap:10,justifyContent:'center',alignItems:'center',paddingVertical:5}}>
          <TouchableOpacity
            style={styles.directionsButton}
          >
            <Image source={require('../assets/images/instagram.png')} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.directionsButton}
          >
            <Image source={require('../assets/images/whatsapp.png')} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.directionsButton}
          >
            <Image source={require('../assets/images/facebook.png')} style={styles.image} />
          </TouchableOpacity>
        </View>
        {/* Logo */}
        
        <View style={{alignSelf:'center',marginTop:0,justifyContent:'center',padding:10,borderBottomWidth:1}}>
          <Image source={require('../assets/images/logo.png')} style={{width:200,height:65}} />
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