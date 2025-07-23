import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebView } from "react-native-webview";
import Features from "./components/features";
import GoldRates from "./components/goldrates";

const { width } = Dimensions.get("window");

const images = [
  require("../assets/images/bg-image.jpg"),
  require("../assets/images/bg-image1.jpg"),
  require("../assets/images/bg-image2.jpg"),
  require("../assets/images/bg-image3.jpg"),
];

export default function Dashboard() {
  const sliderRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#C2DFD6', marginBottom: '16%' }}>
      <View style={{ height: 250 }}>
        
        
        {/* Background slider */}
        <FlatList
          ref={sliderRef}
          data={images}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ImageBackground source={item} style={styles.backgroundImage} />
          )}
          style={styles.slider}
        />
        
        {/* Dot Indicators */}
        <View style={styles.dotContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        
        {/* Static Logo */}
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        </View>
      </View>

      {/* Animated Feature Boxes */}
      <Features />

      {/* Gold Price Box */}
      <GoldRates />

      {/* Other Carats rate boxes */}
      {/* <Text>All Gold Rates By Purity and Quality</Text> */}
      <Text style={styles.caratMainText}>All Gold Rates With Purity </Text>
      <View style={styles.caratBoxMainContainer}>
        <View style={styles.caratBoxContainer}>
          <TouchableOpacity style={styles.caratBox}>
            <Text style={styles.caratText}><FontAwesome5 name="coins" size={14} color="#007A5E" /> 22 K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.caratBox}>
            <Text style={styles.caratText}><FontAwesome5 name="coins" size={14} color="#007A5E" /> 20 K</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.caratBoxContainer}>
          <TouchableOpacity style={styles.caratBox}>
            <Text style={styles.caratText}><FontAwesome5 name="coins" size={14} color="#007A5E" /> 18 K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.caratBox}>
            <Text style={styles.caratText}><FontAwesome5 name="coins" size={14} color="#007A5E" /> 14 K</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Timing Bar */}
      <View style={styles.timingBar}>
        <Ionicons name="time-outline" size={18} />
        <Text style={styles.timingText}>  Our Today's Timing : 10AM - 9PM</Text>
      </View> 
      
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{
            html: `<!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <style>
                    html, body {
                      margin: 0;
                      padding: 0;
                      height: 100%;
                      width: 100%;
                    }
                    iframe {
                      border: 0;
                      width: 100%;
                      height: 100%;
                    }
                  </style>
                </head>
                <body>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.553610232007!2d74.872304!3d31.6207555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39197b56f2cd8541%3A0x89dbada23c0531fb!2sMohinder%20Singh%20Jewellers!5e0!3m2!1sen!2sin!4v1721200000000"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </body>
              </html>`
          }}
          style={{ flex: 1 }}
        />
      </View>


      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  slider: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 250,
  },
  backgroundImage: {
    width: width,
    height: 250,
  },
  dotContainer: {
    position: "absolute",
    top: 230,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
  },
  logoContainer: {
    marginTop: 140,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    zIndex: 1,
    boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
  },
  logo: {
    width: 180,
    resizeMode: "contain",
  },
  timingBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10
  },
  timingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  mapContainer: {
    height: 200,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  caratBoxMainContainer:{
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal:20,
    paddingVertical:10,
    marginBottom:20,
  },
  caratBoxContainer:{
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 5
  },
  caratBox:{
    // backgroundColor: "white",
    borderBottomColor:'rgba(0,0,0,0.5)',
    borderBottomWidth:2,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius:10,
    alignItems: "center",
  },
  caratText:{
    fontSize:16,
    fontWeight:'bold',
  },
  caratMainText:{
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor:'#C2DFD6',
    width:'100%',
    alignSelf:'center',
    borderRadius:2,
    color:'rgba(0,0,0,1)',
    textTransform:'uppercase',
    paddingVertical:10
  }
});
