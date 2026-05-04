import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { apiCall } from '../../services/api';
import CategoryPicker from '../../components/CategoryPicker';

export default function SubmitProductScreen() {
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
    if (!formData.name || !formData.price || !formData.quantity || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Logic from prompt: Customer submits product -> status becomes 'pending'
      await apiCall('/products', 'POST', {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      Alert.alert('Success', 'Your product has been submitted for approval!');
      router.back();
    } catch (error: any) {
      Alert.alert('Submission Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Submit Product for Sale</Text>
      <Text style={styles.subtitle}>Fill in the details below. Staff will review your submission before it goes live.</Text>

      <AppInput
        label="Product Name *"
        placeholder="What are you selling?"
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
        placeholder="1"
        keyboardType="numeric"
        value={formData.quantity}
        onChangeText={(text) => setFormData({ ...formData, quantity: text })}
      />

      <CategoryPicker
        selectedCategory={formData.category}
        onSelectCategory={(cat) => setFormData({ ...formData, category: cat })}
      />

      <AppInput
        label="Description *"
        placeholder="Describe your product in detail..."
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
      />

      <AppInput
        label="Image URL (Optional)"
        placeholder="https://example.com/image.jpg"
        value={formData.imageUrl}
        onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
      />

      <View style={styles.buttonContainer}>
        <AppButton title="Submit for Approval" onPress={handleSubmit} loading={loading} />
        <AppButton title="Cancel" onPress={() => router.back()} variant="outline" style={{ marginTop: 10 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});
