import { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: any;
}

export function AnimatedCounter({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '',
  style 
}: AnimatedCounterProps) {
  const count = useSharedValue(0);

  useEffect(() => {
    count.value = withTiming(end, {
      duration,
      easing: Easing.out(Easing.ease)
    });
  }, [end]);

  const animatedProps = useAnimatedProps(() => ({
    text: `${prefix}${Math.floor(count.value)}${suffix}`
  }));

  return (
    <AnimatedText
      style={[styles.text, style]}
      animatedProps={animatedProps}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});