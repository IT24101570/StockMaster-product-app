import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../services/api';
import SellProductModal from '../../components/SellProductModal';

interface SubmittedProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export default function SellProductScreen() {
  const { user } = useAuth();
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [submissions, setSubmissions] = useState<SubmittedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/seller-products/my-submissions');
      setSubmissions(data.products || []);
    } catch (error: any) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSubmissions();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9500';
      case 'approved':
        return '#34C759';
      case 'rejected':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '❓';
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Sell Your Items 💰</Text>
          <Text style={styles.subtitle}>List products for sale</Text>
        </View>
        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => setSellModalVisible(true)}
        >
          <Text style={styles.sellButtonText}>➕</Text>
          <Text style={styles.sellButtonLabel}>Sell</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📝 How it works:</Text>
        <Text style={styles.infoText}>1. Fill in product details (price, condition, description)</Text>
        <Text style={styles.infoText}>2. Submit for approval</Text>
        <Text style={styles.infoText}>3. Staff reviews and approves within 24 hours</Text>
        <Text style={styles.infoText}>4. Product goes live to buyers!</Text>
      </View>

      {/* Submissions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Submissions</Text>
        <Text style={styles.submissionCount}>{submissions.length}</Text>
      </View>

      {submissions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Submissions Yet</Text>
          <Text style={styles.emptyText}>Start selling by clicking the ➕ Sell button above</Text>
        </View>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.submissionCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.productDetails}>{item.category} • {item.condition}</Text>
                  <Text style={styles.productPrice}>${item.price}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                  <Text style={styles.statusLabel}>{item.status.toUpperCase()}</Text>
                </View>
              </View>

              {item.status === 'rejected' && item.rejectionReason && (
                <View style={styles.rejectionBox}>
                  <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
                  <Text style={styles.rejectionText}>{item.rejectionReason}</Text>
                </View>
              )}

              <Text style={styles.submittedDate}>
                Submitted: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {/* Sell Product Modal */}
      <SellProductModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onProductSubmitted={() => {
          loadSubmissions();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  sellButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  sellButtonText: {
    fontSize: 18,
    marginBottom: 2,
  },
  sellButtonLabel: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
    marginHorizontal: 12,
    marginVertical: 12,
    padding: 12,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#2E7D32',
    lineHeight: 18,
    marginBottom: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  submissionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  submissionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  statusIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
  },
  rejectionBox: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  rejectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B71C1C',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 12,
    color: '#C62828',
    lineHeight: 16,
  },
  submittedDate: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
  },
});
