import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, Image, ScrollView,
  TouchableOpacity, Modal, FlatList, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getChildrenByUser } from '../services/childApi';
import { getSchedulesByChild, addSchedule, updateSchedule, deleteSchedule } from '../services/ScheduleApi';

const HomeScreen = () => {
  const navigation = useNavigation();

  // Dữ liệu trẻ
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  // Lịch trình
  const [schedules, setSchedules] = useState([]);

  // Modal & form
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  // Form inputs
  const [activity, setActivity] = useState('');
  const [desc, setDesc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [repeat, setRepeat] = useState('Không');
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  // Loading
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  // Load danh sách trẻ và mặc định chọn trẻ đầu tiên
  const loadChildren = async () => {
    try {
      setLoadingChildren(true);
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      if (!user?._id) {
        setChildren([]);
        setSelectedChild(null);
        return;
      }
      const data = await getChildrenByUser(user._id);
      setChildren(data);
      if (data.length > 0) {
        setSelectedChild(data[0]);
      } else {
        setSelectedChild(null);
        setSchedules([]);
      }
    } catch (error) {
      console.error('Lỗi load children:', error);
    } finally {
      setLoadingChildren(false);
    }
  };

  // Load lịch trình theo child
  const loadSchedules = async (childId) => {
    if (!childId) {
      setSchedules([]);
      return;
    }
    try {
      setLoadingSchedules(true);
      const data = await getSchedulesByChild(childId);
      setSchedules(data);
    } catch (error) {
      console.error('Lỗi load schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Khi màn hình focus lại thì reload dữ liệu
  useFocusEffect(
    useCallback(() => {
      loadChildren();
    }, [])
  );

  // Khi chọn trẻ khác
  useEffect(() => {
    if (selectedChild?._id) {
      loadSchedules(selectedChild._id);
    } else {
      setSchedules([]);
    }
  }, [selectedChild]);

  // Reset form modal
  const resetForm = () => {
    setActivity('');
    setDesc('');
    setStartTime('');
    setDuration('');
    setRepeat('Không');
    setEditingScheduleId(null);
  };

  // Thêm lịch
  const handleAdd = async () => {
    if (!activity || !startTime) {
      alert('Vui lòng nhập hoạt động và thời gian bắt đầu');
      return;
    }
    try {
      await addSchedule(selectedChild._id, {
        activity,
        description: desc,
        startTime: new Date(startTime).toISOString(),
        duration: Number(duration) || 0,
        repeat,
      });
      await loadSchedules(selectedChild._id);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Lỗi thêm lịch:', error);
      alert('Không thể thêm lịch. Vui lòng thử lại.');
    }
  };

  // Sửa lịch
  const handleEdit = async () => {
    if (!activity || !startTime) {
      alert('Vui lòng nhập hoạt động và thời gian bắt đầu');
      return;
    }
    try {
      await updateSchedule(editingScheduleId, {
        activity,
        description: desc,
        startTime: new Date(startTime).toISOString(),
        duration: Number(duration) || 0,
        repeat,
      });
      await loadSchedules(selectedChild._id);
      setEditModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Lỗi sửa lịch:', error);
      alert('Không thể cập nhật lịch. Vui lòng thử lại.');
    }
  };

  // Xóa lịch
  const handleDelete = async () => {
    try {
      await deleteSchedule(editingScheduleId);
      await loadSchedules(selectedChild._id);
      setConfirmDeleteVisible(false);
      resetForm();
    } catch (error) {
      console.error('Lỗi xóa lịch:', error);
      alert('Không thể xóa lịch. Vui lòng thử lại.');
    }
  };

  // Khi nhấn chọn trẻ từ dropdown
  const handleSelectChild = (child) => {
    setSelectedChild(child);
  };

  // Render item picker trẻ (ảnh + tên)
  const renderChildItem = ({ item }) => (
    <TouchableOpacity
      style={styles.childItem}
      onPress={() => {
        handleSelectChild(item);
      }}
    >
      <Image
        source={item.img ? { uri: item.img } : require('../assets/img/logotreem.png')}
        style={styles.childImg}
      />
      <Text style={styles.childName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header với spinner chọn trẻ */}
      <View style={styles.header}>
        <Image source={require('../assets/img/logotreem.png')} style={styles.logo} />
        <View style={styles.childSelector}>
          {loadingChildren ? (
            <ActivityIndicator size="small" color="#0D6EFD" />
          ) : children.length === 0 ? (
            <Text>Chưa có hồ sơ trẻ</Text>
          ) : (
            <FlatList
              horizontal
              data={children}
              keyExtractor={(item) => item._id}
              renderItem={renderChildItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
              extraData={selectedChild?._id}
            />
          )}
        </View>
        <TouchableOpacity style={styles.bagButton} onPress={() => navigation.navigate('Diary')}>
          <Ionicons name="document-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Danh sách lịch trình */}
      <Text style={styles.sectionTitle}>Lịch trình của {selectedChild?.name || '...'}</Text>

      {loadingSchedules ? (
        <ActivityIndicator size="large" color="#0D6EFD" />
      ) : schedules.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa có lịch trình</Text>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {schedules.map((item) => (
            <View key={item._id} style={styles.scheduleCard}>
              <Text style={styles.activityText}>{item.activity}</Text>
              <Text>Mô tả: {item.description || 'Không có'}</Text>
              <Text>Bắt đầu: {new Date(item.startTime).toLocaleString()}</Text>
              <Text>Thời lượng: {item.duration} phút</Text>
              <Text>Lặp lại: {item.repeat}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    setEditingScheduleId(item._id);
                    setConfirmDeleteVisible(true);
                  }}
                >
                  <Text style={styles.btnText}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => {
                    setEditingScheduleId(item._id);
                    setActivity(item.activity);
                    setDesc(item.description);
                    setStartTime(new Date(item.startTime).toISOString().slice(0,16)); // yyyy-MM-ddTHH:mm
                    setDuration(item.duration?.toString() || '');
                    setRepeat(item.repeat || 'Không');
                    setEditModalVisible(true);
                  }}
                >
                  <Text style={styles.btnText}>Sửa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Nút thêm lịch */}
      <TouchableOpacity style={styles.fab} onPress={() => {
        resetForm();
        setModalVisible(true);
      }}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Modal thêm */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm lịch trình</Text>

            <TextInput
              placeholder="Hoạt động"
              style={styles.modalInput}
              value={activity}
              onChangeText={setActivity}
            />
            <TextInput
              placeholder="Mô tả"
              style={styles.modalInput}
              value={desc}
              onChangeText={setDesc}
            />
            <TextInput
              placeholder="Thời gian bắt đầu (yyyy-MM-ddThh:mm)"
              style={styles.modalInput}
              value={startTime}
              onChangeText={setStartTime}
            />
            <TextInput
              placeholder="Thời lượng (phút)"
              style={styles.modalInput}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setRepeat(prev => (prev === 'Có' ? 'Không' : 'Có'))}
            >
              <Text>Lặp lại: {repeat}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={styles.btnText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal sửa */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật lịch trình</Text>

            <TextInput
              placeholder="Hoạt động"
              style={styles.modalInput}
              value={activity}
              onChangeText={setActivity}
            />
            <TextInput
              placeholder="Mô tả"
              style={styles.modalInput}
              value={desc}
              onChangeText={setDesc}
            />
            <TextInput
              placeholder="Thời gian bắt đầu (yyyy-MM-ddThh:mm)"
              style={styles.modalInput}
              value={startTime}
              onChangeText={setStartTime}
            />
            <TextInput
              placeholder="Thời lượng (phút)"
              style={styles.modalInput}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setRepeat(prev => (prev === 'Có' ? 'Không' : 'Có'))}
            >
              <Text>Lặp lại: {repeat}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleEdit}>
                <Text style={styles.btnText}>Sửa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal visible={confirmDeleteVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.modalTitle}>Xác nhận xóa lịch trình?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setConfirmDeleteVisible(false)}>
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleDelete}>
                <Text style={styles.btnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  childSelector: {
    flex: 1,
    marginHorizontal: 12,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1E7DD',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  childImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  childName: {
    fontWeight: 'bold',
    color: '#0F5132',
  },
  bagButton: {
    backgroundColor: '#0D6EFD',
    padding: 10,
    borderRadius: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scheduleCard: {
    backgroundColor: '#FFF',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  activityText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  deleteBtn: {
    backgroundColor: '#DC3545',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  editBtn: {
    backgroundColor: '#FFC107',
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#198754',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: '#6C757D',
    padding: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#198754',
    padding: 10,
    borderRadius: 6,
  },
  confirmBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
});
