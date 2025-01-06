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
const getNext9AM = () => {
  const now = new Date();
  const next9AM = new Date();
  next9AM.setHours(9, 0, 0, 0);
  if (now > next9AM) {
    next9AM.setDate(next9AM.getDate() + 1);
  }
  return next9AM;
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
  PushNotification.getScheduledLocalNotifications((notifications) => {
    const waterReminderExists = notifications.some(
      (notif) =>
        notif.message === "Drink a glass of water to stay healthy and hydrated."
    );

    if (!waterReminderExists) {
      const hours = [9, 11, 13, 15, 17, 19];

      hours.forEach((hour) => {
        const notificationTime = getNextTimeForHour(hour);

        const isDuplicate = notifications.some(
          (n) => new Date(n.date).getTime() === notificationTime.getTime()
        );

        if (!isDuplicate) {
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
          console.log(`Water reminder scheduled for ${notificationTime}`);
        }
      });
    }
  });
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
  PushNotification.getScheduledLocalNotifications((notifications) => {
    const medicineReminderExists = notifications.some(
      (notif) => notif.message === "Time to take your medicine."
    );

    if (!medicineReminderExists) {
      const medicineTimes = [
        { hours: 9, minutes: 0 },
        { hours: 14, minutes: 0 },
        { hours: 21, minutes: 0 },
      ];

      medicineTimes.forEach(({ hours, minutes }) => {
        const notificationTime = getNextMedicineTimeForHour(hours, minutes);

        const isDuplicate = notifications.some(
          (n) => new Date(n.date).getTime() === notificationTime.getTime()
        );

        if (!isDuplicate) {
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
          console.log(`Medicine reminder scheduled for ${notificationTime}`);
        }
      });
    }
  });
};
