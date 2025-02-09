import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { hp, wp } from "../../helpers/common";
import { Colors } from "../../assets/colors/color";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFrown,
  faGrinHearts,
  faMeh,
  faSmile,
  faSmileBeam,
} from "@fortawesome/free-solid-svg-icons";

const SessionRatingSheet = ({
  modalRef,
  closeModal,
  currentSession,
  submitRating,
  selectedRating,
  setSelectedRating,
  reason,
  setReason,
  submitted,
  setSubmitted,
}) => {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (submitted) {
      if (timeLeft === 0) return;

      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timeLeft, submitted]);

  useEffect(() => {
    if (submitted && timeLeft == 0) {
      modalRef?.current?.dismiss();
      setSubmitted(false);
    }
  }, [submitted, timeLeft]);

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
  
      const containerStyle = [
        StyleSheet.absoluteFill,
        containerAnimatedStyle
      ];
  
      if (Platform.OS === 'ios') {
        return (
          <Animated.View style={containerStyle}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              // onPress={closeModal}
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
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            containerAnimatedStyle,
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            // onPress={closeModal}
            activeOpacity={1}
          />
        </Animated.View>
      );
    },
    [closeModal]
  );

  const renderEmoji = (icon, rating) => (
    <TouchableOpacity
      onPress={() => setSelectedRating(rating)}
      style={[
        styles.emojiContainer,
        selectedRating === rating && styles.selectedEmoji,
      ]}
    >
      <FontAwesomeIcon
        size={28}
        icon={icon}
        color={selectedRating === rating ? "#fff" : "#666"}
        style={styles.icon}
      />
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["70%"]}
      enablePanDownToClose={false}
      enableDismissOnClose={true}
      enableHandlePanningGesture={false}
      handleStyle={{ display: "none" }}
      backgroundStyle={{ borderRadius: 24 }}
      backdropComponent={renderBackdrop}
      onChange={(index) => {
        setSelectedRating(0);
        if (index === -1) {
          closeModal();
        }
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <BottomSheetView style={styles.container}>
            {/* <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <X size={24} color="#000" />
            </TouchableOpacity> */}
            {submitted ? (
              <View style={styles.thanksContainer}>
                <Text style={styles.ratingTitle}>
                  Thank you for your feedback!
                </Text>
              </View>
            ) : (
              <View style={styles.contentContainer}>
                <View>
                  <Text style={styles.ratingTitle}>Drop your review</Text>
                  <View style={styles.sessionContainer}>
                    <View style={styles.sessionTextContainer}>
                      <Text style={styles.attendedText}>
                        You recently attended
                      </Text>
                      <Text style={styles.sessionName}>
                        {currentSession?.sessionName}
                      </Text>
                      <Text style={styles.improveText}>
                        Please rate our session so we can improve.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.emojiRow}>
                    {renderEmoji(faFrown, 1)}
                    {renderEmoji(faMeh, 2)}
                    {renderEmoji(faSmile, 3)}
                    {renderEmoji(faSmileBeam, 4)}
                    {renderEmoji(faGrinHearts, 5)}
                  </View>
                </View>

                <View style={styles.bottomContainer}>
                  {selectedRating <= 2 && (
                    <TextInput
                      style={styles.textInput}
                      placeholder="Please tell us why are you rating us so low so we can improve"
                      placeholderTextColor="#999999"
                      multiline={true}
                      numberOfLines={4}
                      value={reason}
                      onChangeText={setReason}
                    />
                  )}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      selectedRating > 0
                        ? styles.submitButtonActive
                        : styles.submitButtonDisabled,
                    ]}
                    onPress={() =>
                      selectedRating > 0 && submitRating(selectedRating)
                    }
                    disabled={selectedRating === 0}
                  >
                    <Text
                      style={[
                        styles.submitButtonText,
                        selectedRating > 0
                          ? styles.submitButtonTextActive
                          : styles.submitButtonTextDisabled,
                      ]}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </BottomSheetView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheetModal>
  );
};

export default SessionRatingSheet;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    padding: 8,
    zIndex: 1,
  },
  sessionContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(5),
    marginTop: 12,
    marginBottom: 32,
  },
  sessionTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  attendedText: {
    fontSize: wp(4),
    fontWeight: "400",
    color: Colors.black,
    textAlign: "center",
  },
  improveText: {
    fontSize: wp(4),
    fontWeight: "400",
    color: Colors.black,
    textAlign: "center",
  },
  sessionName: {
    fontSize: wp(7),
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  ratingTitle: {
    fontSize: 26,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 0,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  emojiContainer: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  selectedEmoji: {
    borderColor: Colors.white,
    backgroundColor: Colors.primary,
  },
  bottomContainer: {
    gap: 16,
  },
  textInput: {
    width: "100%",
    height: hp(8),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    color: Colors.black,
    backgroundColor: "#FFFFFF",
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonActive: {
    backgroundColor: Colors.primary,
  },
  submitButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonTextActive: {
    color: "#FFFFFF",
  },
  submitButtonTextDisabled: {
    color: "#999999",
  },
  thanksContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
