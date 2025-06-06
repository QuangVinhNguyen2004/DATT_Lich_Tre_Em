import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const filters = ['Chờ duyệt', 'Đã duyệt', 'Gia đình', 'Cộng đồng'];

const posts = [
  { id: '1', category: 'Cộng đồng', time: '8:23 AM 19/05/2025' },
  { id: '2', category: 'Cộng đồng', time: '4:20 PM 20/05/2025' },
  { id: '3', category: 'Cộng đồng', time: '11:30 AM 22/05/2025' },
];

const PostScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('Chờ duyệt');
const [modalVisible, setModalVisible] = useState(false);
const [category, setCategory] = useState('Cộng đồng');
const [content, setContent] = useState('');
const [status, setStatus] = useState('Chưa duyệt');
const [createdTime, setCreatedTime] = useState('7:00 AM 22/05/2025');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post</Text>

      <View style={styles.filterContainer}>
        {filters.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              selectedFilter === item && styles.filterButtonSelected,
            ]}
            onPress={() => setSelectedFilter(item)}
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
      </View>

      <ScrollView style={styles.listContainer}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postItem}>
            <Ionicons name="document-text-outline" size={24} color="black" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }} >
              <Text style={styles.postCategory}>{post.category}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="black" onPress={() => navigation.navigate('Postdetail')}/>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Thêm bài viết</Text>

      {/* Loại bài */}
      <Text style={styles.modalLabel}>Loại:</Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text>{category}</Text>
        {/* Có thể thêm dropdown sau nếu muốn */}
      </TouchableOpacity>

      {/* Nội dung */}
      <TextInput
        style={styles.input}
        placeholder="Nội dung"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Trạng thái */}
      <Text style={styles.modalLabel}>Trạng thái</Text>
      <TextInput
        style={styles.input}
        value={status}
        editable={false}
      />

      {/* Thời gian tạo */}
      <Text style={styles.modalLabel}>Thời gian tạo</Text>
      <TextInput
        style={styles.input}
        value={createdTime}
        editable={false}
      />

      {/* Nút */}
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonModal}
          onPress={() => {
            // Gọi API thêm bài viết nếu cần
            setModalVisible(false);
          }}
        >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    
    marginBottom: 16,
    gap: 5,
  },
  filterButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#000',
  },
  filterTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  postCategory: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 15,
  },
  postTime: {
    fontSize: 13,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#6EC17A',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.4)',
},
modalContainer: {
  width: '90%',
  backgroundColor: '#ffe5e5',
  borderRadius: 24,
  padding: 20,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 16,
},
modalLabel: {
  fontSize: 16,
  fontWeight: '500',
  marginTop: 8,
  marginBottom: 4,
},
input: {
  backgroundColor: '#f2f2f2',
  padding: 12,
  borderRadius: 12,
  fontSize: 16,
  marginBottom: 8,
},
dropdown: {
  backgroundColor: '#f2f2f2',
  padding: 12,
  borderRadius: 12,
  justifyContent: 'center',
  marginBottom: 8,
},
modalButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 16,
},
cancelButton: {
  backgroundColor: '#ff7a7a',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 24,
  borderWidth: 1,
  borderColor: '#000',
},
addButtonModal: {
  backgroundColor: '#66ff66',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 24,
  borderWidth: 1,
  borderColor: '#000',
},
buttonText: {
  fontWeight: 'bold',
  fontSize: 16,
  color: '#000',
},

});
