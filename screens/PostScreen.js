import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getPosts, addPost } from '../services/PostApi';

const filters = ['Chờ duyệt', 'Đã duyệt', 'Gia đình', 'Cộng đồng'];

const PostScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('Chờ duyệt');
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('Cộng đồng');
  const [content, setContent] = useState('');
  const [status] = useState('Chờ duyệt');
  const [createdTime] = useState(new Date().toLocaleString());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Lỗi lấy bài viết:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    try {
      const newPost = {
        user_id: '6852ca0f53c359e900cd2dc1', // TODO: thay bằng ID thực tế nếu cần
        noi_dung: content,
        loai: category.toLowerCase(),
        trang_thai: 'chờ duyệt'
      };
      await addPost(newPost);
      setContent('');
      setModalVisible(false);
      fetchPosts();
    } catch (err) {
      console.error('Lỗi thêm bài viết:', err.message);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.trang_thai.toLowerCase().includes(selectedFilter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài Viết</Text>

      <View style={styles.filterContainer}>
        {filters.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterButton, selectedFilter === item && styles.filterButtonSelected]}
            onPress={() => setSelectedFilter(item)}
          >
            <Text style={[styles.filterText, selectedFilter === item && styles.filterTextSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          filteredPosts.map((post) => (
            <View key={post._id} style={styles.postItem}>
              <Ionicons name="document-text-outline" size={24} color="black" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.postCategory}>{post.loai}</Text>
                <Text style={styles.postTime}>
                  {new Date(post.createdAt).toLocaleString()}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="black"
                onPress={() => navigation.navigate('Postdetail', { post })}
              />
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal thêm bài viết */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Thêm bài viết</Text>

            <Text style={styles.modalLabel}>Loại</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text>{category}</Text>
              {/* Có thể mở rộng thành dropdown real */}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Nội dung"
              value={content}
              onChangeText={setContent}
              multiline
            />

            <Text style={styles.modalLabel}>Trạng thái</Text>
            <TextInput style={styles.input} value={status} editable={false} />

            <Text style={styles.modalLabel}>Thời gian tạo</Text>
            <TextInput style={styles.input} value={createdTime} editable={false} />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButtonModal} onPress={handleAddPost}>
                <Text style={styles.buttonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PostScreen;
