import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { X, Frown, Meh, Smile, SmilePlus } from "lucide-react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { hp, wp } from "../helpers/common";
import { Colors } from "../assets/colors/color";

const SessionRatingSheet = ({
  modalRef,
  closeModal,
  currentSession,
  submitRating,
}) => {
  const [selectedRating, setSelectedRating] = useState(0);

  const renderBackdrop = useCallback(
    ({ animatedIndex }) => {
      const containerAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
          animatedIndex.value,
          [-1, 0],
          [0, 1],
          Extrapolation.CLAMP
        );
        return { opacity };
      });

      const containerStyle = [StyleSheet.absoluteFill, containerAnimatedStyle];

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
    },
    [closeModal]
  );

  const renderEmoji = (Icon, rating) => (
    <TouchableOpacity
      onPress={() => setSelectedRating(rating)}
      style={[
        styles.emojiContainer,
        selectedRating === rating && styles.selectedEmoji,
      ]}
    >
      <Icon
        size={28}
        color={selectedRating === rating ? Colors.primary : "#666"}
        style={styles.icon}
      />
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["50%"]}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      enableGestureInteraction={true}
      handleStyle={{ display: "none" }}
      backgroundStyle={{ borderRadius: 24 }}
      backdropComponent={renderBackdrop}
      onChange={(index) => {
        if (index === -1) {
          closeModal();
        }
      }}
    >
      <BottomSheetView style={styles.container}>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <X size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.ratingTitle}>Rate your session</Text>
          <View style={styles.sessionContainer}>
            <Image
              source={{
                uri: currentSession && currentSession[0]?.sessionImage,
              }}
              style={styles.sessionImage}
            />
            <Text style={styles.sessionName} numberOfLines={2}>
              {currentSession && currentSession[0]?.sessionName}
            </Text>
          </View>

          <View style={styles.emojiRow}>
            {renderEmoji(Frown, 1)}
            {renderEmoji(Meh, 2)}
            {renderEmoji(Smile, 3)}
            {renderEmoji(SmilePlus, 4)}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedRating > 0
                ? styles.submitButtonActive
                : styles.submitButtonDisabled,
            ]}
            onPress={() => selectedRating > 0 && submitRating(selectedRating)}
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
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default SessionRatingSheet;

const styles = StyleSheet.create({
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
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    marginBottom: 32,
  },
  sessionImage: {
    width: wp(40),
    height: wp(27),
    borderRadius: 8,
    marginRight: 12,
  },
  sessionName: {
    flex: 1,
    fontSize: wp(4),
    fontWeight: "600",
    color: "#000",
  },
  ratingTitle: {
    fontSize: 26,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  emojiContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  selectedEmoji: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F8FF",
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
});
