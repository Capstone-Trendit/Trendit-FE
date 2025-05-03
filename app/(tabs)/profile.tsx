import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { HeaderWithLogo } from '@/components/ui/HeaderWithLogo';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#ffffff' }]}>
      <View
        style={[
          styles.container,
          { backgroundColor: '#ffffff', paddingTop: 0 },
        ]}
      >
        <StatusBar style="dark" backgroundColor="#ffffff" />

        {/* 헤더 영역 */}
        <HeaderWithLogo />

        {/* 제목 및 설정 아이콘 */}
        <View style={[styles.titleContainer, { backgroundColor: '#ffffff' }]}>
          <ThemedText
            style={{ color: '#000000', fontWeight: '700' }}
            type="title"
          >
            프로필
          </ThemedText>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: '#ffffff' }]}
          >
            <IconSymbol size={20} name="gear" color="#3182f5" />
          </TouchableOpacity>
        </View>

        {/* 프로필 정보 */}
        <View style={[styles.profileContainer, { backgroundColor: '#ffffff' }]}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={[styles.profileImage, { borderWidth: 0 }]}
            contentFit="cover"
          />
          <View style={[styles.profileInfo, { backgroundColor: '#ffffff' }]}>
            <ThemedText style={{ ...styles.profileName, color: '#000000' }}>
              김00
            </ThemedText>
            <ThemedText style={styles.profileEmail}>
              user@example.com
            </ThemedText>
          </View>
        </View>

        {/* 설정 옵션 */}
        <ThemedText
          style={{ color: '#000000', fontWeight: '700' }}
          type="subtitle"
        >
          설정
        </ThemedText>

        <View
          style={[
            styles.settingItem,
            { backgroundColor: '#ffffff', borderBottomWidth: 0 },
          ]}
        >
          <View
            style={[
              styles.settingTextContainer,
              { backgroundColor: '#ffffff' },
            ]}
          >
            <IconSymbol
              size={20}
              name="bell.fill"
              color="#3182f5"
              style={styles.settingIcon}
            />
            <ThemedText style={{ ...styles.settingText, color: '#000000' }}>
              푸시 알림
            </ThemedText>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#e9ecef', true: '#3182f5' }}
            thumbColor="#ffffff"
          />
        </View>

        <View
          style={[
            styles.settingItem,
            { backgroundColor: '#ffffff', borderBottomWidth: 0 },
          ]}
        >
          <View
            style={[
              styles.settingTextContainer,
              { backgroundColor: '#ffffff' },
            ]}
          >
            <IconSymbol
              size={20}
              name="photo.fill"
              color="#3182f5"
              style={styles.settingIcon}
            />
            <ThemedText style={{ ...styles.settingText, color: '#000000' }}>
              갤러리 접근 권한
            </ThemedText>
          </View>
          <IconSymbol size={20} name="chevron.right" color="#3182f5" />
        </View>

        <View
          style={[
            styles.settingItem,
            { backgroundColor: '#ffffff', borderBottomWidth: 0 },
          ]}
        >
          <View
            style={[
              styles.settingTextContainer,
              { backgroundColor: '#ffffff' },
            ]}
          >
            <IconSymbol
              size={20}
              name="camera.fill"
              color="#3182f5"
              style={styles.settingIcon}
            />
            <ThemedText style={{ ...styles.settingText, color: '#000000' }}>
              카메라 접근 권한
            </ThemedText>
          </View>
          <IconSymbol size={20} name="chevron.right" color="#3182f5" />
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { borderWidth: 0, backgroundColor: '#ffffff' },
          ]}
        >
          <ThemedText style={styles.logoutButtonText}>로그아웃</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#ffffff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#ffffff',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 0,
  },
  profileInfo: {
    marginLeft: 16,
    backgroundColor: '#ffffff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6c757d',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#000000',
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#dc3545',
    fontWeight: '600',
    fontSize: 16,
  },
});
