import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getNotificationsByChild } from '../services/notificationApi';
import { useChild } from '../context/ChildContext';
const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedChild } = useChild();
  
  const childId =selectedChild._id; 

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          const data = await getNotificationsByChild(childId);
          console.log('id child:', childId);
          console.log('data:', data);
          setNotifications(data.notifications || []);
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể tải thông báo. Vui lòng thử lại.');
          console.error('Lỗi lấy thông báo:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }, [childId])
  );

  const renderItem = ({ item }) => {
    const timeString = new Date(item.thoi_gian).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });

    return (
      <View style={styles.card}>
        <Text style={styles.content}>{item.noi_dung}</Text>
        <Text style={styles.time}>{timeString}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Thông báo</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#198754" />
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.message}>Không có thông báo nào.</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  time: {
    fontSize: 13,
    color: '#777',
    textAlign: 'right',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
