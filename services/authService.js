import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Đăng nhập
// Đăng nhập tài khoản chính (user)
export const loginUser = async ({ email, password }) => {
  const res = await api.post('/user/login', { email, password });
  await AsyncStorage.setItem('user', JSON.stringify({ ...res.data, accountType: 'main' }));
  return res.data;
};

// Đăng nhập tài khoản phụ (subuser)
export const loginSubUser = async ({ email, password }) => {
  const res = await api.post('/sub-users/login', { email, password });
  await AsyncStorage.setItem('user', JSON.stringify({ ...res.data, accountType: 'sub' }));
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
