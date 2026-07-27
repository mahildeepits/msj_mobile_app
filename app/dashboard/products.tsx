import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import config from "../config";

// Helper to group products into chunks
const chunkArray = (array: any[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );

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
                    <Image source={{uri: product.image_path}} style={styles.productImage} />
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
  const [products,setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const syncProducts = async () => {
      let cacheProducts = await AsyncStorage.getItem('products');
      cacheProducts = JSON.parse(cacheProducts || '{}');
      setProducts(cacheProducts);
  }
  const getProducts = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      userToken = JSON.parse(userToken || '{}');
      const response = await axios.get(`${config.apiBaseUrl}/products`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
          'Accept': "application/json"
        }
      });
      if(response.data.status){
        let responseData = response.data.data;
        if(hasProductData(responseData) && responseData !== products){
          setProducts(responseData);
          await AsyncStorage.setItem('products',JSON.stringify([responseData]));
        }else if(!hasProductData(responseData) && responseData !== products){
          setProducts([]);
          await AsyncStorage.setItem('products',JSON.stringify([]));
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }
  const hasProductData = (data: any) => {
    if (Array.isArray(data)) {
      // data is an array, check length directly
      return data.length > 0;
    } else if (typeof data === 'object' && data !== null) {
      // data is an object, check if any of its keys have non-empty arrays
      return Object.values(data).some((arr) => Array.isArray(arr) && arr.length > 0);
    }
    // data is null or something else
    return false;
  };
  useEffect(() => {
    syncProducts();
    getProducts()
  },[]);
  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        {isLoading ? (
          <>
          <Text style={styles.rowTitle}>Loading...</Text>
          </>
        ): (
          <>
            {products.length === 0 ? (
              <Text style={styles.rowTitle}>No Products Found</Text>
            ) : (
              products.map((cat, index) => {
                  // console.log('cat',cat);
                  // console.log('index',index);
                  const title = Object.keys(cat)[0];
                  const data = Object.values(cat)[0] as any[];
                  return <ProductRow key={index} title={title} data={data} onImagePress={setSelectedProduct} />;
                })
            )}
          </>
        )
        }
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
                <Image source={{uri: selectedProduct.image_path}} style={styles.fullImage} resizeMode="contain" />

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
