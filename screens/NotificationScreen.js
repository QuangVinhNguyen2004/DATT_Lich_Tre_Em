import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { getNotificationsByChild } from '../services/notificationApi';

const NotificationScreen = () => {
  const route = useRoute();
  const childId = 
'686e8e4a3439d61115567b6a';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) {
      setLoading(false);
      return;
    }
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsByChild(childId);
        console.log('Notifications fetched:', data);
        setNotifications(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
      } finally {
        setLoading(false);
      }
    };

    const intervalId = setInterval(fetchNotifications, 30000); 

  return () => clearInterval(intervalId); 
  }, [childId]);

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>Không có thông báo nào.</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {notifications.map((item) => (
            <View key={item._id} style={styles.notificationItem}>
              <View style={styles.iconWrapper}>
                <Ionicons name="notifications-outline" size={24} color="#000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.time}>{formatTime(item.thoi_gian)}</Text>
                <Text style={styles.message}>{item.noi_dung}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  listContainer: { flex: 1 },
  notificationItem: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: { marginRight: 12, marginTop: 4 },
  time: { fontWeight: '600', marginBottom: 4, color: '#000' },
  message: { color: '#333', fontSize: 14 },
  noNotificationsText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
});
