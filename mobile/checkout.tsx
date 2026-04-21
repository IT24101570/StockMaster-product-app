import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import AppButton from '../../components/AppButton';
import { apiCall } from '../../services/api';

const CheckoutScreen = () => {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      // 1. Create Order
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: cartTotal,
      };

      const order = await apiCall('/orders', 'POST', orderData);

      // 2. Create Transaction
      await apiCall('/transactions', 'POST', {
        orderId: order._id,
        paymentMethod,
        amount: cartTotal,
        status: 'Paid',
      });

      clearCart();
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.map((item) => (
          <View key={item._id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {['Cash', 'Card', 'Mobile Pay'].map((method) => (
          <TouchableOpacity
            key={method}
            style={[styles.methodItem, paymentMethod === method && styles.selectedMethod]}
            onPress={() => setPaymentMethod(method)}
          >
            <Text style={[styles.methodText, paymentMethod === method && styles.selectedMethodText]}>
              {method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <AppButton
          title={`Pay $${cartTotal.toFixed(2)}`}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={cartItems.length === 0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    color: '#444',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  methodItem: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  selectedMethod: {
    borderColor: '#007bff',
    backgroundColor: '#e7f1ff',
  },
  methodText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedMethodText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 40,
  },
});

export default CheckoutScreen;
