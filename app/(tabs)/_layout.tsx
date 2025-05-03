import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';

// 탭바 배경 컴포넌트
const CustomTabBarBackground = () => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: '#ffffff',
      }}
    />
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3182f5',
        tabBarInactiveTintColor: '#777777',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: CustomTabBarBackground,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#eeeeee',
          borderTopWidth: 1,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product-register"
        options={{
          title: '상품 등록',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.square.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-products"
        options={{
          title: '내 상품',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bag.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
