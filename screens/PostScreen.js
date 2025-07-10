import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getPosts,deletePostByUser} from '../services/PostApi';

const filters = ['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Gia đình', 'Cộng đồng'];

const PostScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Lấy userId từ AsyncStorage
  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user._id);
        console.log('>> User ID:', user._id);
      }
    } catch (error) {
      console.error('Lỗi lấy user:', error);
    }
  };
// Gọi khi muốn xóa
const confirmDelete = async (postId) => {
  const userData = await AsyncStorage.getItem('user');
  const user = JSON.parse(userData);

  Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa bài viết này?', [
    { text: 'Hủy', style: 'cancel' },
    {
      text: 'Xóa',
      style: 'destructive',
      onPress: async () => {
        try {
          await deletePostByUser(postId, user._id);
          Alert.alert('Đã xóa bài viết');
          fetchPosts(); // reload lại danh sách bài viết
        } catch (err) {
  console.error('❌ Lỗi khi xóa bài viết:', err.response?.data || err.message);
  Alert.alert('Lỗi', err.response?.data?.message || 'Xóa thất bại');
}
      },
    },
  ]);
};
  // Fetch bài viết theo filter và userId
  const fetchPosts = async (filter, uid) => {
    setLoading(true);
    try {
      const params = {};

      if (filter === 'Chờ duyệt' || filter === 'Đã duyệt') {
        params.trang_thai = filter.toLowerCase();
        if (uid) params.user = uid;
      } else if (filter === 'Gia đình') {
        params.loai = 'gia đình';
        if (uid) params.user = uid;
      } else if (filter === 'Cộng đồng') {
        params.loai = 'cộng đồng';
      } // 'Tất cả' thì không filter gì

      const data = await getPosts(params);
      setPosts(data || []);
    } catch (err) {
      console.error('Lỗi lấy bài viết:', err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPosts(selectedFilter, userId);
    }
  }, [selectedFilter, userId]);

  useEffect(() => {
    if (isFocused && userId) {
      fetchPosts(selectedFilter, userId);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài Viết</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContentContainer}
      >
        {filters.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              selectedFilter === item && styles.filterButtonSelected,
            ]}
            onPress={() => setSelectedFilter(item)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === item && styles.filterTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : posts.length === 0 ? (
        <Text style={styles.emptyText}>Không có bài viết nào phù hợp.</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {posts.map((post) => (
            <TouchableOpacity
  key={post._id}
  style={styles.postItem}
  
  onPress={() => {
    if (post.user?._id === userId) {
      confirmDelete(post._id);
    } else {
      Alert.alert('Không thể xóa', 'Bạn chỉ có thể xóa bài viết của mình.');
    }
  }}
>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.postCategory}>Loại: {post.loai}</Text>
                <Text style={styles.postTime}>Trạng thái: {post.trang_thai}</Text>
                <Text numberOfLines={2} style={{ marginBottom: 4 }}>
                  Nội dung: {post.noi_dung}
                </Text>
                <Text style={styles.postTime}>
                  {new Date(post.createdAt || post.thoi_gian_tao).toLocaleString()}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </TouchableOpacity>
          ))}
          
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPost')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },

  filterContainer: {
    maxHeight: 50,
    marginBottom: 10,
  },
  filterContentContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EEE',
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  filterText: { fontSize: 14 },
  filterTextSelected: { color: '#fff', fontWeight: 'bold' },

  listContainer: { flex: 1 },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  postCategory: { fontWeight: 'bold', fontSize: 16 },
  postTime: { fontSize: 12, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    padding: 12,
    elevation: 3,
  },
});
