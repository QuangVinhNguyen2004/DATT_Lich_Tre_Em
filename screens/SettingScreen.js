import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const SettingsScreen = () => {
   const navigation = useNavigation();
  const user = {
    name: 'Nguyễn Thị Tuyết',
    email: 'tuyet011@gmail.com',
    phone: '09632567277',
  };

  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/img/logotreem.png')}
          style={styles.logo}
          />
        </View>

        <View style={styles.infoCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('UpdateAcc')}>
            <Text style={styles.editText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity  style={styles.optionItem}>
            <Text style={styles.optionText}>Quản lý tài khoản phụ</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity  style={styles.optionItem}>
            <Text style={styles.optionText}>Nhật ký</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity  style={styles.optionItem} onPress={() => navigation.navigate('Pay')}>
            <Text style={styles.optionText}>Thanh toán gia hạn</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity  style={styles.optionItem}>
            <Text style={styles.optionText}>Quản lý danh sách trẻ </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity  style={styles.optionItem}>
            <Text style={styles.optionText}>Trợ giúp</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

     
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  infoCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  email: {
    color: '#888',
    fontSize: 14,
  },
  phone: {
    color: '#888',
    fontSize: 14,
  },
  editText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  optionItem: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  logoutBtn: {
    marginTop: 24,
    alignItems: 'center',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },

});
