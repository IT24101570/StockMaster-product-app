import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { apiCall } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import InvoiceModal from '../../components/InvoiceModal';

const SalesReportScreen = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTransactions = async () => {
    try {
      const data = await apiCall('/transactions');
      setTransactions(data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalSales = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedOrder(item.order);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <View style={[styles.badge, item.status === 'Paid' ? styles.paidBadge : styles.unpaidBadge]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View>
          <Text style={styles.userName}>{item.user?.name || 'Guest'}</Text>
          <Text style={styles.method}>{item.paymentMethod}</Text>
        </View>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
      </View>

      <Text style={styles.footerText}>Tap to view invoice</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Report</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Revenue</Text>
        <Text style={styles.summaryValue}>${totalSales.toFixed(2)}</Text>
        <Text style={styles.summarySub}>{transactions.length} Transactions</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchTransactions}
        />
      )}

      <InvoiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        order={selectedOrder}
      />
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
  summaryCard: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  summarySub: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  paidBadge: {
    backgroundColor: '#d4edda',
  },
  unpaidBadge: {
    backgroundColor: '#f8d7da',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#155724',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  method: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  footerText: {
    fontSize: 10,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default SalesReportScreen;
