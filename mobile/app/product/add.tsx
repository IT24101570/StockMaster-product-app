import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { apiCall } from '../../services/api';
import CategoryPicker from '../../components/CategoryPicker';

const AddProductScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    category: 'General',
    imageUrl: '',
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await apiCall('/products', 'POST', {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      Alert.alert('Success', 'Product added successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>

      <AppInput
        label="Product Name *"
        placeholder="Enter product name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <AppInput
        label="Price ($) *"
        placeholder="0.00"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
      />

      <AppInput
        label="Quantity *"
        placeholder="0"
        keyboardType="numeric"
        value={formData.quantity}
        onChangeText={(text) => setFormData({ ...formData, quantity: text })}
      />

      <CategoryPicker
        selectedCategory={formData.category}
        onSelectCategory={(cat) => setFormData({ ...formData, category: cat })}
      />

      <AppInput
        label="Description"
        placeholder="Enter product description"
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
      />

      <AppInput
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        value={formData.imageUrl}
        onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
      />

      <View style={styles.buttonContainer}>
        <AppButton title="Save Product" onPress={handleSubmit} loading={loading} />
        <AppButton title="Cancel" onPress={() => router.back()} variant="secondary" style={{ marginTop: 10 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default AddProductScreen;
