import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";

export default function ChristmasLayout({ children }: React.PropsWithChildren<{}>) {
    return (
        <>
            <LinearGradient
                colors={["#C2DFD6", "#C2DFD6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.container}
            >
                <LottieView
                    source={require('@/assets/animations/christmas-bells2.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={styles.lottieWrapper2}
                />
                <LottieView
                    source={require('@/assets/animations/christmas2.json')}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={styles.lottieWrapper}
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
    // lottieBackground: {
    //     position: 'fixed',
    //     left: 0,
    //     bottom:0,
    //     width: wp(100),  // ensure lottie spans full width
    //     height: hp(100),  // adjust height as needed for your animation
    //     pointerEvents: "none",
    //     opacity: 0.3,
    //     // zIndex: -1,
    // },
    lottieWrapper: {
        ...StyleSheet.absoluteFillObject,
        // flex: 1,
        zIndex: 3, 
        width: '100%',  // ensure lottie spans full width
        height: '10%',  // ad0just height as needed for your animation
        // backgroundColor: 'rgba(255, 255, 255, 0.5)', // optional white overlay
        // opacity: 0.5,
        position: 'absolute',
        top: '100%',
        left: '0%',
        pointerEvents: "none",
        
    },
    lottieWrapper2:{
        ...StyleSheet.absoluteFillObject,
        // flex: 1,
        // width: wp(90),  // ensure lottie spans full width
        // height: hp(15),  // ad0just height as needed for your animation
        // backgroundColor: 'rgba(255, 0.5)', // optional white overlay
        // opacity: 0.5,
        // opacity: 0,
        position: 'absolute',
        top:0,
        left:'67%',
        width: '20%',
        height:'20%',
        pointerEvents: "none",
        zIndex: 3,

    }
});