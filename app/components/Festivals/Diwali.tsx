import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import {
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function DiwaliLayout({children}: React.PropsWithChildren<{}>) {
    return (
        <>
            <View style={styles.lottieWrapper}>
                <LottieView
                    source={require('@/assets/animations/diwali.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={ styles.lottieWrapper}
                />
            </View>
                {children}
        </>
    )
}

const styles = StyleSheet.create({
    // container: {
    //     height: "auto",
    //     paddingBottom: hp(2),
    //     borderBottomLeftRadius: 20,
    //     borderBottomRightRadius: 20,
    //     backgroundColor: 'transparent',
    // },
    lottieWrapper: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        zIndex: 1,
        pointerEvents: "none"
    }
})