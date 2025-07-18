import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Alert, StyleSheet,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { createPayment } from '../services/PayApi';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const [months, setMonths] = useState(1);
  const [method, setMethod] = useState('Chuyển khoản ATM');
  const [showModal, setShowModal] = useState(false);

  // Modal state
  const [selectedBank, setSelectedBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const amountPerMonth = 50000;
  const totalAmount = months * amountPerMonth;

  const MOCK_DATA = {
    bankName: 'Vietcombank',
    cardNumber: '1035734330',
    cardHolder: 'Nguyen Van A',
  };

  const bankOptions = [
    { label: 'Vietcombank', value: 'Vietcombank' },
    { label: 'Techcombank', value: 'Techcombank' },
    { label: 'MB Bank', value: 'MB Bank' },
    { label: 'Agribank', value: 'Agribank' },
    { label: 'BIDV', value: 'BIDV' },
  ];

  const handleConfirmPayment = async () => {
    if (
      selectedBank.toLowerCase() === MOCK_DATA.bankName.toLowerCase() &&
      cardNumber === MOCK_DATA.cardNumber &&
      cardHolder.toLowerCase() === MOCK_DATA.cardHolder.toLowerCase()
    ) {
      try {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);

        const res = await createPayment({
          user_id: user._id,
          amount: totalAmount,
          duration: months * 30,
          method,
        });

        Alert.alert('✅ Thành công', res.message);
        setShowModal(false);
        navigation.navigate('PaymentHistory');
      } catch (err) {
        Alert.alert('❌ Lỗi', 'Không thể thanh toán');
      }
    } else {
      Alert.alert('⚠️ Thông tin không đúng', 'Vui lòng kiểm tra lại thông tin ngân hàng');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gia hạn tài khoản</Text>

      <Text style={styles.label}>Chọn thời gian:</Text>
      <Picker
        selectedValue={months}
        onValueChange={setMonths}
        style={styles.picker}
      >
        <Picker.Item label="1 tháng" value={1} />
        <Picker.Item label="3 tháng" value={3} />
        <Picker.Item label="6 tháng" value={6} />
        <Picker.Item label="12 tháng" value={12} />
      </Picker>

      <Text style={styles.label}>Số tiền:</Text>
      <Text style={styles.amount}>{totalAmount.toLocaleString('vi-VN')} đ</Text>

      <Text style={styles.label}>Phương thức thanh toán:</Text>
      <Picker
        selectedValue={method}
        onValueChange={setMethod}
        style={styles.picker}
      >
        <Picker.Item label="Chuyển khoản ATM" value="Chuyển khoản ATM" />
      </Picker>

      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.button}>
        <Text style={styles.btnText}>Thanh toán</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.label}>Xác nhận thanh toán</Text>

            <Text style={{ marginBottom: 4 }}>Ngân hàng:</Text>
            <Picker
              selectedValue={selectedBank}
              onValueChange={setSelectedBank}
              style={styles.picker}
            >
              <Picker.Item label="-- Chọn ngân hàng --" value="" />
              {bankOptions.map((bank) => (
                <Picker.Item
                  key={bank.value}
                  label={bank.label}
                  value={bank.value}
                />
              ))}
            </Picker>

            <TextInput
              placeholder="Số thẻ"
              keyboardType="numeric"
              style={styles.input}
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <TextInput
              placeholder="Chủ thẻ"
              style={styles.input}
              value={cardHolder}
              onChangeText={setCardHolder}
            />

            <TouchableOpacity style={styles.modalBtn} onPress={handleConfirmPayment}>
              <Text style={styles.btnText}>Xác nhận thanh toán</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={[styles.modalBtn, { backgroundColor: 'gray' }]}
            >
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  label: { fontWeight: 'bold', marginTop: 16 },
  picker: {
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: 'green',
  },
  button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  modalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBox: {
    width: '90%', backgroundColor: 'white',
    borderRadius: 10, padding: 20,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 10, borderRadius: 8, marginVertical: 8,
  },
  modalBtn: {
    backgroundColor: 'green', padding: 12,
    borderRadius: 8, marginTop: 10,
  },
});
