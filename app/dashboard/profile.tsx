import { Entypo, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import Toast from "react-native-toast-message";
import config from "../config";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Change Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch current profile data from AsyncStorage
  const getProfileData = async () => {
    let user = await AsyncStorage.getItem("user");
    user = JSON.parse(user || "{}");
    setUser(user);
    setName(user?.name || "");
    setCity(user?.city_name || "");
    setPhone(user?.phone || "");
  };

  // Update profile data API
  const updateProfileData = async () => {
    try {
      setLoading(true);
      let token = await AsyncStorage.getItem("userToken");
      token = JSON.parse(token || "{}");

      const response = await axios.post(
        `${config.apiBaseUrl}/profile`,
        { name, city, phone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let res = successHandler(response);
      if (!res) getProfileData();
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  // Change Password API
  const handleResetPassword = async () => {
      setLoading(true);
      if(newPassword === '' || confirmPassword === ''){
        setLoading(false);
        Alert.alert('Please enter all required fields');
        return;
      }
      if(newPassword !== confirmPassword){
        setLoading(false);
        Alert.alert('Passwords do not match');
        return;
      }
  
      try{
        const response = await axios.post(`${config.apiBaseUrl}/reset-password`,{
          phone: phone,
          password: newPassword,
          confirm_password: confirmPassword,
        });
        let res = successHandler(response);
        if(res){
          // (Optional) Store token or user if API sends back
          if(response.data.user){
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } else {
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Reset Error",
            text2: response.data.message,
            position: "top",
            visibilityTime: 5000,
          });
        }
      }catch(error){
          setLoading(false);
         errorHandler(error);
      }
    }
  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "New password and confirm password must match.",
        position: "top",
      });
      return;
    }
    try {
      setPasswordLoading(true);
      let token = await AsyncStorage.getItem("userToken");
      token = JSON.parse(token || "{}");

      const response = await axios.post(
        `${config.apiBaseUrl}/change-password`,
        {
          password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      successHandler(response);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      errorHandler(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const successHandler = (response: any) => {
    if (response.data.status) {
      Toast.show({
        type: "success",
        text1: response.data.message,
        position: "bottom",
      });
      return true;
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response.data.message,
        position: "top",
        visibilityTime: 5000,
      });
      return false;
    }
  };

  const errorHandler = (error: any) => {
    let message = "Something went wrong. Please try again.";
    if (error?.response?.data?.message) {
      message = error?.response.data.message;
    }
    if (error?.response?.data?.errors) {
      const errorsObject = error?.response.data.errors;
      if (typeof errorsObject === "object") {
        Object.entries(errorsObject).forEach(([_, errArr]) => {
          message = `${errArr[0]}`;
        });
      }
    }
    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
      position: "top",
      visibilityTime: 5000,
    });
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container}>
        <View style={{ marginBottom: 30 }}>
            
          {/* === Profile Form === */}
          <View style={styles.form}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Manage Profile</Text>
            </View>
            {/* Name */}
            <View style={styles.inputRow}>
              <View style={styles.iconBox}>
                <FontAwesome name="user" size={20} />
              </View>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* City */}
            <View style={styles.inputRow}>
              <View style={styles.iconBox}>
                <FontAwesome name="location-arrow" size={20} />
              </View>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your City"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Phone */}
            <View style={styles.inputRow}>
              <View style={styles.iconBox}>
                <FontAwesome name="phone" size={20} />
              </View>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter Mobile Number"
                value={phone}
                keyboardType="number-pad"
                onChangeText={setPhone}
              />
            </View>

            {/* Update Button */}
            <View style={styles.mb20}>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={updateProfileData}
                  disabled={loading}
                >
                  <Entypo name="save" size={16} color="black" />
                  <Text style={styles.btnText}>
                    {loading ? "UPDATING..." : "UPDATE"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* === Change Password Form === */}
          <View style={[styles.form,{marginTop: 25}]}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Change Password</Text>
            </View>

            {/* New Password */}
            <View style={styles.inputRow}>
              <View style={styles.iconBox}>
                <FontAwesome name="key" size={20} />
              </View>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputRow}>
              <View style={styles.iconBox}>
                <FontAwesome name="check" size={20} />
              </View>
              <TextInput
                style={styles.inputBox}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Update Password Button */}
            <View style={styles.mb20}>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={updatePassword}
                  disabled={passwordLoading}
                >
                  <Entypo name="save" size={16} color="black" />
                  <Text style={styles.btnText}>
                    {passwordLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C2DFD6",
    marginBottom: 55,
    marginTop: 45,
  },
  form: {
    // marginTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 5,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    // borderWidth:1,
  },
  formTitle: {
    textAlign: "center",
    fontSize: 14,
    // paddingBottom: 5,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  inputRow: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
  },
  iconBox: {
    width: "15%",
    height: 35,
    justifyContent: "center",
    borderRightWidth: 1,
    alignItems: "center",
  },
  inputBox: {
    width: "85%",
    paddingHorizontal: 8,
    height: 40,
  },
  mb20: {
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  radioButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: "#C2DFD6",
    borderRadius: 5,
    backgroundColor: "#C2DFD6",
    width: "100%",
  },
  btnText: {
    textAlign: "center",
    fontWeight: "bold",
    marginHorizontal: 5,
  },
});
