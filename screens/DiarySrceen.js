import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

import { getChildrenByUser } from '../services/childApi';
import { getAllDiariesByChild, deleteDiary } from '../services/DiaryApi';

const DiaryScreen = ({ navigation }) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChildList, setShowChildList] = useState(false);

  // Lấy danh sách trẻ
  const loadChildren = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);

      const data = await getChildrenByUser(user._id);
      setChildren(data || []);
      if (data.length > 0) setSelectedChild(data[0]);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách trẻ:', err);
    }
  };

  // Lấy nhật ký theo trẻ
  const fetchDiaries = async (childId) => {
    setLoading(true);
    try {
      const data = await getAllDiariesByChild(childId);
      console.log('>> Dữ liệu nhật ký từ API:', data); // Debug log
      setDiaries(data || []);
    } catch (err) {
      console.error('Lỗi khi lấy nhật ký:', err.message);
      Alert.alert('Lỗi', 'Không thể lấy danh sách nhật ký');
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách trẻ lần đầu
  useEffect(() => {
    loadChildren();
  }, []);

  // Tự động gọi lại khi focus màn hình
  useFocusEffect(
    useCallback(() => {
      if (selectedChild) {
        console.log('>> Màn hình Diary focus: load lại nhật ký');
        fetchDiaries(selectedChild._id);
      }
    }, [selectedChild])
  );

  // Xác nhận xóa nhật ký
  const confirmDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa nhật ký này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        onPress: async () => {
          try {
            await deleteDiary(id);
            Alert.alert('Đã xóa');
            fetchDiaries(selectedChild._id);
          } catch (err) {
            Alert.alert('Lỗi', 'Không thể xóa nhật ký');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  // Hiển thị dropdown chọn trẻ
  const ChildDropdown = () => (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity
        style={styles.childButton}
        onPress={() => setShowChildList(!showChildList)}
      >
        {selectedChild ? (
          <>
            <Image
              source={
                selectedChild.img
                  ? { uri: selectedChild.img }
                  : require('../assets/img/logotreem.png')
              }
              style={styles.childImage}
            />
            <Text style={styles.childText}>{selectedChild.name} ▼</Text>
          </>
        ) : (
          <Text style={styles.childText}>Chưa chọn trẻ ▼</Text>
        )}
      </TouchableOpacity>
      {showChildList && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 200 }}>
            {children.map((child) => (
              <TouchableOpacity
                key={child._id}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedChild(child);
                  setShowChildList(false);
                }}
              >
                <Image
                  source={
                    child.img
                      ? { uri: child.img }
                      : require('../assets/img/logotreem.png')
                  }
                  style={styles.childImageSmall}
                />
                <Text style={styles.dropdownItemText}>{child.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhật ký hoạt động</Text>

      <ChildDropdown />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : diaries.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
          Không có nhật ký nào cho trẻ này.
        </Text>
      ) : (
        <ScrollView style={{ marginTop: 10 }}>
          {diaries.map((item) => (

            <TouchableOpacity
              key={item._id}
              onLongPress={() => confirmDelete(item._id)}
              activeOpacity={0.8}
              style={styles.card}
            >
              <View style={styles.row}>
                <Image
                  source={require('../assets/img/cuoihaha.png')}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.childName}>
                    Bé: {item.child_id?.name ||selectedChild.name}
                  </Text>
                  <Text style={styles.time}>
                    Thời gian: {moment(item.thoi_gian_tao).format('DD/MM/YYYY HH:mm')}
                  </Text>
                  <Text style={styles.content}>Nội dung: {item.noi_dung}</Text>

                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Nút thêm nhật ký */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('AddDiary', { selectedChild })
        }
      >
        <Ionicons name="add-circle" size={48} color="#198754" />
      </TouchableOpacity>
    </View>
  );
};

export default DiaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  childName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    color: 'red',
    fontWeight: '500',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#333',
  },
  user: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  childButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#D1E7DD',
  },
  childImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  childText: {
    fontWeight: 'bold',
    color: '#0F5132',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginTop: 4,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownItemText: {
    marginLeft: 8,
  },
  childImageSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});
