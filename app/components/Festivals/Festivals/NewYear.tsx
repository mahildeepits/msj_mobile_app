import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function NewYearLayout({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <>
      {/* Top */}
      <LottieView
        source={require("@/assets/animations/colored lights.json")}
        autoPlay
        loop
        resizeMode="cover"
        style={[styles.lottie, styles.top]}
      />

      {/* Bottom */}
      <LottieView
        source={require("@/assets/animations/colored lights.json")}
        autoPlay
        loop
        resizeMode="cover"
        style={[styles.lottie, styles.bottom]}
      />

      {/* Left */}
      <LottieView
        source={require("@/assets/animations/colored lights.json")}
        autoPlay
        loop
        resizeMode="cover"
        style={[styles.lottie, styles.left]}
      />

      {/* Right */}
      <LottieView
        source={require("@/assets/animations/colored lights.json")}
        autoPlay
        loop
        resizeMode="cover"
        style={[styles.lottie, styles.right]}
      />

      <LinearGradient
        colors={["#4760EB", "#2C3EEB", "#08078A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        {children}
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: hp(2),
    minHeight: hp(25),
    paddingTop: hp(2),
  },
  lottie: {
    position: "absolute",
    zIndex: 1,
    pointerEvents: "none",
    opacity: 0.8,
  },
  top: {
    top: 5,
    left: 0,
    right: 0,
    height: hp(5),
  },
  bottom: {
    bottom: 5,
    left: 0,
    right: 0,
    height: hp(5),
  },
  left: {
    top: 0,
    bottom: 0,
    left: 5,
    width: wp(2),
    transform: [{ rotate: "-90deg" }],
    height: hp(7),
  },
  right: {
    top: 0,
    bottom: 0,
    right: 5,
    width: wp(3),
    transform: [{ rotate: "90deg" }],
    height: hp(7),
  },
});
