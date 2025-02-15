import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { MotiView } from 'moti';

export function Logo() {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000 }}>
        <Text style={{ 
          fontSize: 30,
          fontWeight: 'bold',
          letterSpacing: 2,
          color: '#FFFFFF',
          marginBottom: 4
        }}>
          AURORA
        </Text>
      </MotiView>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: -4 }}>
        {[64, 48, 32].map((width, index) => (
          <MotiView
            key={index}
            from={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              type: 'spring',
              delay: index * 200,
              damping: 15,
            }}>
            <LinearGradient
              colors={
                index === 0
                  ? ['#45B08C', '#9B4F96']
                  : index === 1
                  ? ['#9B4F96', '#A1D6E2']
                  : ['#A1D6E2', 'transparent']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 4,
                width,
                borderRadius: 2,
              }}
            />
          </MotiView>
        ))}
      </View>
    </View>
  );
}