import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { wp } from "../../helpers/common";
import { Colors } from "../../assets/colors/color";

const ReferralSteps = () => {
  return (
    <View style={styles.card}>
      <View style={styles.step}>
        <View style={styles.circleContainer}>
          <View style={styles.circle}></View>
          <View style={styles.verticalLine} />
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Invite Your Friends & Family</Text>
          <Text style={styles.stepDescription}>
            Share your referral code with your friends & family members
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.step}>
        <View style={styles.circleContainer}>
          <View style={styles.circle}></View>
          <View style={styles.verticalLine} />
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>They Join & Attend a Session</Text>
          <Text style={styles.stepDescription}>
            They create an account & attend their session to complete your
            referral
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.step}>
        <View style={styles.circleContainer}>
          <View style={styles.circle}></View>
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Win Exciting Rewards!</Text>
          <Text style={styles.stepDescription}>
            Congrats! You've earned rewards for your successful referral
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: wp(1),
  },
  circleContainer: {
    alignItems: "center",
    marginRight: 12,
    width: 24,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  verticalLine: {
    width: 3,
    height: 32,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: wp(4),
    color: "#333",
    fontFamily: "Poppins-Regular",
  },
  stepDescription: {
    fontSize: wp(2.8),
    color: Colors.grey.grey,
  },
});

export default ReferralSteps;
