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
import { X } from "lucide-react-native";

const Reminders = () => {
  const [reminders, setReminders] = useState([
    {
      id: "1",
      title: "Take Medicine",
      description: "Morning pills",
      frequency: "Daily at 9:00 AM",
      cronExpression: "0 9 * * *",
    },
    {
      id: "2",
      title: "Walk Exercise",
      description: "Morning walk",
      frequency: "Every Monday and Wednesday",
      cronExpression: "0 8 * * 1,3",
    },
  ]);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "90%"], []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatOption, setRepeatOption] = useState("daily");
  const [sheetOpen, setSheetOpen] = useState(false);

  const navigation = useNavigation();
  const { t } = useTranslation();

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

  const handleAddReminder = () => {
    console.log("ADD");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setIsRepeat(false);
    setRepeatOption("daily");
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSheetOpen(true);
          bottomSheetRef.current?.snapToIndex(1);
        }}
      >
        <Text style={styles.addButtonText}>Add New Reminder</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderCard}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderDescription}>
                {reminder.description}
              </Text>
              <Text style={styles.reminderFrequency}>{reminder.frequency}</Text>
            </View>
            <TouchableOpacity
              onPress={() => console.log(`Edit reminder ${reminder.id}`)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
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
              onChangeText={setTitle}
              maxLength={30}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              maxLength={30}
            />
            <Text style={styles.label}>Time</Text>
            <View style={styles.repeatContainer}>
              <Text style={styles.label}>Repeat</Text>
              <Switch value={isRepeat} onValueChange={setIsRepeat} />
            </View>

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
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddReminder}
              >
                <Text style={styles.modalButtonText}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
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
  editButton: {
    paddingHorizontal: 12,
  },
  editButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "500",
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
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
});

export default Reminders;
