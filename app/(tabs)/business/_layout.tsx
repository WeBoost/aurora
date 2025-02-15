import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BusinessLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0B1021',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
        contentStyle: {
          backgroundColor: '#0B1021',
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Business',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Business',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="services"
        options={{
          title: 'Services',
        }}
      />
      <Stack.Screen
        name="hours"
        options={{
          title: 'Business Hours',
        }}
      />
      <Stack.Screen
        name="bookings"
        options={{
          title: 'Bookings',
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: 'Analytics',
        }}
      />
      <Stack.Screen
        name="reports"
        options={{
          title: 'Reports',
        }}
      />
      <Stack.Screen
        name="website"
        options={{
          title: 'Website Builder',
        }}
      />
    </Stack>
  );
}