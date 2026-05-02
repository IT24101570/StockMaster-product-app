import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryListProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryListProps) {
  const categoryEmojis: { [key: string]: string } = {
    Electronics: '📱',
    Clothing: '👕',
    Books: '📚',
    Home: '🏠',
    Sports: '⚽',
    Toys: '🎮',
    Beauty: '💄',
    Food: '🍔',
    General: '📦',
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
        onPress={() => onCategorySelect(null)}
      >
        <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
          All
        </Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive,
          ]}
          onPress={() =>
            onCategorySelect(selectedCategory === category ? null : category)
          }
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}
          >
            {categoryEmojis[category] || '📦'} {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
    borderWidth: 1,
    borderColor: '#D0D0D5',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#0051D5',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  categoryTextActive: {
    color: '#FFF',
  },
});
