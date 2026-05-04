import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { apiCall } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/AppInput';

const InventoryScreen = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const data = await apiCall('/products');
      setProducts(data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setUpdating(id);
    try {
      await apiCall(`/products/${id}`, 'PUT', { quantity: newQuantity });
      setProducts(products.map(p => p._id === id ? { ...p, quantity: newQuantity } : p));
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update stock');
    } finally {
      setUpdating(null);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.stockText, item.quantity < 5 && styles.lowStock]}>
          Current Stock: {item.quantity}
          {item.quantity < 5 && ' (LOW)'}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => handleUpdateStock(item._id, item.quantity - 1)}
          disabled={updating === item._id}
        >
          <Ionicons name="remove-circle" size={32} color="#ff4d4d" />
        </TouchableOpacity>

        {updating === item._id ? (
          <ActivityIndicator size="small" color="#007bff" style={{ marginHorizontal: 10 }} />
        ) : (
          <Text style={styles.quantityNum}>{item.quantity}</Text>
        )}

        <TouchableOpacity
          onPress={() => handleUpdateStock(item._id, item.quantity + 1)}
          disabled={updating === item._id}
        >
          <Ionicons name="add-circle" size={32} color="#28a745" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Management</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchInventory}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  lowStock: {
    color: '#ff4d4d',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityNum: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
});

export default InventoryScreen;
