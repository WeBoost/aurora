import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function WebsiteLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#0B1021',
        },
      }}>
      <Stack.Screen name="sections" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="deploy" />
      <Stack.Screen name="templates" />
    </Stack>
  );
}