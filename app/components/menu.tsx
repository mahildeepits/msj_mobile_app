import { Entypo, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNotifications } from '../dashboard/notificationContext';


export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { hasUnread } = useNotifications();
  
  // Animation values
  const slideAnim = React.useRef(new Animated.Value(-Dimensions.get('window').width)).current;
  
  useEffect(() => {
    const current:any = segments[segments.length - 1];
    if (current === undefined || current === 'dashboard') {
      setIsDashboard(true);
    } else {
      setIsDashboard(false);
    }
  }, [segments]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? 0 : -Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);
  useEffect(() => {
    const getUser = async () => {
      let userJson:any  = await AsyncStorage.getItem('user');
      userJson = JSON.parse(userJson);
      if(!userJson && userJson !== null) {
        setUser(userJson || null);
      }
    }
    getUser();
  },[]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (route: any) => {
    setMenuOpen(false);
    router.navigate(route);
  };

  const handleLogout = () => {
    console.log('herree');
    setMenuOpen(false);

    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('user');
            Toast.show({
              type: "success",
              text1: "Logged out successfully",
              position: "top",
              visibilityTime: 1000,
              onHide: () => {
                router.navigate('/');
              },
            });
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      {/* Overlay when menu is open */}
      {menuOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setMenuOpen(false)}
        />
      )}
      
      {/* Side Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.drawerContent}>
          <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center',paddingHorizontal:20,paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#f0f0f0'}}>
            {/* Logo */}
            <Image 
              source={require('../../assets/images/logo.png')} // Replace with your logo path
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => setMenuOpen(false)} >
              <Entypo name="chevron-left" size={24} style={{alignSelf:'center'}} />
            </TouchableOpacity>
          </View>
          
          {/* Menu Items */}
          <TouchableOpacity 
            style={[styles.menuItem,(segments[segments.length - 1] == 'profile')? {backgroundColor:'white'} : {}]}
            onPress={() => navigateTo('/dashboard/profile')}
          >
            <FontAwesome name="user-circle" size={18} color="#333" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.menuItem,(segments[segments.length - 1] == 'products')? {backgroundColor:'white'} : {}]}
            onPress={() => navigateTo('/dashboard/products')}
          >
            <FontAwesome name="gift" size={18} color="#333" />
            <Text style={styles.menuText}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.menuItem, (segments[segments.length - 1] == 'notifications') ? { backgroundColor:'white' } : {}]}
            onPress={() => navigateTo('/dashboard/notifications')}
          >
            <Entypo name="bell" size={18} color="#333" />
            <Text style={styles.menuText}>Notifications</Text>
            {hasUnread && <View style={styles.redDot} />}
          </TouchableOpacity>
          {/* Add more menu items as needed */}
          
        </View>
        <View style={{position:'absolute',bottom:'0%'}}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => handleLogout()}
          >
            <Text style={styles.logoutText}>Logout</Text>
            <Entypo name="log-out" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Header */}
      <View style={[styles.header, (!isDashboard) ? styles.menuShadow : {}]}>
        <View style={styles.container}>
          <TouchableOpacity onPress={toggleMenu} style={{ position: 'relative' }}>
            <Entypo name="menu" size={30} color={isDashboard ? 'white' : 'black'}/>
            {hasUnread && <View style={styles.topbarRedDot} />}
          </TouchableOpacity>
          {!isDashboard && (
            <>
              <Text style={styles.headerText}>
                {(segments[segments.length - 1] == 'bankdetails')? 'Bank Details' : segments[segments.length - 1]}
              </Text>
              <TouchableOpacity onPress={() => router.navigate('/dashboard')}>
                <Entypo name="chevron-left" size={30} style={{alignSelf:'center'}} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    width: '100%',
    paddingTop: 10,
    paddingBottom: 5,
  },
  menuShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor:'#C2DFD6'
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    width: '50%',
    textAlign: 'center'
  },
  container: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    top:0,
    left: 0,
    width: Dimensions.get('window').width * 0.75,
    height: '100%',
    backgroundColor: '#C2DFD6',
    zIndex: 10000,
  },
  drawerContent: {
    // padding: 20,
  },
  logo: {
    width: '50%',
    height: 40,
    alignSelf: 'center',
    // marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
  },
  logoutButton:{
    flexDirection: 'row',
    width:'100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutText:{
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginLeft: 6,
    alignSelf: 'center',
  },
  topbarRedDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'white', // optional, to create a white border around red dot for better visibility
    zIndex: 10,
  },
});