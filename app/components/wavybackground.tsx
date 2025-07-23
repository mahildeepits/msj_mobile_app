import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { width } = Dimensions.get('window');

const WavyBackground = ({ color = '#C2DFD6' }) => {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(100, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      d: `
        M 0 80
        Q ${width * 0.25} ${80 - offset.value * 0.3}, ${width * 0.5} 80
        Q ${width * 0.75} ${80 + offset.value * 0.3}, ${width} 80
        L ${width} 0
        L 0 0
        Z
      `,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} 80`} style={styles.svg}>
        <AnimatedPath
          animatedProps={animatedProps}
          fill={color}
          fillOpacity={0.8}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  svg: {
    position: 'absolute',
    bottom: 0,
  },
});

export default WavyBackground;