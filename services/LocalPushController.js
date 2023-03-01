import PushNotification from "react-native-push-notification";

PushNotification.configure({
  onNotification: function (notification) {
    crashlytics().log("LOCAL NOTIFICATION ==>" + JSON.stringify(notification));
  },

  popInitialNotification: true,
  requestPermissions: true,
});

export const EventNotification = (event) => {
  crashlytics().log(JSON.stringify(event));
  PushNotification.localNotification({
    autoCancel: true,
    bigText: event.event.description,
    subText: "Thank you for booking this session.",
    title: event.event.eventName,
    message: "Click here for more details",
    channelId: "events",
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: "default",
    actions: '["Yes", "No"]',
  });
};

export const EventReminderNotification = (event) => {
  PushNotification.localNotificationSchedule({
    autoCancel: true,
    bigText: event.bigText,
    date: event.fireTime, // in 30 secs,
    subText: "Thank you for booking this session.",
    title: event.event.eventName,
    message: "Click here for more details",
    channelId: "events",
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: "default",
    actions: '["Yes", "No"]',
  });
};
