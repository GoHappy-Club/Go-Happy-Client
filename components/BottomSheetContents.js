import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../assets/colors/color";
import { hp, wp } from "../helpers/common";

export const FreeTrialContent = ({ cta }) => {
  return (
    <View style={styles.container}>
      {/* <AnimatedText /> */}
      <View style={{
        gap:wp(7)
      }}>
        <Text
          style={{
            fontSize: wp(10),
            fontWeight:"bold",
            textAlign:"center",
            marginTop:wp(2),
            fontFamily:"Poppings-Regular"
          }}
        >
          Limited Offer
        </Text>
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Enjoy these benefits:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✨</Text>
              <Text style={styles.benefitText}>Exclusive discounts</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✨</Text>
              <Text style={styles.benefitText}>Premium features</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✨</Text>
              <Text style={styles.benefitText}>Personal membership card</Text>
            </View>
            {/* <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✨</Text>
              <Text style={styles.benefitText}></Text>
            </View> */}
          </View>
        </View>
      </View>

      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton} onPress={cta}>
          <Text style={styles.ctaButtonText}>Start Free Trial</Text>
        </TouchableOpacity>
        <Text style={styles.ctaDescription}>
          No credit card needed • Cancel anytime
        </Text>
      </View>
    </View>
  );
};

export const FreeTrialExpiredContent = () => (
  <>
    <View
      style={{
        gap: -10,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: Colors.referLinkBackground,
          paddingVertical: 16,
          borderRadius: 25,
          alignItems: "center",
          marginBottom: 10,
        }}
        onPress={() => {
          // Implement your trial activation logic
          // console.log("Free trial activated!");
        }}
      >
        <Text style={{ color: Colors.black, fontSize: 20, fontWeight: "bold" }}>
          Free Trial Expired, buy subs
        </Text>
      </TouchableOpacity>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent:"space-between"
  },
  animatedTextContainer: {
    marginTop: hp(4),
    alignItems: "center",
  },
  animatedText: {
    fontSize: wp(6),
    fontWeight: "bold",
    color: Colors.primaryText,
    textAlign: "center",
  },
  ctaContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: Colors.referLinkBackground,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
    width: "95%",
  },
  ctaButtonText: {
    color: Colors.primaryText,
    fontSize: 20,
    fontWeight: "bold",
  },
  ctaDescription: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: 5,
  },
  benefitsContainer: {
    // marginTop: hp(1),
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: 12,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.primaryText,
  },
});
