import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { getAllDiaries } from '../services/DiaryApi'; 
import moment from 'moment';

const DiaryScreen = () => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const data = await getAllDiaries();
      setDiaries(data);
    } catch (error) {
      console.error('Lỗi khi lấy nhật ký:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhật ký</Text>

      {/* Bộ lọc (tạm thời chưa hoạt động) */}
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
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={{ marginTop: 16 }}>
          {diaries.map((item, index) => (
            <View key={index} style={styles.diaryCard}>
              <View style={styles.row}>
                <Image
                  source={require('../assets/img/cuoihaha.png')}
                  style={styles.avatar}
                />
                <View style={styles.content}>
                  <Text style={styles.noteTitle}>
                    Bé: {item.child?.ten || 'Không rõ'}
                  </Text>
                  <Text style={styles.noteDate}>
                    TG: {moment(item.thoi_gian_tao).format('DD/MM/YYYY HH:mm')}
                  </Text>
                  <Text style={styles.noteContent}>ND: {item.noi_dung}</Text>
                  <Text style={styles.noteUser}>
                    Người ghi: {item.user?.ten || 'Không rõ'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Nút thêm */}
      <TouchableOpacity style={styles.addButton}>
        <Image source={require('../assets/img/them1.png')} style={styles.addIcon} />
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
    marginTop: 50,
    marginBottom: 50,
    alignSelf: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
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
  noteUser: {
    marginTop: 4,
    color: 'gray',
    fontSize: 12,
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
