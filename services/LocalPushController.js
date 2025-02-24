import dayjs from "dayjs";
import PushNotification from "react-native-push-notification";

export const localNotification = (title, quote) => {
  PushNotification.localNotification({
    autoCancel: true,
    bigText: title,
    subText: "Thank you for booking this session.",
    title: title,
    message: quote,
    channelId: "Quote",
    vibrate: true,
    vibration: 400,
    playSound: true,
    soundName: "default",
  });
};

export const ScheduledNotifcation = (title, quote, fireTime) => {
  PushNotification.getScheduledLocalNotifications((notifications) => {
    const quoteNotif = notifications.some(
      (notif) => notif?.title === "Your Daily Motivation"
    );

    if (!quoteNotif) {
      const isDuplicate = notifications.some((n) => n.date == fireTime);
      if (isDuplicate) {
        return;
      }

      PushNotification.localNotificationSchedule({
        autoCancel: true,
        bigText: title,
        date: fireTime,
        subText: "Click here to see today's positive quote.",
        title: title,
        message: quote,
        channelId: "Quote",
        vibrate: true,
        vibration: 400,
        playSound: true,
        soundName: "default",
        data: {
          screen: "QuotesPage",
        },
      });
      console.log("Medicine reminder scheduled!");
    }
  });
};

export const scheduleWaterReminders = () => {
  PushNotification.cancelAllLocalNotifications();

  const waterTimes = [
    { hours: 9, minutes: 0 },
    { hours: 11, minutes: 0 },
    { hours: 13, minutes: 0 },
    { hours: 16, minutes: 0 },
    { hours: 17, minutes: 0 },
    { hours: 19, minutes: 0 },
  ];

  const now = new Date();

  for (let i = 0; i < 30; i++) {
    waterTimes.forEach((time) => {
      const notificationTime = new Date(now);
      notificationTime.setDate(now.getDate() + i);
      notificationTime.setHours(time.hours, time.minutes, 0, 0);

      if (notificationTime <= now && i === 0) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }

      PushNotification.localNotificationSchedule({
        autoCancel: true,
        date: notificationTime,
        title: "Time to Hydrate!",
        message: "Drink a glass of water to stay healthy and hydrated.",
        channelId: "Water Reminders",
        vibrate: true,
        vibration: 400,
        playSound: true,
        soundName: "default",
      });
    });
  }
};

export const scheduleMedicineReminders = () => {
  PushNotification.cancelAllLocalNotifications();

  const medicineTimes = [
    { hours: 9, minutes: 0 },
    { hours: 14, minutes: 0 },
    { hours: 21, minutes: 0 },
  ];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    medicineTimes.forEach(({ hours, minutes }) => {
      const notificationTime = new Date(now);
      notificationTime.setDate(now.getDate() + i);
      notificationTime.setHours(hours, minutes, 0, 0);

      if (notificationTime <= now && i === 0) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }

      PushNotification.localNotificationSchedule({
        autoCancel: true,
        date: notificationTime,
        channelId: "Medicine Reminders",
        title: "Medicine Reminder",
        message: "Time to take your medicine.",
        vibrate: true,
        vibration: 400,
        playSound: true,
        soundName: "default",
      });
    });
  }
};
