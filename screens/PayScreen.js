import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { getCards } from '../api/PayApi'; // API lấy danh sách thẻ

const PaymentScreen = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  // // Lấy danh sách thẻ khi màn hình load
  // useEffect(() => {
  //   fetchCards();
  // }, []);

  // const fetchCards = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await getCards();
  //     setCards(data);
  //   } catch (error) {
  //     Alert.alert('Lỗi', 'Không lấy được danh sách thẻ ngân hàng.');
  //     console.error('Fetch cards error:', error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => navigation.navigate('AddPay', { card: item })}
    >
      <Text style={styles.cardText}>
        **** {item.so_tai_khoan.slice(-6)}{' '}
        <Text style={styles.bankText}>{item.ten_ngan_hang}</Text>
      </Text>
      <Ionicons name="chevron-forward" size={20} color="black" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Thêm thẻ ngân hàng */}
      <Text style={styles.sectionTitle}>Thêm thẻ Ngân hàng</Text>

      {/* Danh sách thẻ */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
              Không có thẻ ngân hàng nào.
            </Text>
          }
        />
      )}
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
