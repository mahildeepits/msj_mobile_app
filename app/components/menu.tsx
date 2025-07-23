import { Entypo } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (route: any) => {
    setMenuOpen(false);
    router.push(route);
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
          <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center',padding:20}}>
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
          {/* <TouchableOpacity 
            style={[styles.menuItem,(segments[segments.length - 1] == 'dashboard')? {backgroundColor:'white'} : {}]}
            onPress={() => navigateTo('/dashboard')}
          >
            <MaterialIcons name="dashboard" size={18} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity> */}
          
          {/* Add more menu items as needed */}
          
        </View>
        <View style={{position:'absolute',bottom:'0%'}}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => navigateTo('/index')}
          >
            <Text style={styles.logoutText}>Logout</Text>
            <Entypo name="log-out" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Header */}
      <View style={[styles.header, (!isDashboard) ? styles.menuShadow : {}]}>
        <View style={styles.container}>
          <TouchableOpacity onPress={toggleMenu}>
            <Entypo name="menu" size={30} />
          </TouchableOpacity>
          {!isDashboard && (
            <>
              <Text style={styles.headerText}>
                {(segments[segments.length - 1] == 'bankdetails')? 'Bank Details' : segments[segments.length - 1]}
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
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
    paddingTop: 40,
    paddingBottom: 5,
  },
  menuShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    top: 0,
    left: 0,
    width: Dimensions.get('window').width * 0.75,
    height: '100%',
    backgroundColor: '#C2DFD6',
    zIndex: 10000,
    paddingTop: 30,
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
  }
});