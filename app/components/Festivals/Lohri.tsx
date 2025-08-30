import { LinearGradient } from "expo-linear-gradient"
import LottieView from "lottie-react-native"
import { StyleSheet, View } from "react-native"
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";

export default function LohriLayout({ children }: React.PropsWithChildren<{}>) {
    return (
        <>
            <LinearGradient
                colors={["#4760EB", "#2C3EEB", "#08078A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.container}
            >
                <LottieView
                    source={require('@/assets/animations/lohri.json')}
                    autoPlay
                    loop
                    resizeMode="contain"
                    style={styles.lottieBackground}
                />
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
    lottieBackground: {
        ...StyleSheet.absoluteFillObject,
        bottom: 0,
        justifyContent: "flex-end",
        alignItems: "center",
        pointerEvents: "none",
        opacity: 0.7,
    },
})