import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PostDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { post } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết bài viết</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Mã bài :</Text>
        <Text style={styles.content}>{post._id}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Loại bài:</Text>
        <Text style={styles.content}>{post.loai}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Nội dung:</Text>
        <Text style={styles.content}>{post.noi_dung}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Trạng thái:</Text>
        <Text style={styles.content}>{post.trang_thai}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Thời gian tạo:</Text>
        <Text style={styles.content}>
          {new Date(post.createdAt).toLocaleString('vi-VN')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Trở lại</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            // TODO: thêm chức năng xóa nếu cần
          }}
        >
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  box: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 32,
  },
  backButton: {
    backgroundColor: '#ff7070',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#000',
  },
  deleteButton: {
    backgroundColor: '#66ff66',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});
