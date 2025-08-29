import { LinearGradient } from "expo-linear-gradient"
import LottieView from "lottie-react-native"
import { StyleSheet, View } from "react-native"
import {
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function HoliLayout({children}: React.PropsWithChildren<{}>) {
    return (
        <>
            <View style={styles.lottieWrapper}>
                <LottieView
                    source={require('@/assets/animations/holi.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={{ flex: 1, opacity: 0.6 }}
                />
            </View>
            <LinearGradient
                colors={["#4760EB", "#2C3EEB", "#08078A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.container}
            >
                {children}
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        paddingBottom: hp(2),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    lottieWrapper: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        zIndex: 1,
        pointerEvents: "none"
    }
})