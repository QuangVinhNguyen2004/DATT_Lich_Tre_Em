import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const DiaryScreen = () => {
  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Nhật ký</Text>

      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterBtn, styles.activeBtn]}>
          <Text style={styles.activeBtnText}>Mới nhất</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.inactiveBtnText}>7 ngày trước</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.inactiveBtnText}>14 ngày trước</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách nhật ký */}
      <ScrollView style={{ marginTop: 16 }}>
        {[1, 2].map((item, index) => (
          <View key={index} style={styles.diaryCard}>
            <View style={styles.row}>
              <Image
                source={require('../assets/img/cuoihaha.png')} 
                style={styles.avatar}
              />
              <View style={styles.content}>
                <Text style={styles.noteTitle}>Ghi chú: Cho bé ngủ</Text>
                <Text style={styles.noteDate}>TG: 22/05/2025</Text>
                <Text style={styles.noteContent}>
                  ND: Cho bé ngủ được 3 tiếng, quấy khóc nhẹ, Bé ngủ ngoan không bị tỉnh...
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Nút thêm */}
      <TouchableOpacity style={styles.addButton}>
        <Image
          source={require('../assets/img/them1.png')} 
          style={styles.addIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default DiaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginTop:50,
    marginBottom:50,
   alignSelf:'center'
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  activeBtn: {
    backgroundColor: '#007BFF',
  },
  activeBtnText: {
    color: '#fff',
    fontWeight: '500',
  },
  inactiveBtnText: {
    color: '#333',
  },
  diaryCard: {
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
  content: {
    flex: 1,
  },
  noteTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  noteDate: {
    color: 'red',
    fontWeight: '600',
    marginBottom: 4,
  },
  noteContent: {
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  addIcon: {
    width: 36,
    height: 36,
  },
});
