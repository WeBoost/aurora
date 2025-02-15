import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export function AnimatedBackground() {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-height, {
        duration: 20000,
        easing: Easing.linear
      }),
      -1,
      true
    );

    opacity.value = withRepeat(
      withTiming(0.6, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.aurora, animatedStyle]}>
        <LinearGradient
          colors={['transparent', '#45B08C', '#9B4F96', 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  aurora: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    left: -width / 2,
  },
  gradient: {
    flex: 1,
    transform: [{ rotate: '45deg' }],
  },
});