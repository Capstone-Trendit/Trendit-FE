import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { HeaderWithLogo } from '@/components/ui/HeaderWithLogo';
import { useColorScheme } from '@/hooks/useColorScheme';

// 상품 타입 정의
type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
};

// 더미 데이터
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '키보드',
    price: '35,000원',
    description: '기계식 키보드',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: '마우스',
    price: '15,000원',
    description: '무선 마우스',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: '모니터',
    price: '250,000원',
    description: '27인치 모니터',
    image: 'https://via.placeholder.com/150',
  },
];

export default function MyProductsScreen() {
  const colorScheme = useColorScheme();

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        contentFit="cover"
      />
      <View style={styles.productInfo}>
        <ThemedText style={{ ...styles.productName, color: '#000000' }}>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.productPrice}>{item.price}</ThemedText>
        <ThemedText style={styles.productDescription}>
          {item.description}
        </ThemedText>
      </View>
    </View>
  );

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
            내 상품
          </ThemedText>
        </View>

        {/* 상품 목록 */}
        <FlatList
          data={PRODUCTS}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.productList,
            { backgroundColor: '#ffffff' },
          ]}
        />
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
  productList: {
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  productItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3182f5',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
});
