import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, StyleSheet, View } from 'react-native';
const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/bg-image.jpg"),
  require("../../assets/images/bg-image1.jpg"),
  require("../../assets/images/bg-image2.jpg"),
  require("../../assets/images/bg-image3.jpg"),
];

export default function Slider(){
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
    <View style={{ height: 250 }}>
        
        
        {/* Background slider */}
        <FlatList
            ref={sliderRef}
            data={images}
            horizontal
            pagingEnabled
            scrollEnabled={true} // <- allow manual swipe
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
                <ImageBackground source={item} style={styles.backgroundImage} />
            )}
            style={styles.slider}
            onMomentumScrollEnd={(event) => {
                // Update index when user scrolls manually
                const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / width
                );
                setCurrentIndex(newIndex);
            }}
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
          <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        </View>
      </View>
  )
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
});