import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Đăng nhập
export const loginUser = async ({ email, password }) => {
  const res = await api.post('/user/login', { email, password });

  // ✅ Lưu toàn bộ user (bao gồm token) nếu đăng nhập thành công
  await AsyncStorage.setItem('user', JSON.stringify(res.data));

  return res.data;
};

// Đăng ký
export const registerUser = async ({ name, phone, email, password }) => {
  const res = await api.post('/user/register', {
    name,
    phone,
    email,
    password,
  });
  return res.data;
};

// Đăng xuất (xóa token)
export const logoutUser = async () => {
  await AsyncStorage.removeItem('user');
};
