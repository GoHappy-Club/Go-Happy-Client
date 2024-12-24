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

export const scheduleWaterReminders = () => {
  PushNotification.getScheduledLocalNotifications((notifications) => {
    const waterReminderExists = notifications.some(
      (notif) =>
        notif.message === "Drink a glass of water to stay healthy and hydrated."
    );

    if (!waterReminderExists) {
      const next9AM = getNext9AM();
      const isDuplicate = notifications.some((n) => n.date == next9AM);
      if (isDuplicate) {
        return;
      }

      PushNotification.localNotificationSchedule({
        autoCancel: true,
        date: next9AM,
        title: "Time to Hydrate!",
        message: "Drink a glass of water to stay healthy and hydrated.",
        channelId: "Water Reminders",
        vibrate: true,
        vibration: 400,
        playSound: true,
        soundName: "default",
        repeatType: "time",
        repeatTime: 2 * 60 * 60 * 1000,
      });
      console.log("Water reminder scheduled!");
    }
  });
};

const getNextMedicineTime = () => {
  const now = new Date();
  const times = [
    { hours: 9, minutes: 0 },
    { hours: 14, minutes: 0 },
    { hours: 21, minutes: 0 },
  ];

  const todayTimes = times.map(({ hours, minutes }) => {
    const time = new Date(now);
    time.setHours(hours, minutes, 0, 0);
    return time;
  });

  const nextTime = todayTimes.find((time) => time > now);

  if (!nextTime) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(times[0].hours, times[0].minutes, 0, 0);
    return tomorrow;
  }

  return nextTime;
};

export const scheduleMedicineReminders = () => {
  PushNotification.getScheduledLocalNotifications((notifications) => {
    const medicineReminderExists = notifications.some(
      (notif) => notif.message === "Time to take your medicine."
    );

    if (!medicineReminderExists) {
      const next9AM = getNext9AM();
      const isDuplicate = notifications.some((n) => n.date == next9AM);
      if (isDuplicate) {
        return;
      }

      PushNotification.localNotificationSchedule({
        autoCancel: true,
        date: getNextMedicineTime(),
        channelId: "Medicine Reminders",
        title: "Medicine Reminder",
        message: "Time to take your medicine.",
        vibrate: true,
        vibration: 400,
        playSound: true,
        soundName: "default",
        repeatType: "time",
        repeatTime: 5 * 60 * 60 * 1000,
      });
      console.log("Medicine reminder scheduled!");
    }
  });
};
