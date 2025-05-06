import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { HeaderWithLogo } from '@/components/ui/HeaderWithLogo';
import { IconSymbol } from '@/components/ui/IconSymbol';

// 임시 상품 데이터 타입 정의
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  tags: string[];
}

// 임시 상품 데이터
const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '감자',
    price: 1000,
    quantity: 10,
    image: 'https://via.placeholder.com/300',
    tags: ['식품', '채소', '건강'],
  },
  {
    id: '2',
    name: '노트북',
    price: 1200000,
    quantity: 3,
    image: 'https://via.placeholder.com/300',
    tags: ['전자기기', '컴퓨터', '사무용품'],
  },
  {
    id: '3',
    name: '아이패드',
    price: 700000,
    quantity: 5,
    image: 'https://via.placeholder.com/300',
    tags: ['전자기기', '태블릿', '애플'],
  },
];

export default function MyProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 상품 데이터 로드 (실제로는 API 호출)
  useEffect(() => {
    // 실제 구현에서는 서버에서 데이터 가져오기
    const fetchProducts = async () => {
      try {
        // 임시 딜레이 (실제 API 호출 시뮬레이션)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProducts(DUMMY_PRODUCTS);
      } catch (error) {
        console.error('상품 목록을 불러오는 데 실패했습니다.', error);
        Alert.alert('오류', '상품 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 상품 삭제 처리
  const handleDeleteProduct = (id: string) => {
    Alert.alert(
      '상품 삭제',
      '정말 이 상품을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            // 실제 구현에서는 API 호출 후 상태 업데이트
            setProducts(products.filter((product) => product.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 상품 수정 화면으로 이동
  const handleEditProduct = (product: Product) => {
    // 실제 구현에서는 수정 화면으로 이동하며 상품 데이터 전달
    Alert.alert('수정 기능', '상품 수정 기능은 현재 개발 중입니다.');
    // 추후 구현: router.push(`/product-edit/${product.id}`);
  };

  // 개별 상품 렌더링
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      {/* 상품 이미지 */}
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <IconSymbol name="photo" size={24} color="#999" />
          </View>
        )}
      </View>

      {/* 상품 정보 */}
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName}>{item.name}</ThemedText>

        <View style={styles.priceRow}>
          <ThemedText style={styles.label}>가격</ThemedText>
          <ThemedText style={styles.priceValue}>
            {item.price.toLocaleString()}원
          </ThemedText>
        </View>

        <View style={styles.quantityRow}>
          <ThemedText style={styles.label}>남은 개수</ThemedText>
          <ThemedText style={styles.quantityValue}>
            {item.quantity}개
          </ThemedText>
        </View>

        {/* 태그 */}
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </View>
          ))}
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <ThemedText style={styles.deleteButtonText}>삭제</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditProduct(item)}
          >
            <ThemedText style={styles.editButtonText}>수정</ThemedText>
          </TouchableOpacity>
        </View>
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
        <View style={{ marginTop: 10 }}>
          <HeaderWithLogo />
        </View>

        {/* 타이틀 */}
        <View style={styles.titleContainer}>
          <ThemedText style={styles.titleText}>등록한 상품 목록</ThemedText>
        </View>

        {/* 상품 목록 */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3182f5" />
            <ThemedText style={styles.loadingText}>
              상품 목록을 불러오는 중...
            </ThemedText>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              name="exclamationmark.circle"
              size={64}
              color="#cccccc"
            />
            <ThemedText style={styles.emptyText}>
              등록된 상품이 없습니다.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  listContainer: {
    paddingBottom: 24,
  },
  productItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000000',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    width: 80,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#3182f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  editButton: {
    backgroundColor: '#3182f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
});
