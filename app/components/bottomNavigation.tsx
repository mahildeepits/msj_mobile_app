import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function BottomNavigation(){
    const router = useRouter();
    const segments = useSegments(); 
    const [routeName, setRouteName] = useState('');
    const handleRouting = (route: any) => {
        if(!route.includes(routeName) && (routeName !== 'index' || route !== '/')){
            router.push(route);
        }
    }
    useEffect(() => {
        const current:any = segments[segments.length - 1];
        if (current === undefined || current === 'index') {
          setRouteName('index');
        } else {
          setRouteName(current);
        }
      }, [segments]);
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => handleRouting('/dashboard')}>
                <Ionicons name="home-outline" size={22} style={[routeName === 'dashboard'? styles.active : styles.inactive]} />
                <Text style={[styles.navLabel,routeName === 'dashboard'? styles.active : styles.inactive]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handleRouting('/calculator')}>
                <FontAwesome5 name="calculator" size={22} style={[routeName === 'calculator'? styles.active : styles.inactive]} />
                <Text style={[styles.navLabel,routeName === 'calculator'? styles.active : styles.inactive]}>Calculator</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handleRouting('/bankdetails')}>
                <Ionicons name="business-outline" size={22} style={[routeName === 'bankdetails'? styles.active : styles.inactive]}/>
                <Text style={[styles.navLabel,routeName === 'bankdetails'? styles.active : styles.inactive]}>Bank Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handleRouting('/bankdetails')}>
                <Ionicons name="business-outline" size={22} style={[routeName === 'bankdetails'? styles.active : styles.inactive]}/>
                <Text style={[styles.navLabel,routeName === 'bankdetails'? styles.active : styles.inactive]}>Bank Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handleRouting('/bankdetails')}>
                <Ionicons name="business-outline" size={22} style={[routeName === 'bankdetails'? styles.active : styles.inactive]}/>
                <Text style={[styles.navLabel,routeName === 'bankdetails'? styles.active : styles.inactive]}>Bank Details</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,1)",
    paddingTop: 10,
    paddingBottom: 5,
  },
  navItem: {
    alignItems: "center",
    width:'33%'
  },
  navLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  active: {
    color: "green",
  },
  inactive: {
    color: "black",
  },
});