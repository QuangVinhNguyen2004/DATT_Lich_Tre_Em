import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';

const screenWidth = Dimensions.get('window').width;

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://192.168.52.104:3000/api/post/${postId}`);
        if (!res.ok) throw new Error('Lỗi tải bài viết');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Không tìm thấy bài viết</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Video nếu có */}
      {post.video ? (
        <Video
          source={{ uri: `http://192.168.52.104:3000${post.video}` }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
          shouldPlay={false}
        />
      ) : null}

      {/* Hiển thị ảnh nếu có */}
      {post.anh && post.anh.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {post.anh.map((imgUrl, index) => (
            <Image
              key={index}
              source={{ uri: `http://192.168.52.104:3000${imgUrl}` }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      <Text style={styles.title}>{post.tieu_de}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.category}>Loại: {post.loai || 'Không xác định'}</Text>
        <Text style={styles.status}>Trạng thái: {post.trang_thai || 'Không rõ'}</Text>
      </View>

      <Text style={styles.content}>{post.noi_dung}</Text>
    </ScrollView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  category: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  status: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    marginBottom: 32,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 24,
    backgroundColor: '#000',
  },
  imageScroll: {
    marginBottom: 24,
  },
  image: {
    width: screenWidth * 0.6,
    height: 160,
    borderRadius: 14,
    marginRight: 16,
  },
});
