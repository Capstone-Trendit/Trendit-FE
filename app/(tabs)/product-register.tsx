import { Camera } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { HeaderWithLogo } from '@/components/ui/HeaderWithLogo';
import { IconSymbol } from '@/components/ui/IconSymbol';

// 상품 등록 단계
enum RegisterStep {
  IMAGE_UPLOAD = 1,
  PRODUCT_INFO = 2,
  TAGS = 3,
  CONFIRMATION = 4,
}

export default function ProductRegisterScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(
    null
  );
  // 현재 등록 단계 상태 추가
  const [currentStep, setCurrentStep] = useState<RegisterStep>(
    RegisterStep.IMAGE_UPLOAD
  );

  // 상품 정보 상태 추가
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productQuantity, setProductQuantity] = useState<string>('');
  // 태그 관련 상태 추가
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([
    '전자기기',
    '컴퓨터',
    '디지털',
    '스마트폰',
    '노트북',
    '태블릿',
    '가전제품',
    '생활용품',
    '패션',
    '악세서리',
    '스포츠',
    '취미',
    '게임',
  ]);
  // 등록 완료 관련 상태 추가
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // 애니메이션을 위한 값 추가
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;

  // 텍스트 입력 레퍼런스
  const priceInputRef = useRef<TextInput>(null);
  const quantityInputRef = useRef<TextInput>(null);

  const router = useRouter();
  const navigation = useNavigation();

  // 상태 초기화 함수
  const resetProductState = () => {
    setImage(null);
    setProductName('');
    setProductPrice('');
    setProductQuantity('');
    setTags([]);
    setCurrentStep(RegisterStep.IMAGE_UPLOAD);
    setIsRegistered(false);
  };

  // 경고 알림 표시 함수 - 의존성 문제를 해결하기 위해 위로 이동
  const showExitAlert = useCallback(() => {
    Alert.alert(
      '상품 등록을 중단하시겠습니까?',
      '상품 등록을 중단하면 입력한 내용이 저장되지 않습니다.',
      [
        { text: '계속 작성하기', style: 'cancel' },
        {
          text: '나가기',
          style: 'destructive',
          onPress: () => {
            // 상태 초기화
            resetProductState();
            // 네비게이션 허용
            router.push('/');
          },
        },
      ],
      { cancelable: true }
    );
  }, [router]);

  // 화면을 떠날 때 경고 표시
  useEffect(() => {
    // 작성 중인 내용이 있는지 확인하는 함수
    const hasUnsavedChanges = () => {
      if (isRegistered) return false;

      return (
        image !== null ||
        productName.trim() !== '' ||
        productPrice !== '' ||
        productQuantity !== '' ||
        tags.length > 0
      );
    };

    // 뒤로가기 버튼 처리
    const handleBackPress = () => {
      if (hasUnsavedChanges()) {
        showExitAlert();
        return true; // 기본 동작 방지
      }
      return false; // 기본 동작 허용
    };

    // 네비게이션 이벤트 리스너
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges()) {
        return; // 저장되지 않은 내용이 없으면 그냥 나감
      }

      // 기본 탐색 동작 방지
      e.preventDefault();

      // 경고 표시
      showExitAlert();
    });

    // 안드로이드 물리적 뒤로가기 버튼 처리
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [
    navigation,
    image,
    productName,
    productPrice,
    productQuantity,
    tags,
    isRegistered,
    showExitAlert,
  ]);

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

  // 화면에 들어올 때마다 초기화 (다른 탭에서 돌아왔을 때)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 초기화 전에 이미 작성 중인 내용이 있는지 확인
      const hasContent =
        image !== null ||
        productName.trim() !== '' ||
        productPrice !== '' ||
        productQuantity !== '' ||
        tags.length > 0;

      // 작성 중인 내용이 있고 완료되지 않았으면 경고 표시
      if (hasContent && !isRegistered) {
        Alert.alert(
          '이전 작성 내용이 있습니다',
          '이전에 작성 중이던 내용이 있습니다. 처음부터 다시 시작하시겠습니까?',
          [
            {
              text: '이어서 작성하기',
              style: 'cancel',
            },
            {
              text: '새로 시작하기',
              onPress: resetProductState,
            },
          ]
        );
      }
    });

    return unsubscribe;
  }, [
    navigation,
    image,
    productName,
    productPrice,
    productQuantity,
    tags,
    isRegistered,
  ]);

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
        mediaTypes: ['images'],
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

  // 다음 단계로 이동하는 함수
  const goToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // 이전 단계로 이동하는 함수
  const goToPrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 진행 상태 막대 렌더링 함수
  const renderProgressBar = () => {
    return (
      <View style={styles.progressBarContainer}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.progressStep,
              currentStep >= step ? styles.progressStepActive : null,
            ]}
          />
        ))}
      </View>
    );
  };

  // 가격 형식 변환 함수 (1000 -> 1,000)
  const formatPrice = (price: string) => {
    // 숫자 이외의 문자 제거
    const numericValue = price.replace(/[^0-9]/g, '');

    // 숫자 형식으로 변환하여 콤마 추가
    if (numericValue) {
      return Number(numericValue).toLocaleString('ko-KR');
    }
    return '';
  };

  // 숫자만 입력 받는 함수
  const handleNumericInput = (
    text: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // 숫자 이외의 문자 제거
    const numericValue = text.replace(/[^0-9]/g, '');
    setter(numericValue);
  };

  // 태그 추가 함수
  const addTag = (tag: string) => {
    if (tag.trim() !== '' && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
    setTagInput('');
  };

  // 태그 삭제 함수
  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // AI 태그 추천 시뮬레이션 함수
  const generateAITags = () => {
    // 실제 구현에서는 이미지와 상품명 기반으로 AI API 호출
    setIsLoadingTags(true);

    // 시뮬레이션을 위한 타이머 (실제로는 API 호출로 대체)
    setTimeout(() => {
      // 랜덤하게 태그 섞기
      const shuffled = [...suggestedTags].sort(() => 0.5 - Math.random());
      // 4-6개 선택
      const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 4);
      setSuggestedTags(selected);
      setIsLoadingTags(false);
    }, 1500);
  };

  // 상품 등록 함수
  const registerProduct = () => {
    // 실제 구현에서는 API 호출로 데이터 저장
    setIsRegistered(true);
  };

  // 홈으로 돌아가기
  const goToHome = () => {
    // 상태 초기화
    resetProductState();
    // 홈으로 이동
    router.replace('/');
  };

  // 애니메이션 효과
  useEffect(() => {
    if (productName.trim() !== '') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [productName, fadeAnim]);

  useEffect(() => {
    if (productName.trim() !== '' && productPrice !== '') {
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [productPrice, fadeAnim2, productName]);

  const renderImageUploadStep = () => {
    return (
      <>
        <View style={[styles.section, { backgroundColor: '#ffffff' }]}>
          <ThemedText
            style={{ color: '#000000', fontWeight: '700' }}
            type="subtitle"
          >
            등록하고자 하는 상품의 이미지를 등록해주세요
          </ThemedText>

          <TouchableOpacity
            style={[
              styles.imageContainer,
              {
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#3182f5',
                borderStyle: 'solid',
                borderRadius: 8,
              },
            ]}
            onPress={image ? pickImage : undefined}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.productImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.uploadButton}
                >
                  <View style={styles.plusIconContainer}>
                    <IconSymbol size={18} name="plus" color="#ffffff" />
                  </View>
                  <ThemedText style={styles.uploadText}>사진 선택</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.buttonOuterContainer}>
            <TouchableOpacity
              style={styles.buttonCamera}
              onPress={takePhoto}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>카메라 촬영</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonGallery}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>갤러리에서 선택</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 다음 버튼 - 이미지가 있을 때만 표시 */}
        {image && (
          <TouchableOpacity style={styles.nextButton} onPress={goToNextStep}>
            <ThemedText style={styles.nextButtonText}>다음</ThemedText>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderProductInfoStep = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={[styles.section, { marginTop: 20 }]}>
            <ThemedText
              style={{ color: '#000000', fontWeight: '700' }}
              type="subtitle"
            >
              상품 정보를 입력해주세요
            </ThemedText>

            {/* 상품명 입력 */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>상품명</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="상품명을 입력해주세요"
                value={productName}
                onChangeText={setProductName}
                placeholderTextColor="#999"
                autoFocus={true}
                returnKeyType="next"
                onSubmitEditing={() => {
                  if (productName.trim() !== '') {
                    priceInputRef.current?.focus();
                  }
                }}
              />
            </View>

            {/* 상품명이 입력되었을 때만 가격 입력란 표시 */}
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {productName.trim() !== '' && (
                <>
                  <ThemedText style={styles.inputLabel}>가격</ThemedText>
                  <View style={styles.priceInputContainer}>
                    <ThemedText style={styles.currencySymbol}>₩</ThemedText>
                    <TextInput
                      ref={priceInputRef}
                      style={styles.priceInput}
                      placeholder="가격을 입력해주세요"
                      value={formatPrice(productPrice)}
                      onChangeText={(text) =>
                        handleNumericInput(text, setProductPrice)
                      }
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        if (productPrice !== '') {
                          quantityInputRef.current?.focus();
                        }
                      }}
                    />
                  </View>
                </>
              )}
            </Animated.View>

            {/* 가격이 입력되었을 때만 수량 입력란 표시 */}
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  opacity: fadeAnim2,
                  transform: [
                    {
                      translateY: fadeAnim2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {productName.trim() !== '' && productPrice !== '' && (
                <>
                  <ThemedText style={styles.inputLabel}>수량</ThemedText>
                  <View style={styles.priceInputContainer}>
                    <TextInput
                      ref={quantityInputRef}
                      style={styles.quantityInput}
                      placeholder="수량을 입력해주세요"
                      value={productQuantity}
                      onChangeText={(text) =>
                        handleNumericInput(text, setProductQuantity)
                      }
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      returnKeyType="done"
                    />
                    <ThemedText style={styles.unitSymbol}>개</ThemedText>
                  </View>
                </>
              )}
            </Animated.View>
          </View>
        </ScrollView>

        {/* 다음 버튼은 모든 필드가 채워졌을 때만 활성화 */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !productName.trim() || !productPrice || !productQuantity
                ? styles.disabledButton
                : null,
            ]}
            onPress={goToNextStep}
            disabled={!productName.trim() || !productPrice || !productQuantity}
          >
            <ThemedText
              style={[
                styles.nextButtonText,
                !productName.trim() || !productPrice || !productQuantity
                  ? styles.disabledButtonText
                  : null,
              ]}
            >
              다음
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTagsStep = () => {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.section}>
            <ThemedText
              style={{ color: '#000000', fontWeight: '700' }}
              type="subtitle"
            >
              상품 태그를 입력해주세요
            </ThemedText>

            <ThemedText style={styles.tagHelper}>
              AI를 통해 쉽게 태그를 설정해보세요.
            </ThemedText>

            {/* AI 태그 추천 영역 */}
            <View style={styles.aiTagSection}>
              <View style={styles.aiTagHeader}>
                <ThemedText style={styles.aiTagTitle}>AI 추천 태그</ThemedText>
                <TouchableOpacity
                  style={styles.reloadButton}
                  onPress={generateAITags}
                  disabled={isLoadingTags}
                >
                  <IconSymbol
                    size={14}
                    name="arrow.clockwise"
                    color="#3182f5"
                  />
                  <ThemedText style={styles.reloadText}>새로고침</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.suggestedTagsContainer}>
                {isLoadingTags ? (
                  <View style={styles.loadingContainer}>
                    <ThemedText>태그 생성 중...</ThemedText>
                  </View>
                ) : (
                  <View style={styles.tagList}>
                    {suggestedTags.map((tag, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.tagItem,
                          tags.includes(tag) && styles.selectedTagItem,
                        ]}
                        onPress={() => {
                          if (tags.includes(tag)) {
                            removeTag(tags.indexOf(tag));
                          } else {
                            addTag(tag);
                          }
                        }}
                      >
                        <ThemedText
                          style={[
                            styles.tagText,
                            tags.includes(tag) && styles.selectedTagText,
                          ]}
                        >
                          {tag}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* 커스텀 태그 입력 영역 */}
            <View style={styles.customTagSection}>
              <ThemedText style={styles.customTagTitle}>
                직접 태그 입력하기
              </ThemedText>

              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="태그를 입력하고 추가 버튼을 누르세요"
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholderTextColor="#999"
                  onSubmitEditing={() => addTag(tagInput)}
                />
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={() => addTag(tagInput)}
                  disabled={tagInput.trim() === ''}
                >
                  <ThemedText style={styles.addTagButtonText}>추가</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* 태그 목록 표시 영역 */}
            <View style={styles.selectedTagsContainer}>
              <ThemedText style={styles.selectedTagsTitle}>
                선택한 태그 ({tags.length})
              </ThemedText>

              <View style={styles.selectedTagsList}>
                {tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <View key={index} style={styles.selectedTag}>
                      <ThemedText style={styles.selectedTagText}>
                        {tag}
                      </ThemedText>
                      <TouchableOpacity
                        style={styles.removeTagButton}
                        onPress={() => removeTag(index)}
                      >
                        <ThemedText style={styles.removeTagButtonText}>
                          ×
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <ThemedText style={styles.noTagsText}>
                    아직 선택된 태그가 없습니다.
                  </ThemedText>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 다음 버튼 - 태그를 1개 이상 선택해야 활성화 */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              tags.length === 0 ? styles.disabledButton : null,
            ]}
            onPress={goToNextStep}
            disabled={tags.length === 0}
          >
            <ThemedText
              style={[
                styles.nextButtonText,
                tags.length === 0 ? styles.disabledButtonText : null,
              ]}
            >
              다음
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderConfirmationStep = () => {
    // 등록 완료되었을 때 보여줄 화면
    if (isRegistered) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.completionContainer}>
            <View style={styles.completionIconContainer}>
              <View style={styles.checkCircle}>
                <IconSymbol size={55} name="checkmark" color="#ffffff" />
              </View>
            </View>
            <ThemedText style={styles.completionTitle}>
              상품 등록이 완료되었습니다!
            </ThemedText>
            <ThemedText style={styles.completionSubtitle}>
              등록하신 상품은 &apos;내 상품&apos; 페이지에서{'\n'}
              확인하실 수 있습니다.
            </ThemedText>
            <TouchableOpacity
              style={[styles.nextButton, { width: '90%', marginTop: 0 }]}
              onPress={goToHome}
            >
              <ThemedText style={styles.nextButtonText}>
                홈으로 돌아가기
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // 등록 확인 화면
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.section}>
          <ThemedText
            style={{ color: '#000000', fontWeight: '700' }}
            type="subtitle"
          >
            입력한 정보를 확인해주세요
          </ThemedText>

          {/* 상품 이미지 미리보기 */}
          {image && (
            <View style={styles.confirmationImageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.confirmationImage}
                contentFit="cover"
              />
            </View>
          )}

          {/* 상품 정보 확인 */}
          <View style={styles.confirmationInfoContainer}>
            <View style={styles.confirmationInfoRow}>
              <ThemedText style={styles.confirmationLabel}>상품명</ThemedText>
              <ThemedText style={styles.confirmationValue}>
                {productName}
              </ThemedText>
            </View>

            <View style={styles.confirmationInfoRow}>
              <ThemedText style={styles.confirmationLabel}>가격</ThemedText>
              <ThemedText style={styles.confirmationValue}>
                {Number(productPrice).toLocaleString('ko-KR')}원
              </ThemedText>
            </View>

            <View style={styles.confirmationInfoRow}>
              <ThemedText style={styles.confirmationLabel}>수량</ThemedText>
              <ThemedText style={styles.confirmationValue}>
                {productQuantity}개
              </ThemedText>
            </View>

            <View style={styles.confirmationInfoRow}>
              <ThemedText style={styles.confirmationLabel}>태그</ThemedText>
              <View style={styles.confirmationTagsContainer}>
                {tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <View key={index} style={styles.confirmationTag}>
                      <ThemedText style={styles.confirmationTagText}>
                        {tag}
                      </ThemedText>
                    </View>
                  ))
                ) : (
                  <ThemedText style={styles.confirmationNoTags}>
                    태그 없음
                  </ThemedText>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* 이전/등록하기 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.prevButton} onPress={goToPrevStep}>
            <ThemedText style={styles.prevButtonText}>이전</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerNowButton}
            onPress={registerProduct}
          >
            <ThemedText style={styles.nextButtonText}>등록하기</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#ffffff' }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
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

          {/* 뒤로가기 버튼 - 이미지 업로드 단계가 아니고 등록 완료가 아닐 때만 표시 */}
          {currentStep !== RegisterStep.IMAGE_UPLOAD && !isRegistered && (
            <TouchableOpacity
              onPress={goToPrevStep}
              style={styles.backButtonNew}
            >
              <IconSymbol size={24} name="chevron.backward" color="#000000" />
            </TouchableOpacity>
          )}

          {/* 진행 상태 막대 - 등록 완료 시에는 표시하지 않음 */}
          {!isRegistered && renderProgressBar()}

          {/* 현재 단계에 따른 내용 렌더링 */}
          {currentStep === RegisterStep.IMAGE_UPLOAD && renderImageUploadStep()}
          {currentStep === RegisterStep.PRODUCT_INFO && renderProductInfoStep()}
          {currentStep === RegisterStep.TAGS && renderTagsStep()}
          {currentStep === RegisterStep.CONFIRMATION &&
            renderConfirmationStep()}
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: 10,
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    marginTop: 30,
  },
  progressBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
    marginHorizontal: 0,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#3182f5',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  plusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3182f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
  nextButton: {
    backgroundColor: '#3182f5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
    width: 346,
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  prevButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
    marginRight: 10,
    width: 168,
    height: 50,
    justifyContent: 'center',
  },
  prevButtonText: {
    color: '#3182f5',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  disabledButtonText: {
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  input: {
    backgroundColor: '#f8f9fa',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    marginRight: 8,
    fontSize: 16,
    color: '#555',
  },
  unitSymbol: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  priceInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  quantityInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  // 태그 관련 스타일
  tagHelper: {
    marginTop: 8,
    color: '#777',
    fontSize: 14,
  },
  aiTagSection: {
    marginTop: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  aiTagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTagTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reloadText: {
    fontSize: 14,
    color: '#3182f5',
    marginLeft: 4,
  },
  suggestedTagsContainer: {
    minHeight: 100,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTagItem: {
    backgroundColor: '#3182f5',
    borderColor: '#3182f5',
  },
  tagText: {
    color: '#333',
  },
  selectedTagText: {
    color: '#ffffff',
  },
  customTagSection: {
    marginTop: 24,
  },
  customTagTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#3182f5',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  selectedTagsContainer: {
    marginTop: 24,
  },
  selectedTagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  selectedTagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3182f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  removeTagButton: {
    marginLeft: 6,
  },
  removeTagButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  noTagsText: {
    color: '#999',
    marginTop: 8,
  },
  // 확인 단계 스타일
  confirmationImageContainer: {
    marginTop: 16,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  confirmationImage: {
    width: '100%',
    height: '100%',
  },
  confirmationInfoContainer: {
    marginTop: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  confirmationInfoRow: {
    marginBottom: 16,
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  confirmationValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  confirmationTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  confirmationTag: {
    backgroundColor: '#3182f5',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 2,
  },
  confirmationTagText: {
    fontSize: 14,
    color: '#ffffff',
  },
  confirmationNoTags: {
    fontSize: 16,
    color: '#999',
  },
  registerNowButton: {
    backgroundColor: '#3182f5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
    width: 168,
    height: 50,
    justifyContent: 'center',
  },
  // 등록 완료 화면 스타일
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 60,
    marginTop: 20,
  },
  completionIconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3182f5', // 파란색 배경으로 변경
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionEmoji: {
    fontSize: 64,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  completionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 22,
  },
  backButtonContainer: {
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  backButtonNew: {
    marginLeft: 4,
    marginTop: 5,
    marginBottom: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bottomButtonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
