import { Entypo, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen({ router }:any) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendLoading, setResendLoading] = useState(false);
  const otpInputs = useRef([]);
  const RESEND_OTP_TIME_LIMIT = 60; // 1 minute in seconds
  const [resendTimer, setResendTimer] = useState(0);
  //...
  const [resendDisabled, setResendDisabled] = useState(false);


  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      setResendDisabled(true);
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);
  // Send OTP API
  const handleSendOtp = async () => {
    setLoading(true);
    if(phone.length < 10) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
        text2: "Please enter a valid 10-digit phone number.",
        position: "top",
      });
      return;
    }
    sendOtpAndVerifyUser();
  };
  const sendOtpAndVerifyUser = async () => {
    try {
      const response = await axios.post('http://192.168.137.1/MSJ/msj-backend/public/api/otp/send', { phone });
      let success = successHandler(response);
      if(success){
        setOtpVisible(true);
        setResendTimer(RESEND_OTP_TIME_LIMIT);
      }
    }catch(error){
      errorHandler(error);
    }
  }
  const successHandler = (response:any) => {
    if(response.data.status){
      setLoading(false);
      Toast.show({
        type: "success",
        text1: response.data.message,
        position: "top",
      });
      return true;
    }else{
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: response.data.message,
        position: "top",
        visibilityTime: 5000,
      });
      return false;
    }
  }
  const errorHandler = (error:any) => {
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
  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter a valid 4-digit OTP.",
        position: "top",
      });
      return;
    }
    try {
      const response = await axios.post('http://192.168.137.1/MSJ/msj-backend/public/api/otp/verify', { otp:enteredOtp,phone });
      let success:any = successHandler(response);
      if(success){
        handleModelClose();
        router.navigate('/resetpassword');
      }
    }catch(error){
      errorHandler(error);
    }
  }

  // OTP Input Handler
  const handleOtpInput = (value:any, index:any) => {
    let newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, '');
    setOtp(newOtp);
    // auto-move next
    if (value && index < 3) otpInputs.current[index + 1].focus();
    // auto-submit if last
    // if (index === 3 && value) handleVerifyOtp();
  };
  const handleModelClose = () => {
    setOtpVisible(false);
    setOtp(['', '', '', '']); 
  }

  return (
    <ImageBackground source={require('../assets/images/login.jpg')} style={{flex: 1,marginTop:'10%',justifyContent: 'center'}}>
    <View style={{backgroundColor: 'rgba(255,255,255,0.6)',marginHorizontal:10,borderRadius:10,}}>
      {/* Main Content */}
      <View style={{padding: 20}}>
        <View style={{alignItems: 'center',paddingBottom:20,}}>
          <Image source={require('../assets/images/logo-mini.png')} style={{width:80,height:90}} />
          <View style={{alignItems: 'center',}}>
            <Text style={{fontSize:24,fontWeight:'bold',fontFamily:'serif',textTransform:'uppercase',textAlign:'center'}}>Mohinder Singh Jewellers</Text>
          </View>
        </View>
         <View style={{marginBottom:20,flexDirection: 'row', alignItems: 'center',borderWidth: 1, borderRadius:5}}>
          <View style={{width:'15%',height:30, justifyContent: 'center',borderRightWidth:1,paddingTop:3}}>
            <FontAwesome name="phone" size={24} style={{alignSelf:'center'}} />
          </View>
          <View style={{width:'85%'}}>
            <TextInput style={{width:'100%'}} placeholderTextColor={'#000'} placeholder='Enter your Mobile Number' onChangeText={(value) => setPhone(value)} keyboardType='number-pad'  />
          </View>
        </View>
        <TouchableOpacity onPress={handleSendOtp} disabled={loading} style={{backgroundColor:'white',padding:10,borderRadius:5,borderWidth:2,borderColor:'#C2DFD6'}} > 
          <Text style={[{textAlign:'center',fontWeight:'bold',fontSize:14},(loading? {color:'rgba(0,0,0,0.5)'} : {})]}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
        </TouchableOpacity>
        <View style={{paddingTop:10,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity onPress={() => router.navigate('/')} style={{padding:8,borderRadius:5, width:'35%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Entypo name="login" size={24} style={{transform:[{rotate:'180deg'}]}}/>
            <Text style={{textAlign:'center',fontWeight:'bold',fontSize:16}}> Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <Text style={{fontSize:12,textAlign:'center',fontFamily:'serif',marginTop:10}}>@Copyright 2025 </Text>
        </View>
      </View>
      {/* OTP Drawer Modal */}
      <Modal
        isVisible={otpVisible}
        onBackdropPress={() => handleModelClose()}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        avoidKeyboard
        propagateSwipe
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <View style={{ backgroundColor: 'white', borderTopRightRadius: 16, borderTopLeftRadius: 16, padding: 24 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Enter OTP</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 24 }}>
              {[0,1,2,3].map((i) => (
                <TextInput
                  key={i}
                  ref={el => otpInputs.current[i] = el}
                  style={{
                    borderWidth: 1,
                    borderRadius: 6,
                    textAlign: 'center',
                    marginHorizontal: 8,
                    fontSize: 18,
                    padding: 12,
                    width: 48
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[i]}
                  onChangeText={(val) => handleOtpInput(val, i)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && i > 0) {
                      otpInputs.current[i - 1].focus();
                    }
                  }}
                  autoFocus={i === 0}
                  returnKeyType="next"
                />
              ))}
            </View>
            <TouchableOpacity onPress={verifyOtp} style={{ backgroundColor: '#C2DFD6', padding: 14, borderRadius: 6 }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Verify OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSendOtp} 
              disabled={resendDisabled || resendLoading} 
              style={{ marginTop: 18 }}>
              <Text style={{ 
                color: resendDisabled ? 'rgba(0,0,0,0.3)' : '#007A5E', 
                textAlign: 'center', fontWeight: 'bold' 
              }}>
                {resendDisabled 
                  ? `Resend in 0:${resendTimer < 10 ? `0${resendTimer}` : resendTimer}` 
                  : (resendLoading ? 'Resending...' : "Didn't receive an OTP? Resend")}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <Toast />
      </Modal>
    </View>
    </ImageBackground>
  );
}
