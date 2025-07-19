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
import { loginUser ,loginSubUser } from '../services/authService';
import { getChildrenByUser } from '../services/childApi';
import { getUserById } from '../services/userApi'; 

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
    console.log('🔐 Thử đăng nhập tài khoản chính...');

    // Thử đăng nhập tài khoản chính
    const main = await loginUser({ email, password });

    // Nếu đăng nhập thành công, kiểm tra trạng thái tài khoản
    if (main.status === 'private') {
      Alert.alert('Lỗi', 'Tài khoản chính đã bị khóa');
      return;
    }

    await AsyncStorage.setItem('user', JSON.stringify({
      ...main,
      accountType: 'main',
    }));

    const children = await getChildrenByUser(main._id);

    Alert.alert('Thành công', `Xin chào ${main.name}`);
    if (children.length === 0) {
      navigation.navigate('AddChild');
    } else {
      navigation.navigate('Menu');
    }

    return; // Dừng tại đây nếu đăng nhập chính thành công
  } catch (err) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message;

    // Nếu là lỗi do bị khóa
    if (status === 403 && msg === 'Tài khoản đã bị khóa') {
      Alert.alert('Lỗi', 'Tài khoản chính đã bị khóa');
      return;
    }

    // Nếu là lỗi tài khoản không tồn tại hoặc sai mật khẩu
    if (status === 400 && msg === 'Tài khoản không tồn tại') {
      console.log('🟡 Không phải tài khoản chính. Thử đăng nhập phụ...');
    } else {
      // Các lỗi khác
      console.error('❌ Lỗi đăng nhập:', msg || err.message);
      Alert.alert('Lỗi', msg || 'Đăng nhập thất bại. Vui lòng thử lại.');
      return;
    }
  }

  // Thử đăng nhập tài khoản phụ
  try {
    const res = await loginSubUser({ email, password });
    const user = res.subUser;

    if (!user) {
      Alert.alert('Lỗi', 'Tài khoản phụ không tồn tại');
      return;
    }

    const mainUser = await getUserById(user.user_id);
    if (!mainUser) {
      Alert.alert('Lỗi', 'Tài khoản chính liên kết không tồn tại');
      return;
    }

    if (mainUser.status === 'private') {
      Alert.alert('Lỗi', 'Tài khoản chính đã bị khóa, tài khoản phụ không thể đăng nhập');
      return;
    }

    await AsyncStorage.setItem('user', JSON.stringify({
      ...user,
      accountType: 'sub',
      mainUser,
    }));

    Alert.alert('Thành công', `Xin chào ${user.name}`);
    navigation.navigate('Menu');
  } catch (err) {
    console.error('❌ Lỗi đăng nhập phụ:', err?.response?.data || err.message);
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