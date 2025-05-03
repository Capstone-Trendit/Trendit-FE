import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HeaderWithLogo } from '@/components/ui/HeaderWithLogo';

// 차트 데이터
const salesData = {
  labels: ['1월', '2월', '3월', '4월', '5월'],
  datasets: [
    {
      data: [50, 30, 80, 65, 81],
      color: () => '#3182f5',
      strokeWidth: 2,
    },
  ],
};

const searchData = {
  labels: ['1월', '2월', '3월', '4월', '5월'],
  datasets: [
    {
      data: [30, 45, 28, 70, 52],
      color: () => '#3182f5',
      strokeWidth: 2,
    },
  ],
};

// 더미 데이터 - 실시간 구매 현황
const purchaseData = [
  '[3분전] 김OO님이 젤리를 구입했어요',
  '[5분전] 이OO님이 키보드를 구입했어요',
  '[10분전] 박OO님이 마우스를 구입했어요',
  '[15분전] 최OO님이 모니터를 구입했어요',
  '[20분전] 정OO님이 헤드폰을 구입했어요',
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('판매량순');
  const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0);
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  // 로고 클릭 핸들러
  const handleLogoPress = () => {
    // 홈 화면으로 이동 (현재 화면이 홈이므로 새로고침 효과)
    router.replace('/');
  };

  // 실시간 구매현황 애니메이션
  useEffect(() => {
    const animatePurchase = () => {
      // 초기 상태로 설정
      translateY.setValue(50);
      opacity.setValue(0);

      // 애니메이션 시작
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // 다음 인덱스로 업데이트
      setCurrentPurchaseIndex(
        (prevIndex) => (prevIndex + 1) % purchaseData.length
      );
    };

    // 초기 실행
    animatePurchase();

    // 3초마다 업데이트
    const interval = setInterval(animatePurchase, 3000);

    return () => clearInterval(interval);
  }, [opacity, translateY]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#ffffff' }]}>
      <ThemedView style={[styles.container, { backgroundColor: '#ffffff' }]}>
        <StatusBar style="dark" />

        {/* 헤더 영역 */}
        <HeaderWithLogo onLogoPress={handleLogoPress} />

        {/* 인사말 영역 */}
        <ThemedView
          style={[styles.welcomeSection, { backgroundColor: '#ffffff' }]}
        >
          <ThemedText style={{ color: '#000000' }} type="title">
            김OO님!{'\n'}오늘 하루도 힘내세요!
          </ThemedText>
        </ThemedView>

        {/* 판매량/검색량 탭 */}
        <ThemedView
          style={[styles.tabsContainer, { backgroundColor: '#ffffff' }]}
        >
          <ThemedView style={[styles.tabs, { backgroundColor: '#f5f7f9' }]}>
            <TouchableOpacity
              style={[styles.tab, activeTab === '판매량순' && styles.activeTab]}
              onPress={() => setActiveTab('판매량순')}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: activeTab === '판매량순' ? '#ffffff' : '#555555' },
                ]}
              >
                판매량순
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === '검색량순' && styles.activeTab]}
              onPress={() => setActiveTab('검색량순')}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: activeTab === '검색량순' ? '#ffffff' : '#555555' },
                ]}
              >
                검색량순
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* 차트 영역 */}
        <ThemedView
          style={[styles.chartContainer, { backgroundColor: '#ffffff' }]}
        >
          <LineChart
            data={activeTab === '판매량순' ? salesData : searchData}
            width={windowWidth - 32} // 좌우 패딩 16씩 고려
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(49, 130, 245, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(155, 165, 183, ${opacity})`,
              style: {
                borderRadius: 6,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#3182f5',
              },
              propsForBackgroundLines: {
                stroke: '#eef1f4',
                strokeWidth: 1,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 6,
            }}
          />
        </ThemedView>

        {/* 실시간 구매 현황 */}
        <ThemedView style={[styles.section, { backgroundColor: '#ffffff' }]}>
          <ThemedText
            style={{ color: '#000000', fontWeight: '700' }}
            type="subtitle"
          >
            실시간 구매 현황
          </ThemedText>
          <ThemedView
            style={[
              styles.purchaseContainer,
              { backgroundColor: '#ffffff', borderColor: '#e0e0e0' },
            ]}
          >
            <Animated.View
              style={{
                transform: [{ translateY }],
                opacity,
              }}
            >
              <ThemedText style={{ color: '#000000', fontWeight: '500' }}>
                {purchaseData[currentPurchaseIndex]}
              </ThemedText>
            </Animated.View>
          </ThemedView>
        </ThemedView>

        {/* 추천 상품 섹션 */}
        <ThemedView style={[styles.section, { backgroundColor: '#ffffff' }]}>
          <ThemedText
            style={{ color: '#000000', fontWeight: '700' }}
            type="subtitle"
          >
            어떤 상품을 등록할지 고민이라면?
          </ThemedText>
          <TouchableOpacity style={styles.aiButton}>
            <ThemedText style={styles.aiButtonText}>
              🔮 AI로 등록할 상품 추천 받기
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
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
  },
  welcomeSection: {
    marginBottom: 24,
  },
  tabsContainer: {
    alignItems: 'flex-start', // 탭을 왼쪽 정렬
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
    padding: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#3182f5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 20,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef1f4',
  },
  section: {
    marginBottom: 20,
  },
  purchaseContainer: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  purchaseText: {
    fontSize: 14,
  },
  aiButton: {
    backgroundColor: '#3182f5',
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  aiButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  recommendButton: {
    backgroundColor: '#3182f5',
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  recommendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
