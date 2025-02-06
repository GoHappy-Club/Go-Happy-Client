import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { useCopilot } from "react-native-copilot";
import { Colors } from "../assets/colors/color";

const CustomTooltip = () => {
  const {
    isFirstStep,
    isLastStep,
    currentStep,
    goToNext,
    goToPrev,
    stop,
    copilotEvents,
    totalStepsNumber,
    unregisterStep,
    registerStep,
  } = useCopilot();

  const handleSkip = () => {
    AsyncStorage.setItem("showTour", "false");
    stop();
  };
  const handleFinish = () => {
    AsyncStorage.setItem("showTour", "false");
    stop();
  };

  return (
    <View style={[styles.container, { width: "auto" }]}>
      <Text style={styles.tooltipText}>{currentStep.text}</Text>
      <View style={styles.buttonContainer}>
        {!isLastStep && (
          <TouchableOpacity
            onPress={handleSkip}
            style={[styles.button, { backgroundColor: Colors.transparent }]}
          >
            <Text style={[styles.buttonText, { color: Colors.grey.grey }]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            width: isLastStep ? "100%" : "auto",
            gap: 5,
          }}
        >
          {!isFirstStep && (
            <TouchableOpacity onPress={goToPrev} style={styles.button}>
              <Text style={styles.buttonText}>Prev</Text>
            </TouchableOpacity>
          )}
          {!isLastStep && (
            <TouchableOpacity onPress={goToNext} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )}
          {isLastStep && (
            <TouchableOpacity onPress={handleFinish} style={styles.button}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "4%",
    paddingTop: 0,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignSelf: "center",
  },
  tooltipText: {
    fontSize: 16,
    marginBottom: 10,
    justifyContent: "center",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.primaryText,
    fontSize: 12,
  },
});

export default CustomTooltip;
