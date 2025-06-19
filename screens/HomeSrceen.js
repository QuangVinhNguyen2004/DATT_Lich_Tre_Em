import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput, Image, ScrollView,
  TouchableOpacity, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getSchedulesByChild, addSchedule, updateSchedule, deleteSchedule } from '../services/ScheduleApi';


const HomeScreen = () => {
  const navigation = useNavigation();
  // const [children, setChildren] = useState([]);
  // const [selectedChild, setSelectedChild] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const [activity, setActivity] = useState('');
  const [desc, setDesc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [repeat, setRepeat] = useState('Không');
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  // const fetchChildren = async (userId, token) => {
  //   const data = await getChildrenByUser(userId, token);
  //   setChildren(data);
  //   if (data.length > 0 && !selectedChild) {
  //     setSelectedChild(data[0]);
  //   }
  // };

  const fetchSchedules = async (childId, token) => {
    const data = await getSchedulesByChild(childId, token);
    setSchedules(data);
  };

  useEffect(() => {
    const init = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      if (user && token) {
        await fetchChildren(user._id, token);
      }
    };
    init();
  }, []);

  // useEffect(() => {
  //   if (selectedChild) {
  //     AsyncStorage.getItem('token').then(token => {
  //       fetchSchedules(selectedChild._id, token);
  //     });
  //   }
  // }, [selectedChild]);

  const resetForm = () => {
    setActivity('');
    setDesc('');
    setStartTime('');
    setDuration('');
    setRepeat('Không');
    setEditingScheduleId(null);
  };

  const handleAdd = async () => {
    const token = await AsyncStorage.getItem('token');
    await addSchedule(selectedChild._id, { activity, description: desc, startTime, duration, repeat }, token);
    await fetchSchedules(selectedChild._id, token);
    setModalVisible(false);
    resetForm();
  };

  const handleEdit = async () => {
    const token = await AsyncStorage.getItem('token');
    await updateSchedule(editingScheduleId, { activity, description: desc, startTime, duration, repeat }, token);
    await fetchSchedules(selectedChild._id, token);
    setEditModalVisible(false);
    resetForm();
  };

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem('token');
    await deleteSchedule(editingScheduleId, token);
    await fetchSchedules(selectedChild._id, token);
    setConfirmDeleteVisible(false);
    resetForm();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/img/logotreem.png')} style={styles.logo} />
        <TouchableOpacity
          style={styles.childButton}
          onPress={() => {
            const curr = children.findIndex(c => c._id === selectedChild._id);
            const next = (curr + 1) % children.length;
            setSelectedChild(children[next]);
          }}
        >
          <Text style={styles.childText}>Chọn trẻ ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bagButton} onPress={() => navigation.navigate('Diary')}>
          <Ionicons name="document-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput placeholder="Tìm kiếm" style={{ flex: 1 }} />
      </View>

      {/* Recent */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
        <Text style={styles.viewAll}>Xem tất cả</Text>
      </View>

      <ScrollView>
        {schedules.map(item => (
          <View key={item._id} style={styles.recentCard}>
            <Image source={require('../assets/img/trean1.png')} style={styles.recentImage} />
            <View style={styles.recentContent}>
              <Text>Hoạt động: <Text style={styles.bold}>{item.activity}</Text></Text>
              <Text>Mô tả: {item.description}</Text>
              <Text>Bắt đầu: {item.startTime}</Text>
              <Text>Thực hiện: {item.duration}</Text>
              <Text>Lặp lại: {item.repeat ? 'Có' : 'Không'}</Text>
              <View style={styles.recentButtons}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => { setEditingScheduleId(item._id); setConfirmDeleteVisible(true); }}
                >
                  <Text style={styles.btnText}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={() => {
                    setEditingScheduleId(item._id);
                    setActivity(item.activity);
                    setDesc(item.description);
                    setStartTime(item.startTime);
                    setDuration(item.duration);
                    setRepeat(item.repeat ? 'Có' : 'Không');
                    setEditModalVisible(true);
                  }}
                >
                  <Text style={styles.btnText}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm hoạt động</Text>
            {/* Inputs */}
            <TextInput placeholder="Hoạt động" style={styles.modalInput} value={activity} onChangeText={setActivity} />
            <TextInput placeholder="Mô tả" style={styles.modalInput} value={desc} onChangeText={setDesc} />
            <TextInput placeholder="Thời gian bắt đầu" style={styles.modalInput} value={startTime} onChangeText={setStartTime} />
            <TextInput placeholder="Thời gian (phút)" style={styles.modalInput} value={duration} onChangeText={setDuration} />
            <TouchableOpacity style={styles.selectBox} onPress={() => setRepeat(prev => prev === 'Có' ? 'Không' : 'Có')}>
              <Text>Lặp lại: {repeat}</Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Hủy</Text></TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}><Text style={styles.btnText}>Thêm</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật hoạt động</Text>
            {/* Inputs */}
            <TextInput placeholder="Hoạt động" style={styles.modalInput} value={activity} onChangeText={setActivity} />
            <TextInput placeholder="Mô tả" style={styles.modalInput} value={desc} onChangeText={setDesc} />
            <TextInput placeholder="Thời gian bắt đầu" style={styles.modalInput} value={startTime} onChangeText={setStartTime} />
            <TextInput placeholder="Thời gian (phút)" style={styles.modalInput} value={duration} onChangeText={setDuration} />
            <TouchableOpacity style={styles.selectBox} onPress={() => setRepeat(prev => prev === 'Có' ? 'Không' : 'Có')}>
              <Text>Lặp lại: {repeat}</Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}><Text style={styles.btnText}>Hủy</Text></TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleEdit}><Text style={styles.btnText}>Sửa</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal visible={confirmDeleteVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.modalTitle}>Xác nhận xóa?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setConfirmDeleteVisible(false)}><Text style={styles.btnText}>Hủy</Text></TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={handleDelete}><Text style={styles.btnText}>Xóa</Text></TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  childButton: {
    flex: 1,
    marginHorizontal: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#D1E7DD',
    alignItems: 'center',
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#0D6EFD',
    fontSize: 14,
  },
  recentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  recentImage: {
    width: 80,
    height: 80,
  },
  recentContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: 'bold',
  },
  recentButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  deleteBtn: {
    backgroundColor: '#DC3545',
    padding: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  updateBtn: {
    backgroundColor: '#FFC107',
    padding: 6,
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
