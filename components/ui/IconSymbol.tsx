// Fallback for using MaterialIcons on Android and web.

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import {
  OpaqueColorValue,
  StyleSheet,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type IconMapping = Record<
  SymbolViewProps['name'],
  ComponentProps<typeof MaterialIcons>['name']
>;
type IconSymbolName = keyof typeof MAPPING;
type IoniconsName = ComponentProps<typeof Ionicons>['name'];

// Mapping special icons to Ionicons
const SPECIAL_ICONS: Record<string, IoniconsName> = {
  'bell.fill': 'notifications-outline',
  'photo.fill': 'image-outline',
  'camera.fill': 'camera-outline',
  gear: 'settings-outline',
};

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'plus.square.fill': 'add-box',
  'bag.fill': 'shopping-bag',
  'person.fill': 'person',
  'bell.fill': 'notifications-active',
  'chart.bar.fill': 'bar-chart',
  plus: 'add',
  gear: 'settings',
  'photo.fill': 'photo',
  'camera.fill': 'camera',
  'exclamationmark.circle': 'error',
  photo: 'insert-photo',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // 알림 아이콘은 특별 처리
  if (name === 'bell.fill') {
    // Material Icons를 대신 사용
    return (
      <MaterialIcons
        color={color}
        size={size}
        name="notifications-active"
        style={style}
      />
    );
  }

  // 특별 처리가 필요한 아이콘인 경우 Ionicons 사용
  if (name === 'photo.fill' || name === 'camera.fill' || name === 'gear') {
    return (
      <Ionicons
        color={color}
        size={size}
        name={SPECIAL_ICONS[name]}
        style={style}
      />
    );
  }

  // 기본 아이콘은 MaterialIcons 사용
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}

const iconStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
