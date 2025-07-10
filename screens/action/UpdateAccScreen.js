import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { uploadImageApi, updateUserApi } from '../../services/userApi'; 

const UpdateAccScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Nếu có dữ liệu user truyền qua route.params thì lấy, hoặc lấy từ AsyncStorage
  const [user, setUser] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null); // ảnh đại diện URL hoặc URI
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        if (route.params?.user) {
          setUser(route.params.user);
          setName(route.params.user.name || '');
          setPhone(route.params.user.phone || '');
          setEmail(route.params.user.email || '');
          setAvatar(route.params.user.avatar || null);
        } else {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            const userObj = JSON.parse(storedUser);
            setUser(userObj);
            setName(userObj.name || '');
            setPhone(userObj.phone || '');
            setEmail(userObj.email || '');
            setAvatar(userObj.avatar || null);
          }
        }
      } catch (error) {
        console.error('Lỗi load user:', error);
      }
    }
    loadUser();
  }, [route.params]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const handleUpdate = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }
    if (password && password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = avatar;

      // Nếu avatar là URI local (file://...), upload lên server
      if (avatar && avatar.startsWith('file://')) {
        const formData = new FormData();
        const filename = avatar.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', {
          uri: avatar,
          name: filename,
          type,
        });

        const uploadRes = await uploadImageApi(formData);
        avatarUrl = uploadRes.url;
        console.log('Ảnh upload thành công:', avatarUrl);
      }

      // Tạo object dữ liệu cập nhật
      const updatedData = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      };
      if (password) {
        updatedData.password = password;
      }
      if (avatarUrl) {
        updatedData.avatar = avatarUrl;
      }

      const res = await updateUserApi(user._id, updatedData);
      console.log('Cập nhật user thành công:', res);

      // Cập nhật user mới vào AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(res));

      Alert.alert('Thành công', 'Cập nhật thông tin thành công', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Lỗi cập nhật user:', error);
      Alert.alert('Lỗi', 'Cập nhật thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cập nhật tài khoản</Text>

      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.noAvatar}>
            <Text style={{ color: '#aaa' }}>Chọn ảnh đại diện</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới (nếu muốn thay đổi)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UpdateAccScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 24,
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 140,
    height: 140,
  },
  noAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007bff',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});
