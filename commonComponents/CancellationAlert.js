import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { Picker } from "@react-native-picker/picker";
import { X } from "lucide-react-native";
import { Colors } from "../assets/colors/color";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const CancellationBottomSheet = ({
  modalRef,
  closeModal,
  onConfirm,
  reasons,
}) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  const renderBackdrop = useCallback(
    ({ animatedIndex }) => {
      const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
          animatedIndex.value,
          [-1, 0],
          [0, 1],
          Extrapolation.CLAMP
        ),
      }));

      const containerStyle = [StyleSheet.absoluteFill, containerAnimatedStyle];

      if (Platform.OS === "ios") {
        return (
          <Animated.View style={containerStyle}>
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

  const handleConfirm = async () => {
    setLoading(true);
    const finalReason = reason === "Other" ? customReason : reason;
    await onConfirm(finalReason);
    setLoading(false);
    closeModal();
  };

  useEffect(() => {
    if (reason !== "Other") {
      setCustomReason("");
    }
  }, [reason]);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["70%"]}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      handleStyle={{ display: "none" }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        borderRadius: 40,
        backgroundColor: Colors.background,
        shadowColor: "#000",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 20,
      }}
      onChange={(index) => {
        if (index === -1) {
          closeModal();
        }
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <X color="#000" size={24} />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text style={styles.title}>Are you sure you want to cancel?</Text>

            <Text style={styles.message}>
              We're sorry to see you go. Please let us know why you're
              cancelling:
            </Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={reason}
                onValueChange={(itemValue) => setReason(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a reason" value="" />
                {reasons.map((r) => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>

            {reason === "Other" && (
              <TextInput
                style={styles.customReasonInput}
                placeholder="Please specify your reason"
                value={customReason}
                onChangeText={setCustomReason}
                multiline
              />
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.noButton]}
                onPress={closeModal}
                disabled={loading}
              >
                <Text style={styles.noButtonText}>No, Keep Membership</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.yesButton,
                  (!reason ||
                    (reason === "Other" && !customReason) ||
                    loading) &&
                    styles.disabledButton,
                ]}
                onPress={handleConfirm}
                disabled={
                  !reason || (reason === "Other" && !customReason) || loading
                }
              >
                <Text style={styles.yesButtonText}>
                  {loading ? "Cancelling..." : "Yes, Cancel"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 40,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: screenHeight * 0.7,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: Colors.grey.f0,
    borderRadius: 40,
  },
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.grey.d0,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
  },
  customReasonInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.grey.d0,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: "48%",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  noButton: {
    backgroundColor: Colors.grey.countdown,
  },
  yesButton: {
    backgroundColor: Colors.green,
  },
  disabledButton: {
    opacity: 0.5,
  },
  noButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  yesButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
});

export default CancellationBottomSheet;
