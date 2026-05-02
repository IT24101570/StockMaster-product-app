import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // kept for potential future use

interface ProductCardProps {
  product: any;
  onAddToCart?: (product: any) => void;
  onProductPress?: (product: any) => void;
  hideCart?: boolean; // Set true for Staff/Admin — hides the Add to Cart button
}

const { width } = Dimensions.get('window');
// Calculate card width for a 2-column grid with padding
const cardWidth = (width - 48) / 2;

export default function ProductCard({
  product,
  onAddToCart,
  onProductPress,
  hideCart = false,
}: ProductCardProps) {
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity < 5 && product.quantity > 0;

  // Use product image or a dedicated seed from picsum based on ID for a beautiful UI
  const displayImage = product.imageUrl && product.imageUrl.trim() !== '' 
    ? product.imageUrl 
    : `https://picsum.photos/seed/${product._id || Math.random()}/400/400`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onProductPress?.(product)}
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: displayImage }}
          style={styles.image}
        />
        {isLowStock && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.badgeText}>Low Stock</Text>
          </View>
        )}
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Sold Out</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category || 'General'}
        </Text>

        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          <View style={styles.stockBadge}>
            <Text style={styles.stockBadgeText}>Stock: {product.quantity}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: cardWidth, // Square image
    backgroundColor: '#F4F4F5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 149, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoContainer: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A1A1AA',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
    lineHeight: 18,
    height: 36, // Fixed height for 2 lines to maintain grid alignment
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#007AFF',
  },
  perUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A1A1AA',
  },
  stockBadge: {
    backgroundColor: '#E5F2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
});
