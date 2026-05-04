import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { apiCall } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

interface PendingProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
  user: {
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
}

export default function ApproveProductsTab() {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Logic from prompt: Staff sees pending products
      const data = await apiCall('/products?status=pending');
      setProducts(data || []);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load pending products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setActionLoading(id);
      // Logic from prompt: Staff can approve (status -> approved) or reject (status -> rejected)
      await apiCall(`/products/${id}/approve`, 'PUT', { status });
      Alert.alert('Success', `Product ${status} successfully`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pending Approvals</Text>
        <Text style={styles.subtitle}>{products.length} products waiting for review</Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={80} color="#28a745" />
          <Text style={styles.emptyTitle}>All Clear!</Text>
          <Text style={styles.emptyText}>No pending products to review at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category} • ${item.price}</Text>
                <Text style={styles.sellerInfo}>Seller: {item.user?.name || 'Unknown'}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.btn, styles.approveBtn]}
                  onPress={() => handleAction(item._id, 'approved')}
                  disabled={!!actionLoading}
                >
                  {actionLoading === item._id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Approve</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.rejectBtn]}
                  onPress={() => handleAction(item._id, 'rejected')}
                  disabled={!!actionLoading}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productCategory: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    marginTop: 2,
  },
  sellerInfo: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#28a745',
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});
