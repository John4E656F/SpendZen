import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set the navigation bar background color and button style
      NavigationBar.setBackgroundColorAsync('#F0F4F8'); // Matches your theme background
      NavigationBar.setButtonStyleAsync('dark'); // 'dark' or 'light' buttons
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5A7D7C',
        tabBarInactiveTintColor: '#718096',
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: { backgroundColor: '#F0F4F8' },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <AntDesign name='home' size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name='goals'
        options={{
          tabBarLabel: 'Goals',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='target' size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name='person' size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
