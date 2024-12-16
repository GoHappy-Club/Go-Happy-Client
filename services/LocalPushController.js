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
      params: { test: "12345" },
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

      PushNotification.localNotificationSchedule({
        channelId: "water reminders",
        title: "Time to Hydrate!",
        message: "Drink a glass of water to stay healthy and hydrated.",
        date: next9AM,
        allowWhileIdle: true,
        repeatType: "time",
        repeatTime: 1 * 1000,
      });
      console.log("Water reminder scheduled!");
    }
  });
};
