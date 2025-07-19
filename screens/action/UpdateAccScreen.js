import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { uploadImageApi, updateUserApi } from '../../services/userApi';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export default function UpdateAccountScreen({ navigation, route }) {
  const editingUser = route.params?.user || null;

  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cảnh báo', 'Bạn cần cấp quyền truy cập thư viện để sử dụng tính năng này');
      }

      let user = editingUser;
      if (!user) {
        const userData = await AsyncStorage.getItem('user');
        user = userData ? JSON.parse(userData) : null;
      }
      if (user) {
        setUserId(user._id);
        setName(user.name || '');
        setPhone(user.phone || '');
        setEmail(user.email || '');
        setImgUrl(user.imgUrl || ''); 
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImgUrl(asset.uri); // URI local tạm thời, chưa upload
    }
  };

  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      let finalImgUrl = imgUrl;

     
      if (imgUrl && imgUrl.startsWith('file://')) {
        
        const formData = new FormData();
        const filename = imgUrl.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';

        formData.append('image', {
          uri: imgUrl,
          name: filename,
          type,
        });

        const uploadRes = await uploadImageApi(formData);
        finalImgUrl = uploadRes.url;
      }

      const updatedData = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        imgUrl: finalImgUrl,
      };
      if (password.trim()) {
        updatedData.password = password;
      }
    console.log('ID người dùng cần cập nhật:', userId);
    console.log('Dữ liệu cập nhật gửi lên API:', updatedData);
      // Gọi API cập nhật user
      await updateUserApi(userId, updatedData);

      // Cập nhật AsyncStorage nếu cần
      const updatedUser = { ...updatedData, _id: userId };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      Alert.alert('Thành công', 'Cập nhật tài khoản thành công');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi cập nhật user:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.title}>Cập nhật tài khoản</Text>

        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={imgUrl ? { uri: imgUrl } : { uri: DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <Text style={styles.changePhotoText}>Chọn ảnh đại diện</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật khẩu mới (nếu muốn thay đổi)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Cập nhật</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  changePhotoText: {
    marginTop: 8,
    color: '#007AFF',
    fontWeight: '600',
  },
  label: { fontSize: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
