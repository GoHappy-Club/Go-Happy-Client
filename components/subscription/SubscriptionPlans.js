import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import phonepe_payments from "../PhonePe/Payments";
import { useSelector } from "react-redux";
import Accordion from "react-native-collapsible/Accordion";
import { TouchableOpacity } from "react-native";
import { hp, wp } from "../../helpers/common";
import { Colors } from "../../assets/colors/color";
import { MoveRight } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import GradientText from "../../commonComponents/GradientText";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const colorMapping = {
  Silver: ["#C0C0C0", "#E8E8E8", "#B8B8B8"],
  Gold: ["#FFD700", "#FDB931", "#FF8C00"],
  Platinum: ["#304352", "#304352A1", "#d7d2cc", "#304352A1"],
};

const SubscriptionPlans = ({ plans }) => {
  const PLANS = plans;
  const [activeSections, setActiveSections] = useState([0]);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);

  const navigation = useNavigation();

  const handleBuyPlan = async (plan) => {
    //handle buy plan logic
    console.log(plan);
    
    const _callback = () => {};

    const _errorHandler = () => {
      navigation.navigate("MembershipSubscriptionFailed");
    };
    // if (type == "share") {
    //   phonepe_payments
    //     .phonePeShare(
    //       profile.phoneNumber,
    //       plan.subscriptionFees,
    //       _errorHandler,
    //       "subscription"
    //     )
    //     .then((link) => {});
    // } else {
    //   phonepe_payments.phonePe(
    //     profile.phoneNumber,
    //     plan.subscriptionFees,
    //     _callback,
    //     _errorHandler,
    //     "subscription"
    //   );
    // }
    // set AsyncStorage items 'paymentProgress' & 'paymentProgressTime' too.
  };

  const handleUpgradePlan = async (plan) => {
    // handle upgrade plan logic
  };

  const handleRenewPlan = async (plan) => {
    //handle renew plan logic
  };

  const handleSectionChange = (sections) => {
    setActiveSections(sections);
    if (sections.length > 0) {
      setSelectedPlan(PLANS[sections[0]]);
    }
  };

  const renderHeader = (section, index) => {
    const isSelected = selectedPlan?.membershipType === section.membershipType;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSectionChange([index])}
        style={[
          styles.headerContainer,
          { marginBottom: isSelected ? 0 : hp(2) },
        ]}
      >
        <AnimatedLinearGradient
          colors={
            isSelected
              ? ["#7c3aed", "#9333ea", "#4f46e5"]
              : ["#f5f3ff", "#faf5ff"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradientContainer,
            {
              borderBottomLeftRadius: isSelected ? 0 : 8,
              borderBottomRightRadius: isSelected ? 0 : 8,
            },
          ]}
        >
          <Text
            style={[
              styles.headerText,
              { color: isSelected ? "#ffffff" : "#1f2937" },
            ]}
          >
            {section.membershipType}
          </Text>
        </AnimatedLinearGradient>
      </TouchableOpacity>
    );
  };

  const renderContent = (section) => {
    const isSelected = selectedPlan?.membershipType === section.membershipType;

    const features = [
      { name: "Feature 1", available: true },
      { name: "Feature 2", available: true },
      { name: "Feature 3", available: true },
      { name: "Feature 4", available: false },
    ];

    return (
      <View
        style={[
          styles.contentContainer,
          {
            marginBottom: isSelected ? hp(2) : 0,
          },
        ]}
      >
        {features.map((feature, index) => (
          <View
            key={index}
            style={[
              styles.featureRow,
              index !== features.length - 1 && styles.featureRowBorder,
            ]}
          >
            <View style={styles.featureNameColumn}>
              <Text style={styles.featureText}>{feature.name}</Text>
            </View>
            <View style={styles.featureStatusColumn}>
              {feature.available ? (
                <Text style={[styles.featureStatus, styles.featureAvailable]}>
                  ✓
                </Text>
              ) : (
                <Text style={[styles.featureStatus, styles.featureUnavailable]}>
                  ✕
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>Choose Your Plan</Text>
          <Accordion
            sections={PLANS}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={handleSectionChange}
            duration={700}
            expandMultiple={false}
          />
        </View>
      </ScrollView>
      {/* FooterComponent */}
      <>
        <View style={styles.footerContainer}>
          <View style={styles.planInfoWrapper}>
            <View style={styles.planTextWrapper}>
              <Text style={styles.footerPlainText}>Selected plan</Text>
              <View style={styles.pricingTitleView}>
                <GradientText
                  text={selectedPlan?.membershipType}
                  colors={colorMapping[selectedPlan?.membershipType]}
                  style={styles.footerTitleText}
                />
                <Text style={styles.pricingTitleText}>
                  ₹ {selectedPlan?.subscriptionFees}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
              {
                backgroundColor: Colors.pink.sessionDetails,
                padding: 10,
                borderRadius: 6,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={() => handleBuyPlan(selectedPlan)}
          >
            <View
              style={{
                flexDirection: "row",
                gap: wp(3),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.footerButtonText}>Join now</Text>
              <MoveRight size={24} color="white" />
            </View>
          </Pressable>
        </View>
      </>
    </>
  );
};

export default SubscriptionPlans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.grey.f0,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  headerContainer: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
  },
  gradientContainer: {
    padding: 15,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  contentContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  contentText: { fontSize: 16, color: "#333" },
  footerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderTopRightRadius: wp(8),
    borderTopLeftRadius: wp(8),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    elevation: 50,
    width: wp(100),
    height: hp(20),
    gap: hp(1),
  },
  planInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
  },
  pricingTitleView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planTextWrapper: {
    gap: hp(1),
  },
  footerPlainText: {
    fontSize: hp(2),
    color: Colors.black,
  },
  footerTitleText: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: Colors.black,
    fontFamily: Platform.OS == "android" ? "Droid Sans Mono" : "Avenir",
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  pricingTitleText: {
    fontSize: hp(3),
    color: Colors.black,
    fontWeight: "bold",
  },
  joinNowButton: {
    backgroundColor: Colors.black,
  },
  footerButtonText: {
    color: Colors.white,
    fontSize: hp(2.5),
    fontWeight: "bold",
  },
  featureRow: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },
  featureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey.f0,
  },
  featureNameColumn: {
    flex: 1,
    paddingRight: 10,
  },
  featureStatusColumn: {
    width: 40,
    alignItems: "center",
  },
  featureText: {
    fontSize: 16,
    color: Colors.black,
  },
  featureStatus: {
    fontSize: 18,
    fontWeight: "bold",
  },
  featureAvailable: {
    color: "#22c55e",
  },
  featureUnavailable: {
    color: "#ef4444",
  },
});
