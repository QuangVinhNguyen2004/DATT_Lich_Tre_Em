import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const UpdateAccScreen = () => {
  return (
    <View style={styles.container}>
      {/* Nút quay lại và tiêu đề */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa tài khoản</Text>
      </View>

      {/* Logo Baby */}
      <Image
        style={styles.image}
        source={require('../assets/img/logotreem.png')} 
      />

      {/* Cập nhật thông tin */}
      <Text style={styles.subtitle}>Cập nhật thông tin mới</Text>

      <TextInput style={styles.input} placeholder="Nhập tên mới" />
      <TextInput style={styles.input} placeholder="Nhập SDT mới" keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Nhập email mới" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Nhập mật khẩu mới" secureTextEntry />
      <TextInput style={styles.input} placeholder="Xác nhận mật khẩu mới" secureTextEntry />

      {/* Nút Lưu */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateAccScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  backArrow: {
    fontSize: 28,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  image: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#BDBDBD',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});
