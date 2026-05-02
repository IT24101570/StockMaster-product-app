import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiCall } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function ProductDetailScreen() {
  const router = useRouter();
  
  const { productId } = useLocalSearchParams();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const loadProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/products/${productId}`);
      setProduct(data.product || data);
    } catch (error: any) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProductDetails();
  }, [loadProductDetails]);

  const handleAddToCart = () => {
    const existingItem = cartItems.find((item) => item._id === product._id);
    const cartQty = existingItem?.quantity || 0;
    const availableToAdd = product.quantity - cartQty;

    if (quantity > availableToAdd) {
      Alert.alert(
        'Stock Limit Reached', 
        `You already have ${cartQty} in your cart. You can only add ${Math.max(0, availableToAdd)} more.`
      );
      return;
    }

    addToCart(product, quantity);

    Alert.alert('Success', `${quantity} ${product.name} added to cart!`, [
      {
        text: 'Continue Shopping',
        onPress: () => router.back(),
      },
      {
        text: 'Go to Cart',
        onPress: () => router.push('/(tabs)/cart'),
      },
    ]);
  };

  const handleAddReview = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await apiCall(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: newRating,
          comment: newComment
        })
      });

      Alert.alert('Success', 'Review added successfully!');
      setNewComment('');
      setNewRating(5);
      loadProductDetails(); // Refresh to show new review
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add review';
      Alert.alert('Error', message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.backButton} />
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.imageUrl && product.imageUrl.trim() !== '' ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.image}
              onError={() => console.log('Image failed to load')}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageEmoji}>📦</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingRow}>
            <Text style={styles.category}>📁 {product.category || 'General'}</Text>
            <Text style={styles.rating}>⭐ {product.rating?.toFixed(1) || '0.0'} ({product.numReviews || 0} reviews)</Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={[
              styles.stockStatus,
              product.quantity > 0 ? styles.stockAvailable : styles.stockOutOfStock
            ]}>
              {product.quantity > 0 ? `✓ ${product.quantity} in stock` : 'Out of Stock'}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.description || 'No description available for this product.'}
            </Text>
          </View>

          {/* Quantity Selector */}
          {product.quantity > 0 && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityDisplay}>{quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    quantity >= product.quantity && styles.quantityButtonDisabled,
                  ]}
                  onPress={() => {
                    if (quantity < product.quantity) {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.quantityLimit}>Max available: {product.quantity}</Text>
            </View>
          )}

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>

            {/* Add Review Form */}
            <View style={styles.addReviewForm}>
              <Text style={styles.subTitle}>Add your review</Text>
              <View style={styles.ratingPicker}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                    <Text style={[styles.starIcon, newRating >= star && styles.starActive]}>
                      {newRating >= star ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience with this product..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={[styles.submitReviewButton, submittingReview && styles.disabledButton]}
                onPress={handleAddReview}
                disabled={submittingReview}
              >
                {submittingReview ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.submitReviewText}>Post Review</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Reviews List */}
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review: any, index: number) => (
                <View key={review._id || index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>{review.name}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.reviewRating}>{'⭐'.repeat(review.rating)}</Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
            )}
          </View>

          {/* Product Technical Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SKU:</Text>
              <Text style={styles.detailValue}>{product._id?.slice(-8).toUpperCase() || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{product.category || 'General'}</Text>
            </View>
            {product.createdAt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Added:</Text>
                <Text style={styles.detailValue}>
                  {new Date(product.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      {product.quantity > 0 ? (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>🛒 Add {quantity} to Cart</Text>
          </TouchableOpacity>
          <Text style={styles.totalPrice}>Total: ${(product.price * quantity).toFixed(2)}</Text>
        </View>
      ) : (
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.addToCartButton, styles.outOfStockButton]} disabled>
            <Text style={styles.addToCartText}>Out of Stock</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    width: 60,
  },
  backIcon: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  imageContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 300,
    height: 300,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEmoji: {
    fontSize: 80,
  },
  infoSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 80, // Space for footer
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: '#8E8E93',
  },
  rating: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stockAvailable: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  stockOutOfStock: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
  },
  descriptionSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  quantitySection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  quantityButtonDisabled: {
    opacity: 0.3,
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  quantityDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  quantityLimit: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 10,
  },
  reviewsSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  addReviewForm: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  ratingPicker: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  starIcon: {
    fontSize: 24,
    color: '#C7C7CC',
  },
  starActive: {
    color: '#FF9500',
  },
  reviewInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 12,
  },
  submitReviewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  noReviews: {
    textAlign: 'center',
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 10,
  },
  reviewCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewUser: {
    fontWeight: 'bold',
    color: '#1C1C1E',
    fontSize: 14,
  },
  reviewDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  reviewRating: {
    fontSize: 12,
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: '#3A3A3C',
    lineHeight: 20,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    marginRight: 12,
  },
  outOfStockButton: {
    backgroundColor: '#D0D0D0',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
});
