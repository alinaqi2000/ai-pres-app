import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';

import colors from './colors';
import { Input } from './input';

type SearchBarProps = {
  placeholder: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export function SearchBar({
  placeholder,
  searchQuery,
  setSearchQuery,
}: SearchBarProps) {
  const { colorScheme } = useColorScheme();

  return (
    <View className="mx-6 flex-row items-center justify-between gap-2">
      <View className="flex-row items-center gap-4">
        <Icon source="magnify" size={24} color={colors.primary[400]} />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}
          onChangeText={setSearchQuery}
          className="top-1"
        />
      </View>
      {searchQuery && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Icon source="close" size={20} color={colors.danger[400]} />
        </TouchableOpacity>
      )}
    </View>
  );
}
