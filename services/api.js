import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.52.104:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động gắn token từ AsyncStorage vào headers
api.interceptors.request.use(
  async (config) => {
    try {
      const userData = await AsyncStorage.getItem('user'); // bạn đã lưu toàn bộ user sau login
      if (userData) {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.log('Lỗi lấy token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
