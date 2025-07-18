import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import { getChildrenByUser } from '../services/childApi';
import {
  getSchedulesByChild,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} from '../services/ScheduleApi';
import {
  requestNotificationPermission,
  scheduleAllNotifications,
} from '../services/notificationApi';

import { useChild } from '../context/ChildContext'; // Sử dụng context quản lý selectedChild

const HomeScreen = () => {
  const navigation = useNavigation();

  const [children, setChildren] = useState([]);
  const { selectedChild, setSelectedChild } = useChild(); // Lấy selectedChild từ context
  const [schedules, setSchedules] = useState([]);

  // Modal và form state
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const [activity, setActivity] = useState('');
  const [desc, setDesc] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [repeat, setRepeat] = useState('Không');
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  // Lấy danh sách trẻ khi màn hình focus
  useFocusEffect(
    useCallback(() => {
      const fetchChildren = async () => {
        try {
          const userData = await AsyncStorage.getItem('user');
          const user = JSON.parse(userData);
          if (!user?._id) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
            return;
          }
          const data = await getChildrenByUser(user._id);
          setChildren(data || []);
          if (data.length > 0) {
            setSelectedChild(data[0]); // cập nhật context
          } else {
            setSelectedChild(null);
            setSchedules([]);
          }
        } catch (error) {
          console.error('Lỗi lấy danh sách trẻ:', error);
        }
      };
      fetchChildren();
    }, [setSelectedChild])
  );

  // Lấy lịch trình khi selectedChild thay đổi
  useEffect(() => {
    if (!selectedChild) {
      setSchedules([]);
      return;
    }
    const fetchSchedules = async () => {
      try {
        const data = await getSchedulesByChild(selectedChild._id);
        setSchedules(data || []);
        await requestNotificationPermission();
        await scheduleAllNotifications(data || []);
      } catch (error) {
        console.error('Lỗi lấy lịch trình:', error);
      }
    };
    fetchSchedules();
  }, [selectedChild]);

  // Reset form
  const resetForm = () => {
    setActivity('');
    setDesc('');
    setStartTime(new Date());
    setDuration('');
    setRepeat('Không');
    setEditingScheduleId(null);
    setShowTimePicker(false);
  };

  // Format giờ (Date => "HH:mm")
  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Thêm lịch trình
  const handleAdd = async () => {
    if (!selectedChild) {
      Alert.alert('Lỗi', 'Vui lòng chọn trẻ trước');
      return;
    }
    if (!activity || !startTime || !duration) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin bắt buộc');
      return;
    }
    try {
      await addSchedule(selectedChild._id, {
        activity,
        description: desc,
        startTime: startTime.toISOString(),
        duration: Number(duration),
        repeat,
      });
      Alert.alert('Thành công', 'Đã thêm lịch trình');
      setModalVisible(false);
      resetForm();

      const data = await getSchedulesByChild(selectedChild._id);
      setSchedules(data || []);
    } catch (error) {
      console.error('Lỗi thêm lịch trình:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể thêm lịch trình, vui lòng thử lại');
    }
  };

  // Mở modal sửa
  const openEditModal = (item) => {
    setEditingScheduleId(item._id);
    setActivity(item.activity);
    setDesc(item.description);
    setStartTime(new Date(item.startTime));
    setDuration(item.duration.toString());
    setRepeat(item.repeat);
    setEditModalVisible(true);
    setShowTimePicker(false);
  };

  // Cập nhật lịch trình
  const handleEdit = async () => {
    if (!editingScheduleId) return;
    if (!activity.trim() || !startTime || !duration.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin bắt buộc');
      return;
    }
    try {
      await updateSchedule(editingScheduleId, {
        activity,
        description: desc,
        startTime: startTime.toISOString(),
        duration: Number(duration),
        repeat,
      });
      Alert.alert('Thành công', 'Đã cập nhật lịch trình');
      setEditModalVisible(false);
      resetForm();
      const data = await getSchedulesByChild(selectedChild._id);
      setSchedules(data || []);
    } catch (error) {
      console.error('Lỗi cập nhật lịch trình:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật lịch trình, vui lòng thử lại');
    }
  };

  // Xác nhận xóa
  const confirmDelete = (id) => {
    setEditingScheduleId(id);
    setConfirmDeleteVisible(true);
  };

  // Xóa lịch trình
  const handleDelete = async () => {
    if (!editingScheduleId) return;
    try {
      await deleteSchedule(editingScheduleId);
      Alert.alert('Thành công', 'Đã xóa lịch trình');
      setConfirmDeleteVisible(false);
      resetForm();
      const data = await getSchedulesByChild(selectedChild._id);
      setSchedules(data || []);
    } catch (error) {
      console.error('Lỗi xóa lịch trình:', error);
      Alert.alert('Lỗi', 'Không thể xóa lịch trình, vui lòng thử lại');
    }
  };

  // Dropdown chọn trẻ
  const ChildDropdown = () => {
    const [showList, setShowList] = useState(false);

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.childButton}
          onPress={() => setShowList(!showList)}
          activeOpacity={0.7}
        >
          {selectedChild ? (
            <>
              <Image
                source={
                  selectedChild.img
                    ? { uri: selectedChild.img }
                    : require('../assets/img/logotreem.png')
                }
                style={styles.childImage}
              />
              <Text style={styles.childText}>{selectedChild.name} ▼</Text>
            </>
          ) : (
            <Text style={styles.childText}>Chưa có hồ sơ trẻ ▼</Text>
          )}
        </TouchableOpacity>
        {showList && (
          <View style={styles.dropdownList}>
            <ScrollView style={{ maxHeight: 200 }}>
              {children.map((child) => (
                <TouchableOpacity
                  key={child._id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedChild(child);
                    setShowList(false);
                  }}
                >
                  <Image
                    source={
                      child.img ? { uri: child.img } : require('../assets/img/logotreem.png')
                    }
                    style={styles.childImageSmall}
                  />
                  <Text style={styles.dropdownItemText}>{child.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/img/logotreem.png')} style={styles.logo} />
        <ChildDropdown />
        <TouchableOpacity style={styles.bagButton} onPress={() => navigation.navigate('Diary')}>
          <Ionicons name="document-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lịch trình của trẻ</Text>
      </View>

      {/* Danh sách lịch trình */}
      <ScrollView style={{ flex: 1 }}>
        {schedules.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
            Không có lịch trình nào cho trẻ này.
          </Text>
        ) : (
          schedules.map((item) => {
            const startDate = new Date(item.startTime);
            return (
              <View key={item._id} style={styles.scheduleCard}>
                <Text style={styles.scheduleActivity}>{item.activity}</Text>
                <Text>Mô tả: {item.description}</Text>
                <Text>Bắt đầu: {formatTime(startDate)}</Text>
                <Text>Thời gian (phút): {item.duration}</Text>
                <Text>Lặp lại: {item.repeat}</Text>

                <View style={styles.scheduleButtons}>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => confirmDelete(item._id)}
                  >
                    <Text style={styles.btnText}>Xóa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.updateBtn} onPress={() => openEditModal(item)}>
                    <Text style={styles.btnText}>Sửa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Nút thêm */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Modal thêm */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm hoạt động</Text>

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

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.timePickerButton}
            >
              <Text>
                Thời gian bắt đầu:{' '}
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(e, date) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (date) setStartTime(date);
                }}
              />
            )}

            <TextInput
              placeholder="Thời gian (phút)"
              style={styles.modalInput}
              value={duration}
              keyboardType="numeric"
              onChangeText={setDuration}
            />

            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setRepeat((prev) => (prev === 'Có' ? 'Không' : 'Có'))}
            >
              <Text>Lặp lại: {repeat}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={styles.btnText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal sửa */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật hoạt động</Text>

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

            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.timePickerButton}
            >
              <Text>
                Thời gian bắt đầu:{' '}
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(e, date) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (date) setStartTime(date);
                }}
              />
            )}

            <TextInput
              placeholder="Thời gian (phút)"
              style={styles.modalInput}
              value={duration}
              keyboardType="numeric"
              onChangeText={setDuration}
            />

            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setRepeat((prev) => (prev === 'Có' ? 'Không' : 'Có'))}
            >
              <Text>Lặp lại: {repeat}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setEditModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleEdit}>
                <Text style={styles.btnText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal visible={confirmDeleteVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.modalTitle}>Xác nhận xóa?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setConfirmDeleteVisible(false)}
              >
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
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  childButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#D1E7DD',
  },
  childImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  childText: {
    fontWeight: 'bold',
    color: '#0F5132',
  },
  bagButton: {
    backgroundColor: '#0D6EFD',
    padding: 10,
    borderRadius: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  scheduleActivity: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  scheduleButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  updateBtn: {
    backgroundColor: '#ffc107',
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  timePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#198754',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#D1E7DD',
    borderRadius: 8,
    zIndex: 100,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  childImageSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#0F5132',
  },
  confirmBox: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 12,
  },
});
