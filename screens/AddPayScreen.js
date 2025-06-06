import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddPayScreen = () => {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Thêm thẻ Ngân hàng</Text>
        </View>

        {/* Nội dung hướng dẫn */}
        <Text style={styles.instruction}>
          1. Vui lòng đảm bảo tính chính xác của các thông tin đã cung cấp.
        </Text>
        <Text style={styles.instruction}>
          2. Để đảm bảo an toàn, Chúng tôi sẽ tự động đặt tài khoản ngân hàng mới của bạn làm tài khoản ngân hàng mặc định và xác minh tài khoản đó. Khi bạn gửi yêu cầu thay đổi tài khoản ngân hàng mặc định, bạn được coi là đã đồng ý. Nếu tài khoản mới không thể được xác minh, tài khoản ngân hàng mặc định sẽ tự động được khôi phục thành tài khoản ngân hàng đã xác minh khác.
        </Text>

        {/* Ô nhập */}
        <TextInput
          placeholder="Họ và Tên"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TextInput
          placeholder="Số CCCD/Căn cước (gắn chip)"
          value={idNumber}
          onChangeText={setIdNumber}
          style={styles.input}
          placeholderTextColor="#888"
        />

        {/* Nút lưu */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPayScreen;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    marginTop:15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  instruction: {
    fontSize: 14,
    color: '#000',
    marginBottom: 12,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 30,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
