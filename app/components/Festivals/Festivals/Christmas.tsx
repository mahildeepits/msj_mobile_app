import { LinearGradient } from "expo-linear-gradient"
import LottieView from "lottie-react-native"
import { StyleSheet, View } from "react-native"
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";

export default function ChristmasLayout({ children }: React.PropsWithChildren<{}>) {
    return (
        <>
            <LinearGradient
                colors={["#111", "#fff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.container}
            >
                <LottieView
                    source={require('@/assets/animations/christmas.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={styles.lottieBackground}
                />
                {children}
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp(100), // make the container full width
        paddingBottom: hp(2),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden', // to ensure border radius clips children
    },
    lottieBackground: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: wp(100),  // ensure lottie spans full width
        height: hp(60),  // adjust height as needed for your animation
        pointerEvents: "none",
        opacity: 0.3,
    },
});