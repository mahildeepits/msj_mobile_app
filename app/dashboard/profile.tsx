import { Entypo, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import config from "../config";

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Change Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  // Phone Number Verification Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profilePassword, setProfilePassword] = useState("");
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [initialPhone, setInitialPhone] = useState("");

  // Fetch profile data
  const getProfileData = async () => {
    let user = await AsyncStorage.getItem("user");
    user = JSON.parse(user || "{}");
    setUser(user);
    setName(user?.name || "");
    setCity(user?.city_name || "");
    setPhone(user?.phone || "");
    setInitialPhone(user?.phone || "");
    setPhoneChanged(false);
  };

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    setPhoneChanged(phone !== initialPhone);
  }, [phone, initialPhone]);

  // First step on update: check phone change, show password modal if needed
  const tryUpdateProfileData = async () => {
    if (phoneChanged) {
      setShowPasswordModal(true);
    } else {
      updateProfileData();
    }
  };

  // Actual update request: now takes password if phone changed
  const updateProfileData = async () => {
    try {
      setLoading(true);
      let token = await AsyncStorage.getItem("userToken");
      token = JSON.parse(token || "{}");

      const payload = { name, city, phone };
      if (phoneChanged) payload.password = profilePassword;

      const response = await axios.post(
        `${config.apiBaseUrl}/profile`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept": "application/json"
          },
        }
      );

      let res = successHandler(response);
      if (res) {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        getProfileData();
        setShowPasswordModal(false);
        setProfilePassword(""); // clear modal field
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  // Change Password API (no update needed)
  const handleResetPassword = async () => {
    setPasswordLoading(true);
    if (newPassword === "" || confirmPassword === "" || currentPassword === "") {
      setPasswordLoading(false);
      Alert.alert("Please enter all required fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordLoading(false);
      Alert.alert("Passwords do not match");
      return;
    }
    let token = await AsyncStorage.getItem("userToken");
    token = JSON.parse(token || "{}");
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/password/update`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept": "application/json"
          },
        }
      );
      let res = successHandler(response);
      if (res) {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("userToken");
        setTimeout(() => {
          router.navigate("/");
        }, 2000);
      } else {
        setPasswordLoading(false);
        Toast.show({
          type: "error",
          text1: "Reset Error",
          text2: response.data.message,
          position: "top",
          visibilityTime: 5000,
        });
      }
    } catch (error) {
      setPasswordLoading(false);
      errorHandler(error);
    }
  };

  const successHandler = (response) => {
    if (response.data.status) {
      Toast.show({
        type: "success",
        text1: response.data.message,
        position: "top",
        visibilityTime: 2000,
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

  const errorHandler = (error) => {
    let message = "Something went wrong. Please try again.";
    if (error?.response?.data?.message) {
      message = error?.response.data.message;
    }
    if (error?.response?.data?.errors) {
      const errorsObject = error?.response.data.errors;
      if (typeof errorsObject === "object") {
        Object.entries(errorsObject).forEach(([_, errArr]) => {
          message = `${errArr}`;
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

  // Actual render
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={styles.container}>
          <View style={{ marginBottom: 0 }}>
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
                    onPress={tryUpdateProfileData}
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

            {/* Password Modal for Phone Change */}
            <Modal
              transparent={true}
              visible={showPasswordModal}
              animationType="fade"
              onRequestClose={() => setShowPasswordModal(false)}
            >
              <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.15)"
              }}>
                <View style={[styles.form, { padding: 25, width: "85%" }]}>
                  <Text style={styles.formTitle}>Verify Password</Text>
                  <Text style={{ marginBottom: 12, textAlign: "center", fontSize: 13 }}>
                    To update your mobile number, please enter your password.
                  </Text>
                  <View style={styles.inputRow}>
                    <View style={styles.iconBox}>
                      <FontAwesome name="key" size={20} />
                    </View>
                    <TextInput
                      style={styles.inputBox}
                      placeholder="Enter Password"
                      secureTextEntry
                      autoFocus
                      value={profilePassword}
                      onChangeText={setProfilePassword}
                    />
                  </View>
                  <View style={[styles.radioGroup, { marginTop: 10 }]}>
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => {
                        if (!profilePassword) {
                          Alert.alert("Please enter your password to verify");
                          return;
                        }
                        updateProfileData();
                      }}
                    >
                      <Entypo name="save" size={16} color="black" />
                      <Text style={styles.btnText}>CONFIRM & UPDATE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.radioButton, { backgroundColor: "#f9f9f9", borderColor: "#f9f9f9" }]}
                      onPress={() => {
                        setShowPasswordModal(false);
                        setProfilePassword("");
                        setPhone(initialPhone);
                      }}
                    >
                      <FontAwesome name="times" size={16} color="black" />
                      <Text style={styles.btnText}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* === Change Password Form === */}
            <View style={[styles.form, { marginTop: 25 }]}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Change Password</Text>
              </View>
              {/* old password */}
              <View style={styles.inputRow}>
                <View style={styles.iconBox}>
                  <FontAwesome name="key" size={20} />
                </View>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter Current Password"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
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
                    onPress={handleResetPassword}
                    disabled={passwordLoading}
                  >
                    <Entypo name="save" size={16} color="black" />
                    <Text style={styles.btnText}>
                      {passwordLoading ? "UPDATING..." : "UPDATE"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 5,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  formTitle: {
    textAlign: "center",
    fontSize: 14,
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
    marginBottom: 10,
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
