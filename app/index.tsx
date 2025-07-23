import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { ImageBackground } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
export default function Index(){
  const router = useRouter();
  return (
    <>
      <ImageBackground source={require('../assets/images/login.jpg')} style={{flex: 1,marginTop:'10%'}}>
        <View style={{flex: 1,justifyContent:'center',}}>
          <View style={{marginTop:'0%',backgroundColor: 'rgba(255,255,255,0.6)',marginHorizontal:10,borderRadius:10}}>
            <View style={{alignItems: 'center',paddingVertical:20,}}>
              <Image source={require('../assets/images/logo-mini.png')} style={{width:105,height:120}} />
              <View style={{alignItems: 'center',}}>
                <Text style={{fontSize:24,fontWeight:'bold',fontFamily:'serif',textTransform:'uppercase',textAlign:'center'}}>Mohinder Singh Jewellers</Text>
              </View>
            </View>
            <View style={{ width: '100%',paddingHorizontal:20,paddingVertical:15,}}>
              <Text style={{fontSize: 14,marginBottom:15,textAlign: 'center',textTransform: 'uppercase',fontWeight:'bold'}}>Welcome to Our Mobile App</Text>
              {/* <Text style={{fontSize: 20,marginBottom:10,paddingBottom:10,fontWeight: 'bold',textAlign: 'center'}}>Login</Text> */}
              <View style={{marginBottom:20,flexDirection: 'row', alignItems: 'center',borderWidth: 1, borderRadius:5}}>
                <Text style={{width:'15%',height:30, textAlign: 'center',borderRightWidth:1,paddingTop:3}}> <FontAwesome name="user" size={24} style={{alignSelf:'center'}} /></Text>
                <View style={{}}>
                  <TextInput placeholder='Enter your username'  />
                </View>
              </View>
              <View style={{marginBottom:20,flexDirection: 'row', alignItems: 'center',borderWidth: 1, borderRadius:5}}>
                <Text style={{width:'15%',height:30, textAlign: 'center',borderRightWidth:1,paddingTop:3}}> <MaterialIcons name='password' size={24} /></Text>
                <View style={{}}>
                  <TextInput placeholder='Enter your password' secureTextEntry={true}  />
                </View>
              </View>
              <View>
                <TouchableOpacity style={{backgroundColor:'white',padding:10,borderRadius:5,borderWidth:2,borderColor:'#C2DFD6'}} onPress={() => {router.push('/dashboard')}} >
                  <Text style={{textAlign:'center',fontWeight:'bold',fontSize:14}}>SIGN IN</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row', justifyContent:'center',marginTop:10}}>
                  <Text>forgot password? </Text><TouchableOpacity ><Text style={{color:'#007A5E',fontWeight:'bold'}}>Click here</Text></TouchableOpacity>
                </View>
              </View>
              <View style={{paddingTop:20,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={{padding:8,borderRadius:5,backgroundColor:'white', width:'35%',borderWidth:2,borderColor:'#C2DFD6'}}>
                  <Text style={{textAlign:'center',fontWeight:'bold',fontSize:12}}>SIGN UP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{alignItems: 'center',position:'absolute',bottom:'2%',width:'100%'}}>
          <Text style={{fontSize:12,width:'65%',textAlign:'center',fontFamily:'serif',}}>@Copyright 2025 </Text>
        </View>
      </ImageBackground>
    </>
  )
}

