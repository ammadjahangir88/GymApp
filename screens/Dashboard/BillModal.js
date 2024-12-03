import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const BillModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const invoiceData = {
    invoiceNumber: 'GYM-2024-1115',
    memberName: 'Usman Khan',
    membershipType: 'Monthly Fitness Package',
    items: [
      { 
        description: 'Monthly Gym Membership', 
        quantity: 1, 
        unitPrice: 5000, 
        total: 5000 
      },
      { 
        description: 'Fitness Class Access', 
        quantity: 1, 
        unitPrice: 0, 
        total: 0 
      },
    ],
    subtotal: 5000,
    tax: 0, 
    total: 5000 
  };

  const renderInvoiceItem = (item, index) => (
    <View key={index} style={styles.invoiceItem}>
      <Text style={styles.invoiceItemDescription}>{item.description}</Text>
      <Text style={styles.invoiceItemQuantity}>x{item.quantity}</Text>
      <Text style={styles.invoiceItemPrice}>{item.total} PKR</Text>
    </View>
  );

  const handlePayBill = () => {
    // Add payment functionality here
    alert('Bill Payment Process Initiated!');
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.viewBillButton} 
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcon name="file-document-outline" size={20} color="#ffffff" />
        <Text style={styles.viewBillText}>Bill Payment</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invoice Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.invoiceHeader}>
                <Text style={styles.invoiceNumber}>
                  Invoice: {invoiceData.invoiceNumber}
                </Text>
               
              </View>

              <View style={styles.memberDetails}>
                <Text style={styles.memberName}>
                  {invoiceData.memberName}
                </Text>
                <Text style={styles.membershipType}>
                  {invoiceData.membershipType}
                </Text>
              </View>

              <View style={styles.invoiceItemsContainer}>
                {invoiceData.items.map(renderInvoiceItem)}
              </View>

              <View style={styles.invoiceSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{invoiceData.subtotal} PKR</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>{invoiceData.tax} PKR</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{invoiceData.total} PKR</Text>
                </View>
              </View>
               {/* Add the "Pay Bill" button */}
            <TouchableOpacity style={styles.payBillButton} onPress={handlePayBill}>
              <Text style={styles.payBillText}>Pay Bill</Text>
            </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Button styles from previous implementation
  viewBillButton: {
    flexDirection: 'row',
    width: 200,
    paddingVertical: 12,
    backgroundColor: '#ff9900',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewBillText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 10,
    fontWeight: '600',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  invoiceNumber: {
    fontSize: 16,
    color: '#555',
  },
  invoiceDate: {
    fontSize: 16,
    color: '#777',
  },
  memberDetails: {
    marginBottom: 20,
    alignItems: 'center',
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  membershipType: {
    fontSize: 16,
    color: '#666',
  },
  invoiceItemsContainer: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  invoiceItemDescription: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
  invoiceItemQuantity: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  invoiceItemPrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  invoiceSummary: {
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9900',
  },

  payBillButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
  },
  payBillText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default BillModal;