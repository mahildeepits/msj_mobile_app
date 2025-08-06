import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get("window");
const features = [
  { id: 1, image: require("../../assets/images/bis-mark.png"), text: "BIS\nHALLMARKED" },
  { id: 2, image: require("../../assets/images/best-design.png"), text: "BEST\nDESIGNS" },
  { id: 3, image: require("../../assets/images/customize.png"), text: "CUSTOMIZE\nOPTIONS" },
  { id: 4, image: require("../../assets/images/certified.png"), text: "CERTIFIED\nJEWELERY" },
  { id: 5, image: require("../../assets/images/easy-exchange.png"), text: "EASY\nEXCHANGE" },
  { id: 6, image: require("../../assets/images/heavy-discount.png"), text: "HEAVY\nDISCOUNT" }
];

export default function Features() {
  const router = useRouter();
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);

  // Auto-slide (retain functionality, optional)
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % 2;
      // Scroll to next page
      scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
      setCurrentSlide(nextSlide);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const renderFeatureBox = (feature:any) => (
    <TouchableOpacity key={feature.id} style={styles.featureBox} >
      <Image source={feature.image} style={{ width: 30, height: 30 }} />
      <Text style={styles.featureText}>{feature.text}</Text>
    </TouchableOpacity>
  );

  // Handling manual swipe
  const handleMomentumScrollEnd = (event:any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <View style={styles.featuresContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.featuresRow}
      >
        {/* First slide: features 0 to 2 */}
        {features.slice(0, 3).map(renderFeatureBox)}

        {/* Second slide: features 3 to 5 */}
        {features.slice(3, 6).map(renderFeatureBox)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  featuresContainer: {
    backgroundColor: "rgba(0,0,0,0.10)",
    paddingVertical: 10,
    overflow: 'hidden',
  },
  featuresRow: {
    flexDirection: 'row',
    width: width * 2, // for two pages
  },
  featureBox: {
    alignItems: "center",
    width: width / 3,
    paddingHorizontal: 5,
  },
  featureText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: '#54595F'
  },
});
