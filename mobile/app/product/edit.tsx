import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { apiCall } from '../../services/api';
import CategoryPicker from '../../components/CategoryPicker';

const EditProductScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    category: 'General',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await apiCall(`/products/${id}`);
        setFormData({
          name: product.name,
          price: product.price.toString(),
          description: product.description,
          quantity: product.quantity.toString(),
          category: product.category,
          imageUrl: product.imageUrl || '',
        });
      } catch {
        Alert.alert('Error', 'Failed to fetch product details');
        router.back();
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await apiCall(`/products/${id}`, 'PUT', {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      Alert.alert('Success', 'Product updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

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
        <AppButton title="Update Product" onPress={handleSubmit} loading={loading} />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default EditProductScreen;
