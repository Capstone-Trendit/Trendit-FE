import { Camera } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { HeaderWithLogo } from '@/components/ui/HeaderWithLogo';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ProductRegisterScreen() {
  const colorScheme = useColorScheme();
  const [image, setImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    (async () => {
      // 카메라 권한 요청
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');

      // 미디어 라이브러리 권한 요청
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraPermission) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else {
      Alert.alert('권한 필요', '카메라 사용을 위해 권한이 필요합니다', [
        { text: '확인' },
      ]);
    }
  };

  const pickImage = async () => {
    if (galleryPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else {
      Alert.alert(
        '권한 필요',
        '사진 라이브러리 접근을 위해 권한이 필요합니다',
        [{ text: '확인' }]
      );
    }
  };

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

        {/* 제목 영역 */}
        <View style={[styles.titleContainer, { backgroundColor: '#ffffff' }]}>
          <ThemedText
            style={{ color: '#000000', fontWeight: '700' }}
            type="title"
          >
            상품 등록
          </ThemedText>
        </View>

        {/* 상품 이미지 섹션 */}
        <View style={[styles.section, { backgroundColor: '#ffffff' }]}>
          <ThemedText
            style={{ color: '#000000', fontWeight: '700' }}
            type="subtitle"
          >
            상품 이미지를 업로드해주세요
          </ThemedText>

          <View style={[styles.imageContainer, { backgroundColor: '#ffffff' }]}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={[
                  styles.productImage,
                  { backgroundColor: '#ffffff', borderWidth: 0 },
                ]}
                contentFit="cover"
              />
            ) : (
              <View
                style={[
                  styles.imagePlaceholder,
                  { backgroundColor: '#ffffff', borderWidth: 0 },
                ]}
              >
                <TouchableOpacity
                  onPress={pickImage}
                  style={[
                    styles.uploadButton,
                    { backgroundColor: '#ffffff', borderWidth: 0 },
                  ]}
                >
                  <View style={styles.plusIconContainer}>
                    <IconSymbol size={18} name="plus" color="#ffffff" />
                  </View>
                  <ThemedText style={styles.uploadText}>사진 선택</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View
            style={[
              styles.buttonOuterContainer,
              { backgroundColor: '#ffffff', borderWidth: 0 },
            ]}
          >
            <TouchableOpacity
              style={[styles.buttonCamera, { borderWidth: 0 }]}
              onPress={takePhoto}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>카메라 촬영</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonGallery, { borderWidth: 0 }]}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>갤러리에서 선택</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 등록 버튼 */}
        <TouchableOpacity style={styles.registerButton}>
          <ThemedText style={styles.registerButtonText}>상품 등록</ThemedText>
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
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    marginTop: 16,
    backgroundColor: '#ffffff',
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: '#ffffff',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  plusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3182f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: '#3182f5',
    fontSize: 16,
  },
  buttonOuterContainer: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#ffffff',
    width: '100%',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  buttonCamera: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonGallery: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#3182f5',
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#3182f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  registerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
