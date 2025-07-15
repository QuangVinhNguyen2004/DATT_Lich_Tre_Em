import * as Notifications from 'expo-notifications';
import api from './api';
// Yêu cầu quyền thông báo (nên gọi một lần lúc app khởi động)
export const requestNotificationPermission = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: askStatus } = await Notifications.requestPermissionsAsync();
    if (askStatus !== 'granted') {
      throw new Error('Không được phép gửi thông báo');
    }
  }
};

// Huỷ tất cả lịch thông báo đã lên lịch (nếu muốn)
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Lên lịch thông báo cho 1 lịch trình
export const scheduleNotificationForSchedule = async (schedule) => {
  const date = new Date(schedule.startTime);
  if (date <= new Date()) {
    // Không lên lịch cho thời gian đã qua
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Thông báo lịch trình",
      body: `Đến giờ: ${schedule.activity}`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      sticky: false,
    },
    trigger: {
      date,
      repeats: schedule.repeat === 'Có',
    },
  });

  console.log(`Đã lên lịch thông báo cho ${schedule.activity} vào ${date.toLocaleString()}`);
};

// Lên lịch tất cả thông báo dựa trên danh sách lịch trình
export const scheduleAllNotifications = async (schedules) => {
  await cancelAllNotifications();

  for (const schedule of schedules) {
    await scheduleNotificationForSchedule(schedule);
  }
};

export const getNotificationsByChild = async (childId) => {
  const res = await api.get(`/notifications/by-child/${childId}`);
  return res.data;
};