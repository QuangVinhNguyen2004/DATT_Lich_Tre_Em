import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { createChild } from '../../services/childApi';

const AddChildScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('Nam');
  const [weight, setWeight] = useState('');
  const [img, setImg] = useState(null);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
      const today = new Date();
      const yearDiff = today.getFullYear() - selectedDate.getFullYear();
      setAge(yearDiff.toString());
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImg(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !age || !birthDate || !gender) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      const user_id = user?._id || user?.user_id;

      if (!user_id) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
        return;
      }

      const newChild = {
        user_id,
        name,
        age: Number(age),
        birth_date: birthDate,
        gender,
        weight: weight ? Number(weight) : undefined,
        img,
      };

      await createChild(newChild);
      Alert.alert('Thành công', 'Đã thêm hồ sơ trẻ');
      navigation.navigate('Menu');
    } catch (error) {
      console.error('Lỗi thêm hồ sơ trẻ:', error);
      Alert.alert('Lỗi', 'Không thể thêm hồ sơ trẻ. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm hồ sơ trẻ</Text>

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

      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Text style={{ color: '#007bff' }}>
          {img ? 'Đổi ảnh' : 'Chọn ảnh từ thư viện'}
        </Text>
      </TouchableOpacity>

      {img && <Image source={{ uri: img }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Thêm hồ sơ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddChildScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
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
  genderSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  imageButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    height: 48,
    backgroundColor: '#007bff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
