import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

// Map of icon names to Ionicons names
const iconMap: Record<string, string> = {
  'home': 'home',
  'search': 'search',
  'settings': 'settings',
  'user': 'person',
  'calendar': 'calendar',
  'plus': 'add',
  'edit': 'create',
  'delete': 'trash',
  'business': 'business',
  'map': 'map',
  'profile': 'person',
  'eye': 'eye',
  'eye-off': 'eye-off',
  'mail': 'mail',
  'lock': 'lock-closed',
  'globe': 'globe',
  'alert': 'alert-circle',
  'check': 'checkmark-circle',
  'close': 'close-circle',
  'menu': 'menu',
  'arrow-back': 'arrow-back',
  'arrow-forward': 'arrow-forward',
  // Add more mappings as needed
};

export function Icon({ name, size = 24, color = 'black' }: IconProps) {
  // Use mapped name or fallback to the provided name
  const iconName = iconMap[name] || name;
  return <Ionicons name={iconName as any} size={size} color={color} />;
}