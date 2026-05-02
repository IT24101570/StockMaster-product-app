import { apiCall } from './api';
import { Product } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/Config';

export const productService = {
  // Get all products with search, filter, sort
  async getProducts(search?: string, category?: string, sort?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    if (sort) params.append('sort', sort);

    return await apiCall(`/products?${params.toString()}`);
  },

  // Get single product
  async getProductById(id: string) {
    return await apiCall(`/products/${id}`);
  },

  // Create product
  async createProduct(productData: Partial<Product>) {
    return await apiCall('/products', 'POST', productData);
  },

  // Update product
  async updateProduct(id: string, productData: Partial<Product>) {
    return await apiCall(`/products/${id}`, 'PUT', productData);
  },

  // Delete product
  async deleteProduct(id: string) {
    return await apiCall(`/products/${id}`, 'DELETE');
  },

  // Upload product image
  async uploadImage(imageFile: any) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = await AsyncStorage.getItem('userToken');

    const response = await fetch(`${API_URL}/products/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },
};

export const orderService = {
  // Create order
  async createOrder(orderData: any) {
    return await apiCall('/orders', 'POST', orderData);
  },

  // Get user's orders
  async getMyOrders() {
    return await apiCall('/orders/myorders');
  },

  // Get all orders (admin only)
  async getAllOrders() {
    return await apiCall('/orders');
  },
};

export const statsService = {
  // Get dashboard stats
  async getStats() {
    return await apiCall('/stats');
  },
};

export const adminService = {
  async getUsers() {
    return await apiCall('/users');
  },
  async updateUserRole(id: string, role: 'customer' | 'staff' | 'admin') {
    return await apiCall(`/users/${id}/role`, 'PUT', { role });
  },
  async deleteUser(id: string) {
    return await apiCall(`/users/${id}`, 'DELETE');
  },
};
