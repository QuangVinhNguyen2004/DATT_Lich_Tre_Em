import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  getSubUsersByUser,
  deleteSubUser,
} from '../services/SubUserApi';

const DEFAULT_AVATAR =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const SubUserScreen = () => {
  const [subUsers, setSubUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(user);
      const userId = parsed?._id;
      const data = await getSubUsersByUser(userId);
      setSubUsers(data);
    } catch (err) {
      console.error('Lỗi lấy danh sách:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        onPress: async () => {
          await deleteSubUser(id);
          fetchData();
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          source={{ uri: item.imgUrl || DEFAULT_AVATAR }}
          style={styles.avatar}
        />
        <View style={styles.infoSection}>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>SĐT: {item.phone}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                navigation.navigate('SubAccountForm', { subUser: item })
              }
            >
              <Ionicons name="create-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item._id)}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý tài khoản phụ</Text>
        <View style={{ width: 24 }} /> {/* spacer */}
      </View>

      {/* Danh sách tài khoản phụ */}
      <FlatList
        data={subUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Không có tài khoản phụ nào</Text>
        }
      />

      {/* Nút thêm */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('SubAccountForm')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SubUserScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
},
headerTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  flex: 1,
  color: '#333',
  marginLeft: 8,
},
  card: {
    backgroundColor: '#c3d891ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  infoSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  editBtn: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 6,
  },
  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 14,
    borderRadius: 50,
    elevation: 5,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontStyle: 'italic',
  },
});
