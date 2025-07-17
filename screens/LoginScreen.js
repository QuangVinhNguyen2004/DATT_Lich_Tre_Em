import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/authService';
import { getChildrenByUser } from '../services/childApi';
import { getUserById } from '../services/userApi'; // Hàm lấy user chính theo id

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      console.log('🔐 Gửi dữ liệu đăng nhập:', { email, password });

      const user = await loginUser({ email, password });
      console.log('✅ Phản hồi server:', user);

      if (!user) {
        Alert.alert('Lỗi', 'Đăng nhập thất bại');
        return;
      }

      // Nếu tài khoản chính (có role)
      if (user.role) {
        if (user.status === 'private') {
          Alert.alert('Lỗi', 'Tài khoản chính đã bị khóa');
          return;
        }

        // Lưu thông tin user chính và loại tài khoản
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            accountType: 'main',
          })
        );

        // Kiểm tra hồ sơ trẻ
        const children = await getChildrenByUser(user._id);

        Alert.alert('Thành công', `Xin chào ${user.name}`);

        if (children.length === 0) {
          navigation.navigate('AddChild'); // Chưa có hồ sơ trẻ
        } else {
          navigation.navigate('Menu'); // Có hồ sơ trẻ
        }
      }
      // Nếu tài khoản phụ (không có role nhưng có user_id tham chiếu)
      else if (!user.role && user.user_id) {
        // Lấy tài khoản chính tham chiếu
        const mainUser = await getUserById(user.user_id);

        if (!mainUser) {
          Alert.alert('Lỗi', 'Tài khoản chính liên kết không tồn tại');
          return;
        }
        if (mainUser.status === 'private') {
          Alert.alert(
            'Lỗi',
            'Tài khoản chính đã bị khóa, tài khoản phụ không thể đăng nhập'
          );
          return;
        }

        // Lưu tài khoản phụ, kèm thông tin user chính và loại tài khoản
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            accountType: 'sub',
            mainUser,
          })
        );

        Alert.alert('Thành công', `Xin chào ${user.name}`);

        // Vào luôn màn Menu, bỏ qua kiểm tra child
        navigation.navigate('Menu');
      } else {
        Alert.alert('Lỗi', 'Loại tài khoản không hợp lệ');
      }
    } catch (err) {
      console.error('❌ Lỗi đăng nhập:', err);
      const msg = err?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        <TouchableOpacity onPress={() => navigation.navigate('PassReset')}>
          <Text style={styles.signupLink}>Quên mật khẩu   </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupLink}>Tạo ngay!</Text>
        </TouchableOpacity>
      </Text>

      <View style={styles.LoginButton}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/img/google.png')} style={styles.icon} />
          <Text style={styles.socialText}>Tiếp tục với Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/img/facebook.png')} style={styles.icon} />
          <Text style={styles.socialText}>Tiếp tục với Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  button: {
    height: 48,
    backgroundColor: '#007bff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  signupLink: {
    color: '#007bff',
    fontWeight: 'bold',
    paddingTop: 10,
  },
  LoginButton: {
    marginTop: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  socialText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
