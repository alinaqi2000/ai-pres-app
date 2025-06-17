import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

export * from './avatar';
export * from './booking-card';
export * from './button';
export * from './card';
export * from './checkbox';
export { default as colors } from './colors';
export * from './focus-aware-status-bar';
export * from './image';
export * from './input';
// eslint-disable-next-line import/no-cycle
export * from './item-card';
export * from './list';
export * from './modal';
export * from './payment-card';
export * from './progress-bar';
export * from './property-card';
export * from './search-bar';
export * from './select';
export * from './tenant-card';
export * from './text';
export * from './unit-card';
// eslint-disable-next-line import/no-cycle
export { ToggleButton } from './use-toggle-button';
export * from './utils';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
export { SafeAreaView } from 'react-native-safe-area-context';

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});
