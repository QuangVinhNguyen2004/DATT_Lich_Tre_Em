import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  {
    time: '7:00 AM',
    message: 'Này child! Đã đến giờ cho bé ăn.',
    isNew: true,
  },
  {
    time: '8:31 AM',
    message: 'Child vừa thêm lịch tắm cho bé.',
    isNew: false,
  },
  {
    time: '9:01 AM',
    message: 'Child vừa tạo nhật kí tắm cho bé.',
    isNew: false,
  },
];

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>

      <ScrollView style={styles.listContainer}>
        {notifications.map((item, index) => (
          <View key={index} style={styles.notificationItem}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#000"
              />
              {item.isNew && <View style={styles.redDot} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;

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
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    marginRight: 12,
    position: 'relative',
    marginTop: 4,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    position: 'absolute',
    top: -2,
    right: -2,
  },
  time: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  message: {
    color: '#333',
    fontSize: 14,
  },
});
