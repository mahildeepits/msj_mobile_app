import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get("window");

const features = [
  { 
    id: 1, 
    image: require("../../assets/images/bis-mark.png"), 
    text: "BIS\nHALLMARKED",
    description: "All our jewellery is BIS Hallmarked ensuring the highest quality and purity."
  },
  { 
    id: 2, 
    image: require("../../assets/images/best-design.png"), 
    text: "BEST\nDESIGNS",
    description: "We provide the best and latest jewellery designs for every occasion."
  },
  { 
    id: 3, 
    image: require("../../assets/images/customize.png"), 
    text: "CUSTOMIZE\nOPTIONS",
    description: "Personalize your jewellery with our easy and flexible customization options."
  },
  { 
    id: 4, 
    image: require("../../assets/images/certified.png"), 
    text: "CERTIFIED\nJEWELERY",
    description: "Certified jewellery with assurance of authenticity and quality."
  },
  { 
    id: 5, 
    image: require("../../assets/images/easy-exchange.png"), 
    text: "EASY\nEXCHANGE",
    description: "Hassle-free exchange policy to make your purchases risk-free."
  },
  { 
    id: 6, 
    image: require("../../assets/images/heavy-discount.png"), 
    text: "HEAVY\nDISCOUNT",
    description: "Huge discounts available on selected items for a limited time."
  }
];

export default function Features() {
  const router = useRouter();
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);

  // State for modal
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % 2;
      scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
      setCurrentSlide(nextSlide);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleFeaturePress = (feature:any) => {
    setSelectedFeature(feature);
    setModalVisible(true);
  };

  const renderFeatureBox = (feature:any) => (
    <TouchableOpacity 
      key={feature.id} 
      style={styles.featureBox}
      onPress={() => handleFeaturePress(feature)}
    >
      <Image source={feature.image} style={{ width: 30, height: 30 }} />
      <Text style={styles.featureText}>{feature.text}</Text>
    </TouchableOpacity>
  );

  const handleMomentumScrollEnd = (event:any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <>
    <View>
      {/* Features Scroll */}
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
          {features.slice(0, 3).map(renderFeatureBox)}
          {features.slice(3, 6).map(renderFeatureBox)}
        </ScrollView>
      </View>
    </View>
    {/* Feature Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFeature && (
              <>
                <Image 
                  source={selectedFeature.image} 
                  style={{ width: 50, height: 50, marginBottom: 10 }} 
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>
                  {selectedFeature.text.replace("\n", " ")}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedFeature.description}
                </Text>
              </>
            )}
            <Pressable 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      </>
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
    width: width * 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent:'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20
  },
  closeButton: {
    backgroundColor: '#54595F',
    paddingHorizontal: 20,
    paddingVertical: 10 ,
    borderRadius: 5
  }
});
