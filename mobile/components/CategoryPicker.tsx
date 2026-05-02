import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { apiCall } from '../services/api';

interface Category {
  _id: string;
  name: string;
}

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiCall('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <TouchableOpacity
          style={[styles.item, selectedCategory === 'All' && styles.selectedItem]}
          onPress={() => onSelectCategory('All')}
        >
          <Text style={[styles.itemText, selectedCategory === 'All' && styles.selectedItemText]}>All</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={[styles.item, selectedCategory === cat.name && styles.selectedItem]}
            onPress={() => onSelectCategory(cat.name)}
          >
            <Text style={[styles.itemText, selectedCategory === cat.name && styles.selectedItemText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginHorizontal: 15,
  },
  scroll: {
    paddingLeft: 15,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  itemText: {
    color: '#333',
  },
  selectedItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryPicker;
