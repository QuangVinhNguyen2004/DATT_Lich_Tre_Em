import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const userData = await AsyncStorage.getItem('user');
          if (userData) setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Lỗi lấy thông tin user:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Không có thông tin người dùng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/img/logotreem.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.infoCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name || user.fullName || 'Chưa có tên'}</Text>
            <Text style={styles.email}>{user.email || 'Chưa có email'}</Text>
            <Text style={styles.phone}>{user.phone || 'Chưa có số điện thoại'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('UpdateAcc')}>
            <Text style={styles.editText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('SubUser')}
        >
          <Text style={styles.optionText}>Quản lý tài khoản phụ</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('Diary')}
        >
          <Text style={styles.optionText}>Nhật ký</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('Pay')}
        >
          <Text style={styles.optionText}>Thanh toán gia hạn</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('ListChild')}
        >
          <Text style={styles.optionText}>Quản lý danh sách trẻ</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('Help')}
        >
          <Text style={styles.optionText}>Trợ giúp</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
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
