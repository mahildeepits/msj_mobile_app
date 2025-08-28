import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Helper to group products into chunks
const chunkArray = (array: any[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );

// Categories Data
const categories = [
  {
    Earrings: [
      { id: "1", image: require("../../assets/images/slider/3.jpg"), name: "Earing Design 1" },
      { id: "2", image: require("../../assets/images/slider/7.jpg"), name: "Earing Design 2" },
      { id: "3", image: require("../../assets/images/slider/3.jpg"), name: "Earing Design 3" },
      { id: "4", image: require("../../assets/images/slider/7.jpg"), name: "Earing Design 4" },
    ],
  },
  {
    Necklaces: [
      { id: "1", image: require("../../assets/images/slider/2.jpg"), name: "Necklace Design 1" },
      { id: "2", image: require("../../assets/images/slider/6.jpg"), name: "Necklace Design 2" },
      { id: "3", image: require("../../assets/images/slider/2.jpg"), name: "Necklace Design 3" },
      { id: "4", image: require("../../assets/images/slider/6.jpg"), name: "Necklace Design 4" },
    ],
  },
  {
    bangles: [
      { id: "1", image: require("../../assets/images/slider/4.jpg"), name: "Bangle Design 1" },
      { id: "2", image: require("../../assets/images/slider/1.jpg"), name: "Bangle Design 2" },
      { id: "3", image: require("../../assets/images/slider/8.jpg"), name: "Bangle Design 3" },
      { id: "4", image: require("../../assets/images/slider/9.jpg"), name: "Bangle Design 4" },
    ],
  },
  {
    rings: [
      { id: "1", image: require("../../assets/images/slider/5.jpg"), name: "Ring Design 1" },
      { id: "2", image: require("../../assets/images/slider/10.jpg"), name: "Ring Design 2" },
      { id: "3", image: require("../../assets/images/slider/5.jpg"), name: "Ring Design 3" },
      { id: "4", image: require("../../assets/images/slider/10.jpg"), name: "Ring Design 4" },
    ],
  },
];

// Product Row Component
const ProductRow = ({ title, data, onImagePress }: { title: string; data: any[]; onImagePress: (product: any) => void }) => {
  const pairs = chunkArray(data, 1);

  return (
    <View style={{ marginBottom: 0 }}>
      <Text style={styles.rowTitle}>{title} </Text>
      <View style={{ paddingVertical: 10 }}>
        <FlatList
          data={pairs}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.pairContainer}>
              {item.map((product: any) => (
                <TouchableOpacity key={product.id} onPress={() => onImagePress(product)}>
                  <View style={{ alignItems: "center" }}>
                    <Image source={product.image} style={styles.productImage} />
                    <Text
                      style={{
                        fontSize: 13,
                        textTransform: "capitalize",
                        fontWeight: "500",
                        paddingTop: 4,
                        textAlign: "center",
                        width: IMAGE_SIZE,
                      }}
                    >
                      {product.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>
    </View>
  );
};

// Main Screen
export default function ProductsScreen() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        {categories.map((cat, index) => {
          const title = Object.keys(cat)[0];
          const data = Object.values(cat)[0] as any[];
          return <ProductRow key={index} title={title} data={data} onImagePress={setSelectedProduct} />;
        })}
      </View>

      {/* Full-Screen Modal */}
      <Modal visible={!!selectedProduct} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedProduct && (
              <>
                {/* Name on top */}
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>

                {/* Full-width Image */}
                <Image source={selectedProduct.image} style={styles.fullImage} resizeMode="contain" />

                {/* Close Button */}
                <Pressable style={styles.closeBtn} onPress={() => setSelectedProduct(null)}>
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>✕</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Sizes
const IMAGE_SIZE = (Dimensions.get("window").width - 60) / 3.25;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C2DFD6",
    marginTop: 45,
    marginBottom: 50,
    paddingBottom: 50,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    borderBottomWidth: 1,
    padding: 5,
    textTransform: "uppercase",
    textAlign: "center",
    borderBottomColor: "#f0f0f0",
    backgroundColor: "white",
    marginVertical: 10,
  },
  pairContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
  },
  productImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: "#f4f4f4",
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  fullImage: {
    width: "100%",
    height: Dimensions.get("window").height * 0.6,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
  },
});
