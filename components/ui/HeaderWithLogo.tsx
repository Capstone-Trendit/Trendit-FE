import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';

interface HeaderWithLogoProps {
  onLogoPress?: () => void;
}

export function HeaderWithLogo({ onLogoPress }: HeaderWithLogoProps) {
  const handleLogoPress = () => {
    if (onLogoPress) {
      onLogoPress();
    } else {
      // 기본 동작: 홈 화면으로 이동
      router.replace('/');
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: '#ffffff' }]}>
      <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
        <View style={styles.logoWrapper}>
          <View style={styles.chartIconContainer}>
            <IconSymbol size={14} name="chart.bar.fill" color="#000000" />
          </View>
          <Text style={styles.logoText}>
            <Text style={styles.logoTextBold}>Trend</Text>
            <Text style={styles.logoTextBlue}>It</Text>
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.notificationContainer}>
        <TouchableOpacity
          style={[
            styles.notificationIcon,
            {
              backgroundColor: '#ffffff',
              borderRadius: 18,
              width: 36,
              height: 36,
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <IconSymbol size={22} name="bell.fill" color="#3182f5" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    height: 44,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    height: 44,
    justifyContent: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
    gap: 4,
  },
  chartIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 14,
    height: 14,
  },
  logoText: {
    fontSize: 15,
  },
  logoTextBold: {
    fontWeight: '700',
    color: '#000000',
  },
  logoTextBlue: {
    fontWeight: '600',
    color: '#3182f5',
  },
  notificationContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
