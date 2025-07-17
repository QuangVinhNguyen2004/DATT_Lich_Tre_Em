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
import { Ionicons } from '@expo/vector-icons';
import { createSubUser, updateSubUser } from '../../services/SubUserApi';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export default function SubAccountForm({ navigation, route }) {
  const editingSubUser = route.params?.subUser || null;

  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(editingSubUser?.name || '');
  const [phone, setPhone] = useState(editingSubUser?.phone || '');
  const [email, setEmail] = useState(editingSubUser?.email || '');
  const [password, setPassword] = useState(editingSubUser?.password || '');
  const [imgUrl, setImgUrl] = useState(editingSubUser?.imgUrl || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      // Yêu cầu quyền truy cập thư viện ảnh
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cảnh báo', 'Bạn cần cấp quyền truy cập thư viện để sử dụng tính năng này');
      }
      // Lấy user chính từ AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user._id);
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
      setImgUrl(asset.uri);
    }
  };

  const validate = () => {
    if (!name.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên');
    if (!phone.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
    if (!email.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập email');
    if (!password.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        user_id: userId,
        name,
        phone,
        email,
        password,
        imgUrl,
      };
      let res;
      if (editingSubUser) {
        res = await updateSubUser(editingSubUser._id, data);
      } else {
        res = await createSubUser(data);
      }
      Alert.alert('Thành công', editingSubUser ? 'Cập nhật tài khoản phụ thành công' : 'Tạo tài khoản phụ thành công');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu tài khoản phụ');
      console.error(error);
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
        <Text style={styles.title}>
          {editingSubUser ? 'Cập nhật tài khoản phụ' : 'Thêm tài khoản phụ'}
        </Text>

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

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>
              {editingSubUser ? 'Cập nhật' : 'Tạo mới'}
            </Text>
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
