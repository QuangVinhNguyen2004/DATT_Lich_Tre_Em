import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
const PassResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

// const handleResetPassword = async () => {
//   try {
//     const response = await axios.post('http://192.168.52.106:3000/api/auth/forgot-password', {
//       email,
//     });

//     Alert.alert('Thành công', 'Kiểm tra email của bạn để đặt lại mật khẩu');
//     navigation.navigate('NotiReset');
//   } catch (error) {
//     console.error('Lỗi reset mật khẩu:', error.response?.data || error.message);
//     Alert.alert('Lỗi', error.response?.data?.message || 'Không thể gửi yêu cầu');
//   }
// };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Tiêu đề */}
      <Text style={styles.title}>Quên mật khẩu</Text>

      {/* Ô nhập email */}
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Nút tiếp tục */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PassResetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    height: 56,
    backgroundColor: '#007BFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
