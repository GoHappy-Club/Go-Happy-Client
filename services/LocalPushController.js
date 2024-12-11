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
