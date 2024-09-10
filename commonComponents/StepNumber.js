import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useCopilot } from "react-native-copilot";

const StepNumber = () => {
  const { currentStep } = useCopilot();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{currentStep.order}</Text>
    </View>
  );
};

export default StepNumber;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: "90%",
    borderRadius: 15,
    backgroundColor: "#29BFC2",
    justifyContent: "center",
    alignItems: "center",
},
  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
});
