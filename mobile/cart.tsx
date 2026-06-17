import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import AppButton from '../../components/AppButton';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity - 1)}>
            <Ionicons name="remove-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity + 1)}>
            <Ionicons name="add-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item._id)}>
        <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <AppButton
            title="Start Shopping"
            onPress={() => router.replace('/(tabs)')}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
            </View>
            <AppButton
              title="Proceed to Checkout"
              onPress={() => router.push('/orders/checkout')}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  details: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    paddingBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default CartScreen;
