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
  SafeAreaView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
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
import { useTranslation } from "react-i18next";

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
  loading,
}) => {
  const [timeLeft, setTimeLeft] = useState(3);
  const { t } = useTranslation();

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

      const containerStyle = [StyleSheet.absoluteFill, containerAnimatedStyle];

      if (Platform.OS === "ios") {
        return (
          <Animated.View style={containerStyle}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1}>
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
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} />
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

  const renderContent = () => (
    <View style={styles.contentContainer}>
      <View>
        <Text style={styles.ratingTitle}>{t("drop_review")}</Text>
        <View style={styles.sessionContainer}>
          <View style={styles.sessionTextContainer}>
            <Text style={styles.attendedText}>{t("recently_attended")}</Text>
            <Text style={styles.sessionName}>
              {currentSession?.sessionName}
            </Text>
            <Text style={styles.improveText}>{t("rate_session")}</Text>
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
        <TextInput
          style={styles.textInput}
          placeholder={t("rating_placeholder")}
          placeholderTextColor="#999999"
          multiline={true}
          numberOfLines={4}
          value={reason}
          onChangeText={setReason}
        />
        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedRating > 0
              ? styles.submitButtonActive
              : styles.submitButtonDisabled,
          ]}
          onPress={() => selectedRating > 0 && submitRating(selectedRating)}
          disabled={selectedRating === 0 || loading}
        >
          <Text
            style={[
              styles.submitButtonText,
              selectedRating > 0
                ? styles.submitButtonTextActive
                : styles.submitButtonTextDisabled,
            ]}
          >
            {t("submit")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={Platform.OS === "ios" ? ["70%"] : ["75%"]}
      enablePanDownToClose={false}
      enableDismissOnClose={true}
      enableHandlePanningGesture={false}
      handleStyle={{ display: "none" }}
      backgroundStyle={{ borderRadius: 24 }}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      onChange={(index) => {
        setSelectedRating(0);
        if (index === -1) {
          closeModal();
        }
      }}
    >
      {submitted ? (
        <View style={styles.thanksContainer}>
          <Text style={styles.ratingTitle}>Thank you for your feedback!</Text>
        </View>
      ) : (
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
        >
          {renderContent()}
        </BottomSheetScrollView>
      )}
    </BottomSheetModal>
  );
};

export default SessionRatingSheet;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    minHeight: "100%",
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
    marginTop: "auto",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  textInput: {
    width: "100%",
    height: hp(20),
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
