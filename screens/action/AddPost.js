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
import { Video } from 'expo-av'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const postTypes = ['Gia đình', 'Cộng đồng'];

export default function AddPostScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState(postTypes[0]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cảnh báo', 'Bạn cần cấp quyền truy cập thư viện để sử dụng tính năng này');
      }

      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user._id);
      }
    })();
  }, []);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // ⚠️ Chỉ hoạt động trên iOS/EAS build
      quality: 1,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || 'image.jpg',
        type: asset.type || 'image/jpeg',
      }));
      setImages((prev) => [...prev, ...selected]);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setVideo({
        uri: asset.uri,
        name: asset.fileName || 'video.mp4',
        type: asset.type || 'video/mp4',
      });
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const validate = () => {
    if (!title.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề');
    if (!content.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập nội dung');
    return true;
  };

const handleAddPost = async () => {
  if (!validate()) return;

  setLoading(true);
  try {
    const formData = new FormData();

    formData.append('user', userId);
    formData.append('tieu_de', title.trim());
    formData.append('noi_dung', content.trim());
    formData.append('loai', type);
    formData.append('trang_thai', type === 'Gia đình' ? 'đã duyệt' : 'chờ duyệt');

    // Ảnh
    images.forEach((img, index) => {
      formData.append('anh', {
        uri: img.uri,
        name: img.name || `image_${index}.jpg`,
        type: 'image/jpeg', // ✅ MIME type chuẩn
      });
    });

    // Video
    if (video) {
      formData.append('video', {
        uri: video.uri,
        name: video.name || 'video.mp4',
        type: 'video/mp4', // ✅ MIME type chuẩn
      });
    }

    console.log('>>> FormData gửi:', formData);

    const response = await fetch('http://192.168.52.104:3000/api/post', {
      method: 'POST',
      body: formData, // ✅ KHÔNG headers!
    });

    if (!response.ok) throw new Error('Thất bại');
    const result = await response.json();

    Alert.alert('Thành công', 'Bài viết đã được gửi');
    navigation.goBack();
  } catch (err) {
    console.error('>>> Lỗi gửi bài viết:', err);
    Alert.alert('Lỗi', 'Không gửi được bài viết');
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
        <Text style={styles.title}>Thêm Bài Viết</Text>

        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tiêu đề"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Loại bài viết</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowTypeDropdown(!showTypeDropdown)}
        >
          <Text>{type}</Text>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>

        {showTypeDropdown &&
          postTypes.map((item) => (
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

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={content}
          onChangeText={setContent}
          placeholder="Nhập nội dung"
        />

        <TouchableOpacity style={styles.button} onPress={pickImages}>
          <Text style={styles.buttonText}>Chọn ảnh</Text>
        </TouchableOpacity>

        <ScrollView horizontal>
          {images.map((img, index) => (
            <View key={index} style={{ marginRight: 8, position: 'relative' }}>
              <Image source={{ uri: img.uri }} style={{ width: 100, height: 100, borderRadius: 6 }} />
              <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                <Ionicons name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={pickVideo}>
          <Text style={styles.buttonText}>Chọn video</Text>
        </TouchableOpacity>

        {video && (
          <View style={{ marginVertical: 10 }}>
            <Text>Video đã chọn:</Text>
            <Video
              source={{ uri: video.uri }}
              style={{ height: 200, width: '100%' }}
              useNativeControls
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.removeIcon} onPress={removeVideo}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={handleAddPost}>
            <Text style={styles.buttonText}>Gửi duyệt</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  label: { marginTop: 12, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FAFAFA',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: '#EEE',
    marginBottom: 4,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  removeIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    zIndex: 10,
  },
});
