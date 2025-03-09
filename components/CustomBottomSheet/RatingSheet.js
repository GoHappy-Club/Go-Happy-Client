import {
  faFrown,
  faGrinHearts,
  faMeh,
  faSmile,
  faSmileBeam,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { Button } from "react-native-elements";

import { Colors } from "../../assets/colors/color";
import { wp } from "../../helpers/common";

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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      onPress={() => {
        setShowError(false);
        setSelectedRating(rating);
        if (rating > 3) {
          setReason("");
        }
      }}
      style={[
        styles.emojiContainer,
        selectedRating === rating && styles.selectedEmoji,
      ]}
    >
      <FontAwesomeIcon
        size={24}
        icon={icon}
        color={selectedRating === rating ? "#fff" : "#666"}
      />
    </TouchableOpacity>
  );

  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      onDismiss={closeAlert}
      customView={
        submitted ? (
          <Text style={styles.thankYouText}>{t("thank_you_for_feedback")}</Text>
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.sessionName}>{t("drop_review")}</Text>
            <Text style={styles.improveText}>
              {t("recently_attended")}{" "}
              <Text
                style={{
                  fontSize: wp(4),
                  fontWeight: "600",
                  color: Colors.primaryText,
                }}
              >
                {currentSession?.sessionName}
              </Text>
              {" session! "}
              {t("rate_session")}
            </Text>
            <View style={styles.emojiRow}>
              {renderEmoji(faFrown, 1)}
              {renderEmoji(faMeh, 2)}
              {renderEmoji(faSmile, 3)}
              {renderEmoji(faSmileBeam, 4)}
              {renderEmoji(faGrinHearts, 5)}
            </View>
            {showError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
            {selectedRating != 0 && selectedRating <= 3 && (
              <TextInput
                style={styles.textInput}
                placeholder={t("rating_placeholder")}
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={reason}
                onChangeText={setReason}
              />
            )}
            <Button
              outline
              title={t("submit")}
              loading={loading}
              buttonStyle={{
                backgroundColor: Colors.primary,
                borderRadius: 6,
                marginTop: 10,
              }}
              titleStyle={{
                color: Colors.primaryText,
                fontSize: wp(4),
              }}
              onPress={() => {
                if (selectedRating == 0) {
                  setErrorMessage(t("rating_error"));
                  setShowError(true);
                  return;
                } else if (selectedRating <= 3 && reason.length === 0) {
                  setErrorMessage(t("reason_error"));
                  setShowError(true);
                  return;
                }
                submitRating(selectedRating);
              }}
              disabled={loading}
              loadingProps={{
                color: Colors.primaryText,
              }}
            />
          </View>
        )
      }
      showConfirmButton={false}
      showCancelButton={false}
    />
  );
};

SessionRatingAlert.propTypes = {
  showAlert: PropTypes.bool.isRequired,
  closeAlert: PropTypes.func.isRequired,
  currentSession: PropTypes.object,
  submitRating: PropTypes.func.isRequired,
  selectedRating: PropTypes.number.isRequired,
  setSelectedRating: PropTypes.func.isRequired,
  reason: PropTypes.string.isRequired,
  setReason: PropTypes.func.isRequired,
  submitted: PropTypes.bool.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SessionRatingAlert;

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    padding: 4,
  },
  sessionName: {
    fontSize: wp(6),
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
    width: "100%",
    flexDirection: "row",
    gap: 5,
  },
  emojiContainer: {
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    textAlign: "center",
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
    marginTop: 10,
  },
  thankYouText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.black,
  },
});
