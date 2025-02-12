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

const getNextTimeForHour = (hour) => {
  const now = new Date();
  const nextTime = new Date();
  nextTime.setHours(hour, 0, 0, 0);
  if (nextTime <= now) {
    nextTime.setDate(nextTime.getDate() + 1);
  }
  return nextTime;
};

export const scheduleWaterReminders = () => {
  PushNotification.cancelAllLocalNotifications();

  const hours = [9, 11, 13, 15, 17, 19];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    hours.forEach((hour) => {
      const notificationTime = new Date(now);
      notificationTime.setDate(now.getDate() + i);
      notificationTime.setHours(hour, 0, 0, 0);

      if (notificationTime <= now && i === 0) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }

      PushNotification.localNotificationSchedule({
        autoCancel: true,
        date: notificationTime,
        title: "Time to Hydrate!",
        message: "Drink a glass of water to stay healthy and hydrated.",
        channelId: "Water Reminders",
        vibration: 400,
      });
      console.log(`Water reminder scheduled for ${notificationTime}`);
    });
  }
};

const getNextMedicineTimeForHour = (hours, minutes) => {
  const now = new Date();
  const nextTime = new Date(now);
  nextTime.setHours(hours, minutes, 0, 0);
  if (nextTime <= now) {
    nextTime.setDate(nextTime.getDate() + 1);
  }
  return nextTime;
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
        vibration: 400,
      });
      console.log(`Medicine reminder scheduled for ${notificationTime}`);
    });
  }
};

const getNextReminderTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const now = new Date();
  const nextTime = new Date(now);
  nextTime.setHours(hours, minutes, 0, 0);

  if (nextTime <= now) {
    nextTime.setDate(nextTime.getDate() + 1);
  }
  return nextTime;
};

export const scheduleUserReminders = (reminders) => {
  PushNotification.cancelAllLocalNotifications();

  const now = new Date();

  for (let i = 0; i < 30; i++) {
    reminders.forEach((reminder) => {
      const notificationTime = new Date(now);
      notificationTime.setDate(now.getDate() + i);
      const [hours, minutes] = reminder.time.split(":").map(Number);
      notificationTime.setHours(hours, minutes, 0, 0);

      if (notificationTime <= now && i === 0) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }

      PushNotification.localNotificationSchedule({
        autoCancel: true,
        date: notificationTime,
        channelId: "Reminders",
        title: reminder.title,
        message: reminder.description || "Reminder",
        vibration: 400,
        userInfo: { id: reminder.id },
      });

      console.log(`Reminder scheduled for ${reminder.title} at ${notificationTime}`);
    });
  }
};
