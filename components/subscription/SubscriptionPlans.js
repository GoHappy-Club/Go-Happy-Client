import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Share,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import phonepe_payments from "../PhonePe/Payments";
import toUnicodeVariant from "../toUnicodeVariant";
import { useSelector } from "react-redux";
import { Button } from "react-native-elements";
import Accordion from "react-native-collapsible/Accordion";
import { TouchableOpacity } from "react-native";
import { hp, wp } from "../../helpers/common";
import { Colors } from "../../assets/colors/color";
import { MoveRight } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import GradientText from "../../commonComponents/GradientText";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import BottomSheet from "../BottomSheet";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const colorMapping = {
  Silver: ["#C0C0C0", "#E8E8E8", "#B8B8B8"],
  Gold: ["#FFD700", "#FDB931", "#A85F05"],
  Platinum: ["#304352", "#304352A1", "#d7d2cc", "#304352A1"],
};

const SubscriptionPlans = ({ plans }) => {
  const PLANS = plans;
  const [activeSections, setActiveSections] = useState([1]);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [paymentSharePopUp, setPaymentSharePopUp] = useState(false);
  const [payButtonLoading, setPayButtonLoading] = useState(false);
  const [shareButtonLoading, setShareButtonLoading] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("");

  const modalRef = useRef();

  useEffect(() => {
    // openRenewModal();
    checkForRenew();
    setButtonTitle(getTitle());
  }, []);

  const openRenewModal = () => {
    modalRef.current.present();
  };

  const closeRenewModal = () => {
    modalRef.current.dismiss();
  };

  const checkForRenew = () => {
    const membershipType = membership.membershipType;
    const membershipEndDate = membership.membershipEndDate;
    const currentTime = new Date().getTime();
    const diff = membershipEndDate - currentTime;

    if (membershipType == "Free") return;
    if (
      (membershipType == "Silver" ||
        membershipType == "Gold" ||
        membershipType == "Platinum") &&
      diff < 60 * 24 * 60 * 60 * 1000
    ) {
      openRenewModal();
    }
  };

  const navigation = useNavigation();

  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);

  const getTitle = () => {
    if (membership.membershipType == "Free") {
      return "Join now";
    }
    return "Upgrade now";
  };

  const phonePe = async (type, plan, paymentType) => {
    const _callback = () => {
      setPayButtonLoading(false);
      setPaymentSharePopUp(false);
      setShareButtonLoading(false);
      navigation.navigate("PaymentSuccessful", {
        type: "",
        navigateTo: "",
      });
    };

    const _errorHandler = () => {
      setPayButtonLoading(false);
      setPaymentSharePopUp(false);
      setShareButtonLoading(false);
      navigation.navigate("PaymentFailed", {
        type: "",
        navigateTo: "",
      });
    };

    if (type == "share") {
      setShareButtonLoading(true);
      phonepe_payments
        .phonePeShare(
          profile.phoneNumber,
          Number.parseInt(plan.subscriptionFees),
          _errorHandler,
          paymentType,
          null,
          null,
          plan.id
        )
        .then((link) => {
          //prettier-ignore
          const message = `Hello from the GoHappy Club Family,
${toUnicodeVariant(profile.name,"italic")} is requesting a payment of ₹${toUnicodeVariant(String(plan.subscriptionFees),"bold")} for GoHappy Club Membership.
Please make the payment using the link below:
${link}
${toUnicodeVariant("Note:","bold")} The link will expire in 20 minutes.
    `;
          Share.share({
            message: message,
          })
            .then((result) => {
              setPaymentSharePopUp(false);
              setShareButtonLoading(false);
            })
            .catch((errorMsg) => {
              console.log("error in sharing", errorMsg);
              setPaymentSharePopUp(false);
              setShareButtonLoading(false);
            });
        });
    } else {
      setPayButtonLoading(true);
      phonepe_payments.phonePe(
        profile.phoneNumber,
        plan.subscriptionFees,
        _callback,
        _errorHandler,
        paymentType,
        null,
        null,
        plan.id
      );
    }
  };

  const handleBuyPlan = async (type, plan) => {
    phonePe(type, plan, "subscription");
  };

  const handleUpgradePlan = async (type, plan) => {
    // handle upgrade plan logic
    phonePe(type, plan, "upgrade");
  };

  const handleRenewPlan = async (type, plan) => {
    //handle renew plan logic
    phonePe(type, plan, "renewal");
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
        delayPressIn={150}
        activeOpacity={0.8}
        onPress={() => handleSectionChange([index])}
        style={[
          styles.headerContainer,
          { marginBottom: isSelected ? 0 : hp(2) },
          {
            borderBottomLeftRadius: isSelected ? 0 : 8,
            borderBottomRightRadius: isSelected ? 0 : 8,
          },
        ]}
      >
        <AnimatedLinearGradient
          colors={
            isSelected
              ? colorMapping[selectedPlan?.membershipType]
              : [Colors.referLinkBackground, Colors.referLinkBackground]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientContainer]}
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
    // make each features list
    const features = {
      Silver: [
        {
          name: "Feature - 1",
          available: true,
        },
        {
          name: "Feature - 2",
          available: true,
        },
        {
          name: "Feature - 3",
          available: false,
        },
        {
          name: "Feature - 4",
          available: false,
        },
      ],
      Gold: [
        {
          name: "Feature - 1",
          available: true,
        },
        {
          name: "Feature - 2",
          available: true,
        },
        {
          name: "Feature - 3",
          available: true,
        },
        {
          name: "Feature - 4",
          available: false,
        },
      ],
      Platinum: [
        {
          name: "Feature - 1",
          available: true,
        },
        {
          name: "Feature - 2",
          available: true,
        },
        {
          name: "Feature - 3",
          available: true,
        },
        {
          name: "Feature - 4",
          available: true,
        },
      ],
    };

    return (
      <View
        style={[
          styles.contentContainer,
          {
            marginBottom: isSelected ? hp(2) : 0,
          },
        ]}
      >
        {features[selectedPlan?.membershipType].map((feature, index) => (
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
                backgroundColor:
                  membership.membershipType == selectedPlan?.membershipType
                    ? Colors.grey.c
                    : Colors.referLinkBackground,
                padding: 10,
                borderRadius: 6,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={() => setPaymentSharePopUp(true)}
            disabled={membership.membershipType == selectedPlan?.membershipType}
          >
            <View
              style={{
                flexDirection: "row",
                gap: wp(3),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.footerButtonText,
                  {
                    color:
                      membership.membershipType == selectedPlan?.membershipType
                        ? Colors.grey.f0
                        : Colors.black,
                  },
                ]}
              >
                {getTitle()}
              </Text>
              <MoveRight size={24} color={Colors.black} />
            </View>
          </Pressable>
        </View>
      </>
      <BottomSheet modalRef={modalRef} closeModal={closeRenewModal} />

      {paymentSharePopUp && (
        <AwesomeAlert
          show={paymentSharePopUp}
          showProgress={false}
          closeOnTouchOutside={
            payButtonLoading || shareButtonLoading ? false : true
          }
          customView={
            <View style={styles.AAcontainer}>
              <Text style={styles.AAtitle}>Payment Confirmation</Text>
              <Text style={styles.AAmessage}>
                Would you like to pay this yourself or share the payment link
                with a family member?
              </Text>
              <View style={styles.AAbuttonContainer}>
                <Button
                  outline
                  title={"Pay Now"}
                  loading={payButtonLoading}
                  buttonStyle={[styles.AApayButton, styles.AAbutton]}
                  onPress={() => {
                    if (buttonTitle == "Join now")
                      handleBuyPlan("self", selectedPlan);
                    else if (buttonTitle == "Upgrade now")
                      handleUpgradePlan("self", selectedPlan);
                  }}
                  disabled={payButtonLoading}
                  loadingStyle={{
                    color: Colors.black,
                  }}
                />
                <Button
                  outline
                  title={"Share"}
                  loading={shareButtonLoading}
                  buttonStyle={[styles.AAshareButton, styles.AAbutton]}
                  onPress={() => {
                    if (buttonTitle == "Join now")
                      handleBuyPlan("share", selectedPlan);
                    else if (buttonTitle == "Upgrade now")
                      handleUpgradePlan("share", selectedPlan);
                  }}
                  disabled={shareButtonLoading}
                />
              </View>
            </View>
          }
          onDismiss={() => setPaymentSharePopUp(false)}
        />
      )}
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
    // elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 1,
  },
  gradientContainer: {
    padding: 15,
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
    color: Colors.black,
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
  AAcontainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  AAtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.grey.grey,
  },
  AAmessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.grey.grey,
  },
  AAbuttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  AAbutton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 100,
  },
  AApayButton: {
    backgroundColor: Colors.primary,
  },
  AAshareButton: {
    backgroundColor: Colors.grey.grey,
  },
  AAbuttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
