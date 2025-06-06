import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const cards = [
  { id: '1', number: '**** 94545457', bank: 'BIDV Bank' },
  { id: '2', number: '**** 94545656', bank: 'MB Bank' },
];

const PaymentScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Thanh toán</Text>
        <View style={{ width: 24 }} /> {/* Chừa khoảng cho icon bên phải nếu có */}
      </View>

      {/* Thêm thẻ ngân hàng */}
      <Text style={styles.sectionTitle}>Thêm thẻ Ngân hàng</Text>

      {/* Danh sách thẻ */}
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardItem}>
            <Text style={styles.cardText}>
              {item.number} <Text style={styles.bankText}>{item.bank}</Text>
            </Text>
            <Ionicons name="chevron-forward" size={20} color="black" onPress={() => navigation.navigate('AddPay')}/>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ gap: 12 }}
      />
    </View>
  );
};

export default PaymentScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bankText: {
    fontWeight: 'bold',
  },
});
