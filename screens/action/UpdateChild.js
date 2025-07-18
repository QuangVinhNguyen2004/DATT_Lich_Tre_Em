import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { updateChild } from '../../services/childApi';

const EditChildScreen = ({ route, navigation }) => {
  const { child } = route.params;

  const [name, setName] = useState(child.name || '');
  const [age, setAge] = useState(child.age ? String(child.age) : '');
  const [birthDate, setBirthDate] = useState(new Date(child.birth_date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(child.gender || 'Nam');
  const [weight, setWeight] = useState(child.weight ? String(child.weight) : '');
  const [img, setImg] = useState(child.img || null);
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
      const today = new Date();
      const yearDiff = today.getFullYear() - selectedDate.getFullYear();
      setAge(yearDiff.toString());
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImg(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim() || !age.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const updatedChild = {
        name: name.trim(),
        age: Number(age),
        birth_date: birthDate,
        gender,
        weight: weight ? Number(weight) : undefined,
        img,
      };

      await updateChild(child._id, updatedChild);
      Alert.alert('Thành công', 'Cập nhật hồ sơ trẻ thành công');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      Alert.alert('Lỗi', 'Cập nhật thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sửa hồ sơ trẻ</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên trẻ"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>Ngày sinh: {birthDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Tuổi"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'Nam' && styles.genderSelected]}
          onPress={() => setGender('Nam')}
        >
          <Text style={gender === 'Nam' ? { color: '#fff' } : {}}>Nam</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.genderButton, gender === 'Nữ' && styles.genderSelected]}
          onPress={() => setGender('Nữ')}
        >
          <Text style={gender === 'Nữ' ? { color: '#fff' } : {}}>Nữ</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Cân nặng (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={{ color: '#007bff' }}>{img ? 'Đổi ảnh' : 'Chọn ảnh từ thư viện'}</Text>
      </TouchableOpacity>

      {img && <Image source={{ uri: img }} style={styles.imagePreview} />}

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

export default EditChildScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  genderContainer: { flexDirection: 'row', marginBottom: 16 },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  genderSelected: { backgroundColor: '#007bff', borderColor: '#007bff' },
  imageButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
  },
  imagePreview: { width: '100%', height: 200, marginBottom: 16, borderRadius: 8 },
  button: {
    height: 48,
    backgroundColor: '#007bff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
