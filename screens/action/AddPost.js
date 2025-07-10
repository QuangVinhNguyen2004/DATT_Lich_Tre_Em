import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { addPost } from '../../services/PostApi';

const postTypes = ['Gia đình', 'Cộng đồng'];

const AddPostScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState(postTypes[0]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user._id);
        }
      } catch (error) {
        console.error('Lỗi lấy user:', error);
      }
    };
    loadUser();
  }, []);

  const validate = () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề bài viết');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung bài viết');
      return false;
    }
    return true;
  };

const handleAddPost = async () => {
  if (!validate()) return;

  setLoading(true);
  try {
    const newPost = {
      user: userId,
      tieu_de: title.trim(),
      noi_dung: content.trim(),
      loai: type,
      trang_thai: type === 'Gia đình' ? 'đã duyệt' : 'chờ duyệt', // cập nhật trạng thái theo loại
    };
    console.log('>> Gửi bài viết:', newPost);
    await addPost(newPost);
    Alert.alert('Thành công', 'Bài viết đã được gửi duyệt');
    navigation.goBack();
  } catch (error) {
    Alert.alert('Lỗi', 'Thêm bài viết thất bại');
    console.error('Lỗi thêm bài viết:', error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: null })}
      style={styles.container}
    >
      <Text style={styles.title}>Thêm Bài Viết</Text>

      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề"
        value={title}
        onChangeText={setTitle}
        editable={!loading}
      />

      <Text style={styles.label}>Loại bài viết</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowTypeDropdown(!showTypeDropdown)}
        disabled={loading}
      >
        <Text style={styles.dropdownText}>{type}</Text>
        <Ionicons name="chevron-down" size={20} />
      </TouchableOpacity>
      {showTypeDropdown && (
        <View style={styles.dropdownList}>
          {postTypes.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.dropdownItem}
              onPress={() => {
                setType(item);
                setShowTypeDropdown(false);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nhập nội dung bài viết"
        value={content}
        onChangeText={setContent}
        multiline
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddPost}>
          <Text style={styles.buttonText}>Gửi duyệt</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#fff',
    elevation: 3,
    maxHeight: 140,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
