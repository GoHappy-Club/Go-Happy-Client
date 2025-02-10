import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Reminders from "../../components/Reminders/Reminders";
import { useSelector } from "react-redux";
import GOHLoader from "../../commonComponents/GOHLoader";
import { Colors } from "../../assets/colors/color";

const RemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const profile = useSelector((state) => state.profile.profile);
  const fetchReminders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/reminders/get?phone=${profile.phoneNumber}`
      );
      const reminders = response.data.reminders;
      const newReminders = reminders.map((reminder) => {
        return {
          ...reminder,
          frequency: `Daily at ${reminder.time}`,
        };
      });
      setReminders(newReminders);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error in fetchReminders", error);
      crashlytics.recordError(error);
    }
  };
  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAddReminder = async (reminder) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/reminders/add`,
        reminder
      );
      fetchReminders();
    } catch (error) {
      console.log("Error in handleAddReminder", error);
      crashlytics.recordError(error);
    }
  };

  const handleDeleteReminder = async (reminder) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/reminders/delete`,
        reminder
      );
      fetchReminders();
    } catch (error) {
      console.log("Error in handleDelete", error);
      crashlytics.recordError(error);
    }
  };

  return (
    <>
      {loading && (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
          }}
        >
          <GOHLoader />
        </View>
      )}
      {!loading && (
        <Reminders
          handleAddReminder={handleAddReminder}
          handleDeleteReminder={handleDeleteReminder}
          reminders={reminders}
        />
      )}
    </>
  );
};

export default RemindersScreen;

const styles = StyleSheet.create({});
