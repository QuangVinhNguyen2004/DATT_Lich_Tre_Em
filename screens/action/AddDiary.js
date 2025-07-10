import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addDiary } from '../../services/DiaryApi';

const AddDiaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Lấy child được chọn từ param navigation (bắt buộc khi mở màn hình này)
  const { selectedChild } = route.params || {};

  const [noiDung, setNoiDung] = useState('');

  const handleAdd = async () => {
    if (!selectedChild || !noiDung.trim()) {
      Alert.alert('Lỗi', 'Không thể thêm nhật ký: thiếu trẻ hoặc nội dung');
      return;
    }

    try {
      await addDiary({
        child_id: selectedChild._id,
        noi_dung: noiDung,
        thoi_gian_tao: new Date(),
      });

      Alert.alert('Thành công', 'Đã thêm nhật ký');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi thêm nhật ký:', error.message);
      Alert.alert('Lỗi', 'Không thể thêm nhật ký');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm nhật ký cho: {selectedChild?.name || 'Không rõ'}</Text>

      <Text style={styles.label}>Nội dung:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập nội dung nhật ký..."
        value={noiDung}
        onChangeText={setNoiDung}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
        <Text style={styles.saveText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddDiaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#198754',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
