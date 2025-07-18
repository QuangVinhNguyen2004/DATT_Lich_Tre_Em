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
      <Text style={styles.title}>{post.tieu_de}</Text>
      <Text style={styles.category}>Loại: {post.loai || 'Không xác định'}</Text>
      <Text style={styles.status}>Trạng thái: {post.trang_thai || 'Không rõ'}</Text>

      <Text style={styles.content}>Nội dung:{post.noi_dung}</Text>

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
          contentContainerStyle={{ paddingHorizontal: 8 }}
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
    </ScrollView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  video: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: '#000',
  },
  imageScroll: {
    marginBottom: 32,
  },
  image: {
    width: screenWidth * 0.7,
    height: 220,
    borderRadius: 12,
    marginRight: 12,
  },
});
