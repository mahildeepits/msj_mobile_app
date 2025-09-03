import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
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
                    style={styles.lottieWrapper}
                />
            </View>
                {children}
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
        // flex: 1,
        zIndex: 1,
        // marginTop: hp(6),
        width: "100%",
        height: '105%',
        pointerEvents: "none"
    }
    
})