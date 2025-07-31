import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from 'axios'
import { ImageBackground } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

export default function Index(){
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    if(phone == '' || password == ''){
      setLoading(false);
      Alert.alert('Please fill valid email and password ');
      return;
    }
    try{
      const response = await axios.post('http://192.168.137.1/MSJ/msj-backend/public/api/login',{phone,password});
      console.log('therere',response.data);
      if(response.data.status){
        Toast.show({
          type: "success",
          text1: response.data.message,
          text2: 'Redirecting to dashboard...',
          position: "top",
          visibilityTime: 2000,
        });
        // Navigate to the home screen or any other screen
        await AsyncStorage.setItem('userToken', JSON.stringify(response.data.token));
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        setTimeout(() => {
          setLoading(false);
          router.navigate('/dashboard');
        }, 2000);
      }else{
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Login Error",
          text2: response.data.message,
          position: "top",
          visibilityTime: 5000,
        });
      }
      
    }catch(error){
      setLoading(false);
      let message = "Something went wrong. Please try again.";
      if (error?.response?.data?.message) {
        message = error?.response.data.message;
      }
      if(error?.response?.data?.errors){
        const errorsObject = error?.response.data.errors;
        if (Array.isArray(errorsObject)) {
          errorsObject.forEach((err) => {
            message = `${err}`;
          });
        } else if (typeof errorsObject === 'object') {
          // If errors is an object (key: array of messages)
          Object.entries(errorsObject).forEach(([key, errArr]) => {
            console.log(key, errArr);
            message = `${errArr[0]}`;
          });
        }
      }
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: message,
        position: "top",
        visibilityTime: 5000,
      });
      console.log('here',message,error?.response.data);
    }
  }
  return (
    <>
      <ImageBackground source={require('../assets/images/login.jpg')} style={{flex: 1,marginTop:'10%'}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={{
              paddingVertical: 20,
              flexDirection: 'column'
            }}
            showsVerticalScrollIndicator={true}
            bounces={false}
          >
            <View key={'form'} style={{marginTop:'25%',backgroundColor: 'rgba(255,255,255,0.6)',marginHorizontal:10,borderRadius:10,}}>
              <View style={{alignItems: 'center',paddingTop:20,}}>
                <Image source={require('../assets/images/logo-mini.png')} style={{width:80,height:90}} />
                <View style={{alignItems: 'center',}}>
                  <Text style={{fontSize:24,fontWeight:'bold',fontFamily:'serif',textTransform:'uppercase',textAlign:'center'}}>Mohinder Singh Jewellers</Text>
                </View>
              </View>
              <View style={{ width: '100%',paddingHorizontal:20,paddingVertical:15,}}>
                <Text style={{fontSize: 14,marginBottom:15,textAlign: 'center',textTransform: 'uppercase',fontWeight:'bold'}}>Welcome to Our Mobile App</Text>
                {/* <Text style={{fontSize: 20,marginBottom:10,paddingBottom:10,fontWeight: 'bold',textAlign: 'center'}}>Login</Text> */}
                <View style={{marginBottom:20,flexDirection: 'row', alignItems: 'center',borderWidth: 1, borderRadius:5}}>
                  <View style={{width:'15%',height:30, justifyContent: 'center',borderRightWidth:1,paddingTop:3}}>
                    <FontAwesome name="phone" size={24} style={{alignSelf:'center'}} />
                  </View>
                  <View style={{width:'85%'}}>
                    <TextInput style={{width:'100%'}} placeholder='Enter your Mobile Number' onChangeText={(value) => setPhone(value)} keyboardType='number-pad'  />
                  </View>
                </View>
                <View style={{marginBottom:20,flexDirection: 'row', alignItems: 'center',borderWidth: 1, borderRadius:5}}>
                  <View style={{width:'15%',height:30,justifyContent: 'center',borderRightWidth:1,paddingTop:3}}> 
                    <MaterialIcons name='password' size={24} style={{alignSelf:'center'}} />
                  </View>
                  <View style={{width:'85%',flexDirection:'row', alignItems: 'center'}}>
                    <TextInput style={{width:'85%'}} placeholder='Enter your password' onChangeText={(value) => setPassword(value)} secureTextEntry={!showPassword}  />
                    {showPassword ? (
                      <TouchableOpacity onPress={() => setShowPassword(false)} style={{width:'15%',alignItems:'center', borderLeftWidth:1,padding:5}}>
                        <FontAwesome5 name="eye" size={16} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => setShowPassword(true)} style={{width:'15%',alignItems:'center', borderLeftWidth:1,padding:5}}>
                        <FontAwesome5 name="eye-slash" size={16} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View>
                  <TouchableOpacity style={{backgroundColor:'white',padding:10,borderRadius:5,borderWidth:2,borderColor:'#C2DFD6'}} disabled={loading} onPress={() => handleLogin()}  >  {/*- router.navigate('/dashboard') -*/}
                    <Text style={[{textAlign:'center',fontWeight:'bold',fontSize:14},(loading? {color:'rgba(0,0,0,0.5)'} : {})]}>{loading? 'Loading...' : 'SIGN IN'}</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                    <Text>Forgot password? </Text>
                    <TouchableOpacity >
                      <Text style={{color:'#007A5E',fontWeight:'bold'}}>Click here</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{paddingTop:15,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity onPress={() => router.navigate('/signup')} style={{padding:8,borderRadius:5,backgroundColor:'white', width:'35%',borderWidth:2,borderColor:'#C2DFD6'}}>
                    <Text style={{textAlign:'center',fontWeight:'bold',fontSize:12}}>SIGN UP</Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop:20}}>
                  <Text style={{fontSize:12,textAlign:'center',fontFamily:'serif'}}>@Copyright 2025 </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  )
};
