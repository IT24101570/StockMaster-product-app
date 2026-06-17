import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { orderService } from '../../services/productService';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#4CD964';
      case 'Pending':
        return '#FF9500';
      case 'Cancelled':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Order History</Text>
        </View>
        <EmptyState
          icon="📋"
          title="No Orders Yet"
          message="Start shopping to place your first order"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
        <Text style={styles.orderCount}>{orders.length} orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => {
              // Navigate to order details - implement if needed
            }}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{item._id.slice(-8).toUpperCase()}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Items</Text>
                <Text style={styles.detailValue}>{item.orderItems?.length || 0}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total</Text>
                <Text style={styles.detailPrice}>${item.totalPrice?.toFixed(2) || '0.00'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  orderCount: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  orderDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  detailPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
});
