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
  PushNotification.getScheduledLocalNotifications((notifications) => {
    const waterReminderExists = notifications.some((notif) =>
      notif.title.toLowerCase().includes("Time to Hydrate!".toLowerCase())
    );

    if (!waterReminderExists) {
      const hours = [9, 11, 13, 15, 17, 19];

      hours.forEach((hour) => {
        const notificationTime = getNextTimeForHour(hour);
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
    const medicineReminderExists = notifications.some((notif) =>
      notif.title.toLowerCase().includes("Medicine Reminder".toLowerCase())
    );

    if (!medicineReminderExists) {
      const medicineTimes = [
        { hours: 9, minutes: 0 },
        { hours: 14, minutes: 0 },
        { hours: 21, minutes: 0 },
      ];

      medicineTimes.forEach(({ hours, minutes }) => {
        const notificationTime = getNextMedicineTimeForHour(hours, minutes);
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
  });
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
  PushNotification.getScheduledLocalNotifications((notifications) => {
    reminders.forEach((reminder) => {
      const existingReminder = notifications.find(
        (notif) => notif.data?.id === reminder.id
      );

      if (existingReminder) {
        const existingFireDate = new Date(existingReminder.date);
        const newFireDate = getNextReminderTime(reminder.time);

        if (newFireDate > existingFireDate) {
          PushNotification.localNotificationSchedule({
            autoCancel: true,
            date: newFireDate,
            channelId: "Reminders",
            title: reminder.title,
            message: reminder.description || "Reminder",
            vibration: 400,
            userInfo: { id: reminder.id },
          });

          console.log(
            `Reminder rescheduled for ${reminder.title} at ${newFireDate}`
          );
        } else {
          console.log(
            `Reminder for ${reminder.title} already scheduled for a later time (${existingFireDate}), skipping.`
          );
        }
      } else {
        const notificationTime = getNextReminderTime(reminder.time);
        PushNotification.localNotificationSchedule({
          autoCancel: true,
          date: notificationTime,
          channelId: "Reminders",
          title: reminder.title,
          message: reminder.description || "Reminder",
          vibration: 400,
          userInfo: { id: reminder.id },
        });

        console.log(
          `Reminder scheduled for ${reminder.title} at ${notificationTime}`
        );
      }
    });
  });
};
