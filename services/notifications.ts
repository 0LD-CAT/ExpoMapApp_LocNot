import * as Notifications from 'expo-notifications';
import { CustomMarker } from '../types';
import { calculateDistance } from './location';

interface ActiveNotification {
  markerId: number;
  notificationId: string;
  timestamp: number;
}

class NotificationManager {
  private activeNotifications: Map<number, ActiveNotification>;

  constructor() {
    this.activeNotifications = new Map();
    this.setupNotifications();
  }
  // Настройка системы уведомлений и запрос разрешений
  public async setupNotifications() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Разрешение на уведомления не предоставлено.');
      return;
    }

    // Настройка обработчика уведомлений
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
  // Показ уведомления о приближении к маркеру
  async showNotification(marker: CustomMarker): Promise<void> {
    if (this.activeNotifications.has(marker.id!)) {
      return; // Предотвращаем дубликаты
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Вы рядом с меткой!",
        body: `Вы находитесь рядом с сохранённой точкой: ${marker.title}`,
      },
      trigger: null // Уведомление отправляется сразу
    });

    this.activeNotifications.set(marker.id!, {
      markerId: marker.id!,
      notificationId,
      timestamp: Date.now()
    });

    setTimeout(async () => {
    await this.removeNotification(marker.id!);
    }, 30000); // 30 секунд

  }
  // Удаление уведомления для маркера
  async removeNotification(markerId: number): Promise<void> {
    const notification = this.activeNotifications.get(markerId);
    if (notification) {
      await Notifications.dismissNotificationAsync(notification.notificationId);
      this.activeNotifications.delete(markerId);
    }
  }
  // Проверка близости к маркерам
  async checkProximity(userLocation: { latitude: number; longitude: number }, markers: CustomMarker[]): Promise<void> {
    const proximityThreshold = 100; // Расстояние в метрах

    for (const marker of markers) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        marker.coordinate.latitude,
        marker.coordinate.longitude
      );

      if (distance <= proximityThreshold) {
        await this.showNotification(marker);
      } else {
        await this.removeNotification(marker.id!);
      }
    }
  }
}

export const notificationManager = new NotificationManager();
