import { FontAwesome5 } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from 'axios'
import { ImageBackground } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import config from './config'

export default function ResetPassword(){
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user_phone } = useLocalSearchParams();
  const handleResetPassword = async () => {
    setLoading(true);

    if(password === '' || confirmPassword === ''){
      setLoading(false);
      Alert.alert('Please enter all required fields');
      return;
    }
    if(password !== confirmPassword){
      setLoading(false);
      Alert.alert('Passwords do not match');
      return;
    }

    try{
      const response = await axios.post(`${config.apiBaseUrl}/reset-password`,{
        phone: user_phone,
        password: password,
        confirm_password: confirmPassword,
      },{headers: {"Content-Type": "application/json","Accept": "application/json"},});

      if(response.data.status){
        Toast.show({
          type: "success",
          text1: response.data.message,
          text2: 'Redirecting to login...',
          position: "top",
          visibilityTime: 2000,
        });

        // (Optional) Store token or user if API sends back
        if(response.data.token){
          await AsyncStorage.setItem('userToken', JSON.stringify(response.data.token));
        }

        setTimeout(() => {
          setLoading(false);
          router.replace('/'); // Navigate back to login
        },2000);
      } else {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Reset Error",
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
            // console.log(key, errArr);
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
        // console.log('here',message,error?.response?.data?.errors);
    }
  }

  return (
    <>
      <ImageBackground source={require('../assets/images/login.jpg')} style={{flex: 1,marginTop:'10%'}}>
        <KeyboardAvoidingView
          style={{flex: 1,flexDirection:'row',justifyContent:'center',alignItems:'center',}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={{paddingVertical: 20,}} 
            showsVerticalScrollIndicator={false}
          >
            <View style={{marginTop:'10%',backgroundColor: 'rgba(255,255,255,0.6)',marginHorizontal:10,borderRadius:10}}>
              <View style={{alignItems: 'center',paddingTop:20}}>
                <Image source={require('../assets/images/logo-mini.png')} style={{width:80,height:90}} />
                <Text style={{fontSize:22,fontWeight:'bold',fontFamily:'serif',textTransform:'uppercase',textAlign:'center'}}>Mohinder Singh Jewellers</Text>
              </View>
              <View style={{ width: '100%',paddingHorizontal:20,paddingVertical:15}}>
                
                {/* New Password */}
                <View style={{marginBottom:20,flexDirection: 'row', alignItems:'center',borderWidth: 1, borderRadius:5}}>
                  <View style={{width:'15%',height:30,justifyContent:'center',borderRightWidth:1,paddingTop:3}}>
                    <FontAwesome5 name="lock" size={20} style={{alignSelf:'center'}} />
                  </View>
                  <View style={{width:'85%',flexDirection:'row', alignItems:'center'}}>
                    <TextInput 
                      style={{width:'85%'}} 
                      placeholder='Enter New Password' 
                      onChangeText={(value) => setPassword(value)} 
                      secureTextEntry={!showPassword}  
                    />
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

                {/* Confirm Password */}
                <View style={{marginBottom:20,flexDirection: 'row', alignItems:'center',borderWidth: 1, borderRadius:5}}>
                  <View style={{width:'15%',height:30,justifyContent:'center',borderRightWidth:1,paddingTop:3}}>
                    <FontAwesome5 name="lock" size={20} style={{alignSelf:'center'}} />
                  </View>
                  <View style={{width:'85%',flexDirection:'row', alignItems:'center'}}>
                    <TextInput 
                      style={{width:'85%'}} 
                      placeholder='Confirm New Password' 
                      onChangeText={(value) => setConfirmPassword(value)} 
                      secureTextEntry={!showConfirmPassword} 
                    />
                    {showConfirmPassword ? (
                      <TouchableOpacity onPress={() => setShowConfirmPassword(false)} style={{width:'15%',alignItems:'center', borderLeftWidth:1,padding:5}}>
                        <FontAwesome5 name="eye" size={16} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => setShowConfirmPassword(true)} style={{width:'15%',alignItems:'center', borderLeftWidth:1,padding:5}}>
                        <FontAwesome5 name="eye-slash" size={16} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Submit Button */}
                <View style={{paddingBottom:10}}>
                  <TouchableOpacity style={{backgroundColor:'white',padding:10,borderRadius:5,borderWidth:2,borderColor:'#C2DFD6'}} onPress={() => handleResetPassword()} disabled={loading}>
                    <Text style={[{textAlign:'center',fontWeight:'bold',fontSize:14},(loading? {color:'rgba(0,0,0,0.5)'} : {})]}>
                      {loading ? 'Resetting...' : 'RESET PASSWORD'}
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  )
}
