import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  user?: { name: string; email: string };
}

interface InvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ visible, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>Order ID: {order._id.substring(0, 10)}...</Text>
          <Text style={styles.date}>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>

          {order.user && (
            <View style={styles.customerInfo}>
              <Text style={styles.label}>Customer:</Text>
              <Text>{order.user.name}</Text>
              <Text>{order.user.email}</Text>
            </View>
          )}

          <View style={styles.tableHeader}>
            <Text style={[styles.column, { flex: 2 }]}>Item</Text>
            <Text style={styles.column}>Qty</Text>
            <Text style={styles.column}>Price</Text>
            <Text style={styles.column}>Total</Text>
          </View>

          <ScrollView style={styles.itemsList}>
            {order.orderItems.map((item) => (
              <View key={item._id} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>${item.price}</Text>
                <Text style={styles.cell}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>${order.totalPrice.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  customerInfo: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 5,
    marginBottom: 10,
  },
  column: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemsList: {
    maxHeight: 200,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    fontSize: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 2,
    borderTopColor: '#333',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  closeButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InvoiceModal;
