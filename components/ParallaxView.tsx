import { useRef } from 'react';
import { ScrollView, ViewStyle, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';

interface ParallaxViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ParallaxView({ children, style }: ParallaxViewProps) {
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, -100],
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={[styles.container, style]}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});