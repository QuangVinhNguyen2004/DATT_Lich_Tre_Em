import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity,Modal,
  Pressable, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const HomeScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [activity, setActivity] = useState('Cho ăn');
  const [desc, setDesc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [repeat, setRepeat] = useState('Có');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/img/logotreem.png')} style={styles.logo} />
        <TouchableOpacity style={styles.childButton}>
          <Text style={styles.childText}>child ▼</Text>
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

      {/* Hoạt động */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hoạt động</Text>
        <Text style={styles.viewAll}>Xem tất cả</Text>
      </View>

      <View style={styles.activities}>
        {['Cho ăn', 'Ngủ', 'Tắm', 'Thay tã'].map((title, index) => (
          <View key={index} style={styles.activityItem}>
            <Image source={require('../assets/img/trean.png')} style={styles.activityImage} />
            <Text style={styles.activityText}>{title}</Text>
          </View>
        ))}
      </View>

      {/* Gần đây */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gần đây</Text>
        <Text style={styles.viewAll}>Xem tất cả</Text>
      </View>

      {/* Recent activity card */}
      <View style={styles.recentCard}>
        <Image source={require('../assets/img/trean1.png')} style={styles.recentImage} />
        <View style={styles.recentContent}>
          <Text>Hoạt động: <Text style={styles.bold}>Cho ăn</Text></Text>
          <Text>Mô tả: ăn dặm</Text>
          <Text>TG bắt đầu: 7:00</Text>
          <Text>TG thực hiện: 30p</Text>
          <Text>Lặp lại: có</Text>

          <View style={styles.recentButtons}>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => setConfirmDeleteVisible(true)}>
              <Text style={styles.btnText}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateBtn} onPress={() => setEditModalVisible(true)}>
              <Text style={styles.btnText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Nút thêm */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Modal Thêm hoạt động */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm hoạt động</Text>

            <Text style={styles.label}>Hoạt động:</Text>
            <TouchableOpacity style={styles.selectBox}>
              <Text>{activity} ▼</Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Nhập mô tả"
              style={styles.modalInput}
              value={desc}
              onChangeText={setDesc}
            />
            <TextInput
              placeholder="Nhập tg bắt đầu"
              style={styles.modalInput}
              value={startTime}
              onChangeText={setStartTime}
            />
            <TextInput
              placeholder="Nhập tg thực hiện"
              style={styles.modalInput}
              value={duration}
              onChangeText={setDuration}
            />

            <Text style={styles.label}>Lặp lại:</Text>
            <TouchableOpacity style={styles.selectBox}>
              <Text>{repeat} ▼</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => {
                  // TODO: xử lý thêm hoạt động ở đây
                  setModalVisible(false);
                }}
              >
                <Text style={styles.btnText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    {/*Modal cập nhật */}
<Modal animationType="slide" transparent={true} visible={editModalVisible}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Cập nhật hoạt động</Text>

      <Text style={styles.label}>Hoạt động:</Text>
      <TouchableOpacity style={styles.selectBox}>
        <Text>{activity} ▼</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Nhập mô tả"
        style={styles.modalInput}
        value={desc}
        onChangeText={setDesc}
      />
      <TextInput
        placeholder="Nhập tg bắt đầu"
        style={styles.modalInput}
        value={startTime}
        onChangeText={setStartTime}
      />
      <TextInput
        placeholder="Nhập tg thực hiện"
        style={styles.modalInput}
        value={duration}
        onChangeText={setDuration}
      />

      <Text style={styles.label}>Lặp lại:</Text>
      <TouchableOpacity style={styles.selectBox}>
        <Text>{repeat} ▼</Text>
      </TouchableOpacity>

      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
          <Text style={styles.btnText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            // TODO: xử lý cập nhật hoạt động tại đây
            setEditModalVisible(false);
          }}
        >
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* Modal xác nhận xóa */}
<Modal animationType="fade" transparent={true} visible={confirmDeleteVisible}>
  <View style={styles.modalOverlay}>
    <View style={styles.confirmBox}>
      <Text style={styles.modalTitle}>Xác nhận</Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        Bạn có chắc muốn xóa hoạt động này không?
      </Text>
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setConfirmDeleteVisible(false)}
        >
          <Text style={styles.btnText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            // TODO: xử lý xóa hoạt động tại đây
            setConfirmDeleteVisible(false);
          }}
        >
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
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  childButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 10,
  },
  childText: {
    fontSize: 14,
    color: '#333',
  },
  bagButton: {
    marginLeft: 'auto',
    backgroundColor: '#007bff',
    borderRadius: 30,
    padding: 8,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#333',
  },
  activities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activityItem: {
    alignItems: 'center',
    width: 60,
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  activityText: {
    marginTop: 4,
    fontSize: 12,
  },
  recentCard: {
    flexDirection: 'row',
    backgroundColor: '#d9cfcf',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  recentImage: {
    width: 120,
    height: 120,
  },
  recentContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: 'bold',
  },
  recentButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  deleteBtn: {
    backgroundColor: '#f66',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  updateBtn: {
    backgroundColor: '#6f6',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  btnText: {
    color: '#000',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#6f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FADADA',
    borderRadius: 24,
    padding: 20,
    width: '90%',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  selectBox: {
    backgroundColor: '#f1f1f1',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: '#f66',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  addBtn: {
    backgroundColor: '#6f6',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
confirmBox: {
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 24,
  width: '85%',
  elevation: 10,
  alignItems: 'center',
},

});
