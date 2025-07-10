import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChildrenByUser, deleteChild } from '../services/childApi';
import { Ionicons } from '@expo/vector-icons';

const ListChildScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

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

  const fetchChildren = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getChildrenByUser(userId);
      setChildren(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách trẻ:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách trẻ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId && isFocused) {
      fetchChildren();
    }
  }, [userId, isFocused]);

  const confirmDelete = (childId) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa hồ sơ trẻ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteChild(childId);
            Alert.alert('Thông báo', 'Xóa hồ sơ trẻ thành công');
            fetchChildren();
          } catch (error) {
            Alert.alert('Lỗi', 'Xóa hồ sơ thất bại');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('EditChild', { child: item })}
      onLongPress={() => confirmDelete(item._id)}
    >
      <Image
        source={
          item.img
            ? { uri: item.img }
            : require('../assets/img/cuoihaha.png') 
        }
        style={styles.childImage}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Tuổi: {item.age}</Text>
        <Text>Giới tính: {item.gender}</Text>
        {item.weight ? <Text>Cân nặng: {item.weight} kg</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#333" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách trẻ</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : children.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có hồ sơ trẻ nào.</Text>
      ) : (
        <FlatList
          data={children}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddChild')}
      >
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ListChildScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  childImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  emptyText: { marginTop: 40, textAlign: 'center', color: '#888' },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
