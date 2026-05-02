import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  onSearchPress?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  onSearchPress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Ionicons name="funnel" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
