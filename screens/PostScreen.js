import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const filters = ['Chờ duyệt', 'Đã duyệt', 'Gia đình', 'Cộng đồng'];

const posts = [
  { id: '1', category: 'Cộng đồng', time: '8:23 AM 19/05/2025' },
  { id: '2', category: 'Cộng đồng', time: '4:20 PM 20/05/2025' },
  { id: '3', category: 'Cộng đồng', time: '11:30 AM 22/05/2025' },
];

const PostScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('Chờ duyệt');

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
            <View style={{ flex: 1 }}>
              <Text style={styles.postCategory}>{post.category}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="black" />
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
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
});
