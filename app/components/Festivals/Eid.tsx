import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";

export default function EidLayout({ children }: React.PropsWithChildren<{}>) {
    return (
        <>
            <LinearGradient
                colors={["#C2DFD6", "#C2DFD6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.container}
            >
                <LottieView
                    source={require('@/assets/animations/eid3.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={styles.lottieWrapper}
                />
                <LottieView
                    source={require('@/assets/animations/eid3.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={styles.lottieWrapper2}
                />
                {children}
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp(100), // make the container full width
        height: hp(100),
        paddingBottom: hp(2),
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        pointerEvents: "box-none",
        // overflow: 'hidden', // to ensure border radius clips children
    },
    lottieWrapper: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1, 
        width: wp(45),
        height: hp(10),
        position: 'absolute',
        top: '1%',
        left: '50%',
        pointerEvents: "none",
        
    },
    lottieWrapper2:{
        ...StyleSheet.absoluteFillObject,
        zIndex: 1, 
        width: wp(45),
        height: hp(10),
        position: 'absolute',
        top: '1%',
        left: '5%',
        pointerEvents: "none",
    },
});