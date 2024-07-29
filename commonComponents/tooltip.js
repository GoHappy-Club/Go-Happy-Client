import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { useCopilot } from "react-native-copilot";

const CustomTooltip = () => {
  const {
    isFirstStep,
    isLastStep,
    currentStep,
    goToNext,
    goToPrev,
    stop,
    copilotEvents,
  } = useCopilot();
  const handleFinish = () => {
    copilotEvents.emit("finish");
    stop();
  };
  return (
    <View style={[styles.container, { width: 280 }]}>
      <Text style={styles.tooltipText}>{currentStep.text}</Text>
      <View style={styles.buttonContainer}>
        {!isFirstStep && (
          <TouchableOpacity onPress={goToPrev} style={styles.button}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {!isLastStep && (
          <>
            <TouchableOpacity onPress={stop} style={styles.button}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNext} style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        {isLastStep && (
          <TouchableOpacity onPress={handleFinish} style={styles.button}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
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
    justifyContent: "center",
    gap: 15,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#29BFC2",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
});

export default CustomTooltip;
