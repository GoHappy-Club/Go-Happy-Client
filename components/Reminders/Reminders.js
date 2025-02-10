import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { hp, wp } from "../../helpers/common";
import { Colors } from "../../assets/colors/color";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Clock, Trash, Trash2, Trash2Icon, X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import { Button } from "react-native-elements";
import AwesomeAlert from "react-native-awesome-alerts";

const Reminders = ({ handleAddReminder, reminders, handleDeleteReminder }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "90%"], []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("20:20");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);

  const navigation = useNavigation();
  const { t } = useTranslation();
  const profile = useSelector((state) => state.profile.profile);

  const handleSheetChanges = useCallback((index) => {
    if (index == -1) {
      setSheetOpen(false);
    } else if (index == 1) {
      setSheetOpen(true);
    }
  }, []);

  const closeModal = () => {
    bottomSheetRef.current?.close();
    setSheetOpen(false);
  };

  const renderBackdrop = useCallback(
    ({ animatedIndex }) => {
      const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
          animatedIndex.value,
          [0, 1],
          [0, 1],
          Extrapolation.CLAMP
        ),
      }));

      const containerStyle = [StyleSheet.absoluteFill, containerAnimatedStyle];

      if (Platform.OS === "ios") {
        return (
          <Animated.View
            style={containerStyle}
            pointerEvents={sheetOpen ? "auto" : "none"}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={closeModal}
              activeOpacity={1}
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurAmount={1}
                blurType="regular"
              />
            </TouchableOpacity>
          </Animated.View>
        );
      }

      return (
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            containerAnimatedStyle,
          ]}
          pointerEvents={sheetOpen ? "auto" : "none"}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeModal}
            activeOpacity={1}
          />
        </Animated.View>
      );
    },
    [closeModal]
  );

  const addReminder = async () => {
    if (!validateData()) {
      setAlertMessage("Please fill the details first.");
      setShowAlert(true);
      return;
    }
    const reminder = {
      title,
      description,
      time,
      phone: profile.phoneNumber,
    };
    setLoading(true);
    await handleAddReminder(reminder);
    setLoading(false);
    closeModal();
    resetForm();
  };

  const deleteReminder = async (reminder) => {
    handleDeleteReminder(reminder);
  };

  const parseTime = () => {
    const splittedTime = time.split(":");
    const hour = splittedTime[0];
    const minute = splittedTime[1];
    const now = new Date();
    const newDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );
    return newDate;
  };

  const handleTimeChange = (e, selectedTime) => {
    if (selectedTime) {
      const istTime = selectedTime.toLocaleString("en-IN", {
        timezone: "Asia/Kolkata",
      });
      const splittedIST = istTime.split(",")[1]?.trim();
      const splittedTime = splittedIST.split(":");
      const hour = splittedTime[0];
      const minute = splittedTime[1];
      setTime(`${hour}:${minute}`);
      setShowTimePicker(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  const validateData = () => {
    if (time.length < 0 || title.length < 3 || description.length < 5) {
      return false;
    }
    return true;
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: hp(2.5),
        }}
      >
        <TouchableOpacity
          style={{
            padding: 4,
            backgroundColor: Colors.white,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: Colors.white,
            shadowColor: Colors.black,
            elevation: 10,
            shadowOffset: { height: 2 },
            shadowOpacity: 0.3,
            position: "relative",
          }}
          onPress={() => navigation.goBack()}
        >
          <Text>{t("back")}</Text>
        </TouchableOpacity>
      </View>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <ScrollView style={styles.scrollView}>
          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderDescription}>
                  {reminder.description}
                </Text>
                <Text style={styles.reminderFrequency}>
                  {reminder.frequency}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteReminder(reminder)}
                style={styles.deleteButton}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
                <Trash2
                  size={20}
                  color={Colors.white}
                  style={styles.deleteIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSheetOpen(true);
            bottomSheetRef.current?.snapToIndex(1);
          }}
        >
          <Text style={styles.addButtonText}>Add New Reminder</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        // enablePanDownToClose
        backdropComponent={renderBackdrop}
        style={{
          overflow: "hidden",
          borderRadius: 40,
          paddingHorizontal: wp(6),
          paddingVertical: hp(3),
        }}
        backgroundStyle={{
          borderRadius: 40,
        }}
        handleStyle={{ display: "none" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContent}
          >
            {showTimePicker && (
              <DateTimePicker
                value={parseTime()}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                closeModal();
              }}
              style={{
                position: "absolute",
                // top: 20,
                right: 10,
                padding: 6,
                backgroundColor: Colors.grey.f0,
                borderRadius: 40,
                zIndex: 1000,
              }}
            >
              <X color="#000" size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Reminder</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={(text) => {
                setDescription(`Time for ${text}`);
                setTitle(text);
              }}
              maxLength={30}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              maxLength={30}
            />
            <TouchableOpacity
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => setShowTimePicker(true)}
            >
              <View>
                <Text style={styles.label}>Time</Text>
                <Text
                  style={{
                    fontSize: wp(4),
                    fontFamily: "Montserrat-Regular",
                  }}
                >
                  {time}
                </Text>
              </View>
              <Clock size={24} color={Colors.primaryText} />
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  bottomSheetRef.current?.close();
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Button
                outline
                buttonStyle={[styles.modalButton, styles.submitButton]}
                onPress={addReminder}
                title={"Add Reminder"}
                titleStyle={styles.modalButtonText}
                loading={loading}
                disabled={loading || !validateData()}
                loadingStyle={{
                  color: Colors.black,
                }}
              />
            </View>
          </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
      {showAlert && (
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          closeOnTouchOutside={true}
          title="Error!"
          message={alertMessage}
          showConfirmButton={true}
          confirmText="Try Again"
          confirmButtonColor={Colors.green}
          onConfirmPressed={() => setShowAlert(false)}
          onDismiss={() => {
            setShowAlert(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.primaryText,
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  reminderCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    color: Colors.grey.grey,
    marginBottom: 4,
  },
  reminderFrequency: {
    fontSize: 14,
    color: Colors.grey.d,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.red,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, // Ensures space between text and icon (React Native 0.71+)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  deleteButtonText: {
    color: Colors.white, // Ensures high contrast
    fontSize: 16,
    fontWeight: "600",
  },
  deleteIcon: {
    marginLeft: 6, // Alternative to 'gap' for older React Native versions
  },
  modalContent: {
    padding: 15,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey.f0,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: Colors.grey[4],
  },
  datePickerContainer: {
    marginBottom: 16,
    backgroundColor: Colors.grey.f0,
    borderRadius: 8,
    padding: 8,
  },
  datePickerText: {
    fontSize: 16,
  },
  datePickerSelectedText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  datePickerHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  datePickerWeekDaysText: {
    fontSize: 14,
    color: Colors.grey.f0,
  },
  datePickerButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  datePickerButtonSecondary: {
    backgroundColor: Colors.grey.f0,
  },
  repeatContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  repeatOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  repeatOption: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.grey.f0,
    flex: 1,
    marginHorizontal: 4,
  },
  repeatOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  repeatOptionText: {
    textAlign: "center",
    color: Colors.grey.d,
  },
  repeatOptionTextSelected: {
    color: Colors.white,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: Colors.coinsRed,
    minWidth: "45%",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    minWidth: "45%",
  },
});

export default Reminders;
