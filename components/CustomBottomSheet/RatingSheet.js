import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFrown,
  faMeh,
  faSmile,
  faSmileBeam,
  faGrinHearts,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Colors } from "../../assets/colors/color";

const SessionRatingAlert = ({
  showAlert,
  closeAlert,
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
    if (submitted && timeLeft === 0) {
      closeAlert();
      setSubmitted(false);
    }
  }, [submitted, timeLeft]);

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
      />
    </TouchableOpacity>
  );

  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={submitted ? t("thank_you") : t("drop_review")}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      onDismiss={closeAlert}
      customView={
        submitted ? (
          <Text style={styles.thankYouText}>{t("thank_you_for_feedback")}</Text>
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.sessionName}>
              {currentSession?.sessionName}
            </Text>
            <Text style={styles.improveText}>{t("rate_session")}</Text>
            <View style={styles.emojiRow}>
              {renderEmoji(faFrown, 1)}
              {renderEmoji(faMeh, 2)}
              {renderEmoji(faSmile, 3)}
              {renderEmoji(faSmileBeam, 4)}
              {renderEmoji(faGrinHearts, 5)}
            </View>
            <TextInput
              style={styles.textInput}
              placeholder={t("rating_placeholder")}
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
            />
          </View>
        )
      }
      showConfirmButton={!submitted}
      confirmButtonText={t("submit")}
      confirmButtonColor={
        selectedRating === 0 || loading ? Colors.grey.grey : Colors.primary
      }
      onCancelPressed={closeAlert}
      onConfirmPressed={() =>
        selectedRating > 0 && submitRating(selectedRating)
      }
      confirmButtonDisabled={selectedRating === 0 || loading}
    />
  );
};

export default SessionRatingAlert;

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    padding: 10,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  improveText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  emojiContainer: {
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#FFFFFF",
  },
  selectedEmoji: {
    backgroundColor: Colors.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 10,
    textAlignVertical: "top",
    color: Colors.black,
    backgroundColor: "#FFFFFF",
  },
  thankYouText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.black,
  },
});
