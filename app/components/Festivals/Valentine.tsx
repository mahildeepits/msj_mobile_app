import { LinearGradient } from "expo-linear-gradient"
import LottieView from "lottie-react-native"
import { StyleSheet, View } from "react-native"
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";

export default function ValentineLayout({children}: React.PropsWithChildren<{}>) {
    return (
        <>
            <View style={styles.lottieWrapper}>
                <LottieView
                    source={require('@/assets/animations/valentine.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={{ flex: 1, opacity: 0.7, width: wp(50), height: hp(50) }}
                />
            </View>
            {/* <LinearGradient
                colors={["#4760EB", "#2C3EEB", "#08078A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.container}
            > */}
                {children}
            {/* </LinearGradient> */}
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
        pointerEvents: "none",
        justifyContent: 'center',
        alignItems: 'center',
    }
})