import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { apiCall } from '../services/api';

interface SellProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductSubmitted: () => void;
}

interface FormData {
  name: string;
  category: string;
  price: string;
  condition: string;
  quantity: string;
  description: string;
}

const CATEGORIES = ['General', 'Electronics', 'Shoes', 'Clothing', 'Books', 'Vehicles', 'Furniture'];
const CONDITIONS = ['Like New', 'Good', 'Fair', 'Used'];

export default function SellProductModal({ visible, onClose, onProductSubmitted }: SellProductModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'General',
    price: '',
    condition: 'Used',
    quantity: '1',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(parseInt(formData.quantity))) {
      newErrors.quantity = 'Quantity must be a valid number';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProduct = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await apiCall('/seller-products/submit', 'POST', {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        condition: formData.condition,
        description: formData.description,
      });

      Alert.alert('Success', 'Product submitted for approval! Staff will review it shortly.', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              name: '',
              category: 'General',
              price: '',
              condition: 'Used',
              quantity: '1',
              description: '',
            });
            setErrors({});
            onProductSubmitted();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sell Your Product</Text>
          <TouchableOpacity onPress={onClose} disabled={loading}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>📝 Fill in all details. Staff will review and approve within 24 hours.</Text>
          </View>

          {/* Product Name */}
          <View style={styles.section}>
            <Text style={styles.label}>What are you selling? *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="e.g., Used Toyota Camry 2015"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              editable={!loading}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    formData.category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => handleInputChange('category', cat)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      formData.category === cat && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Condition */}
          <View style={styles.section}>
            <Text style={styles.label}>Item Condition</Text>
            <View style={styles.conditionContainer}>
              {CONDITIONS.map((cond) => (
                <TouchableOpacity
                  key={cond}
                  style={[
                    styles.conditionButton,
                    formData.condition === cond && styles.conditionButtonActive,
                  ]}
                  onPress={() => handleInputChange('condition', cond)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.conditionButtonText,
                      formData.condition === cond && styles.conditionButtonTextActive,
                    ]}
                  >
                    {cond}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.label}>Selling Price ($) *</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              placeholder="Enter your asking price"
              placeholderTextColor="#999"
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              keyboardType="decimal-pad"
              editable={!loading}
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={[styles.input, errors.quantity && styles.inputError]}
              placeholder="How many items?"
              placeholderTextColor="#999"
              value={formData.quantity}
              onChangeText={(value) => handleInputChange('quantity', value)}
              keyboardType="number-pad"
              editable={!loading}
            />
            {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Detailed Description (min 20 chars) *</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput, errors.description && styles.inputError]}
              placeholder="Describe your product in detail - condition, features, any issues, etc."
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              editable={!loading}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            {formData.description && (
              <Text style={styles.charCount}>{formData.description.length} characters</Text>
            )}
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmitProduct}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit for Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  closeButton: {
    fontSize: 24,
    color: '#8E8E93',
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 24,
  },
  infoBanner: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1E',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  descriptionInput: {
    paddingTop: 10,
    height: 120,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFF',
  },
  conditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  conditionButtonActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  conditionButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  conditionButtonTextActive: {
    color: '#FFF',
  },
  footer: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    color: '#1C1C1E',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#34C759',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
