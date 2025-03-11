import { useNavigation, useRoute } from "@react-navigation/native";
import { differenceInMonths } from "date-fns";
import { MoveRight, Star } from "lucide-react-native";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { Button } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  FadeInUp,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-simple-toast";
import { useSelector } from "react-redux";

import { Colors } from "../../assets/colors/color";
import GradientText from "../../commonComponents/GradientText";
import { hp, wp } from "../../helpers/common";
import BottomSheet from "../CustomBottomSheet/BottomSheet";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const colorMapping = {
  Silver: {
    gradient: ["#A9A9A9", "#C0C0C0", "#808080"],
    borderColor: "#C0C0C0",
    textColor: Colors.primaryText,
  },
  Gold: {
    gradient: ["#FFD700", "#FDB931", "#A85F05"],
    borderColor: "#A85F05",
    textColor: Colors.primaryText,
  },
  Platinum: {
    gradient: ["#304352", "#304352A1", "#304352A1"],
    borderColor: "#304352",
    textColor: Colors.primaryText,
  },
};

const CARD_MARGIN = 8;

const SubscriptionCard = ({ membershipPlans, isSelected, onSelect, t }) => {
  const [selectedDuration, setSelectedDuration] = useState(
    membershipPlans && membershipPlans[0]?.duration,
  );
  const shakeOffset = useSharedValue(0);

  const selectedPlan = useMemo(() => {
    return membershipPlans?.find((plan) => plan.duration === selectedDuration);
  }, [membershipPlans, selectedDuration]);

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    const newSelectedPlan = membershipPlans.find(
      (plan) => plan.duration === duration,
    );
    onSelect(newSelectedPlan);
  };

  useEffect(() => {
    if (isSelected) {
      shakeOffset.value = withSequence(
        withTiming(-10, { duration: 200 }),
        withTiming(10, { duration: 200 }),
        withTiming(0, { duration: 200 }),
      );
    }
  }, [isSelected]);

  const monthlyPrice = selectedPlan?.subscriptionFees / selectedPlan?.duration;

  return (
    <TouchableOpacity
      onPress={() => onSelect(selectedPlan)}
      activeOpacity={0.8}
    >
      <AnimatedLinearGradient
        colors={colorMapping[selectedPlan?.membershipType]?.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          isSelected && {
            borderWidth: 2,
            borderColor:
              colorMapping[selectedPlan?.membershipType]["borderColor"],
          },
        ]}
      >
        <View style={styles.priceContainer}>
          <Text
            style={[
              styles.price,
              {
                color: colorMapping[selectedPlan?.membershipType]["textColor"],
              },
            ]}
          >
            ₹{selectedPlan.subscriptionFees}
          </Text>
          <Text
            style={[
              styles.monthlyPrice,
              {
                color: colorMapping[selectedPlan?.membershipType]["textColor"],
              },
            ]}
          >
            ≈ ₹{monthlyPrice.toFixed(2)}/month
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.featuresContainer}>
          {selectedPlan?.perks?.map((perk, index) => (
            <FeatureItem
              key={index}
              title={perk}
              highlight={true}
              textColor={
                colorMapping[selectedPlan?.membershipType]["textColor"]
              }
              t={t}
            />
          ))}
        </View>

        <View style={styles.durationsContainer}>
          <Text
            style={[
              styles.durationTitle,
              {
                color: colorMapping[selectedPlan?.membershipType]["textColor"],
              },
            ]}
          >
            Select Duration:
          </Text>
          <View style={styles.durationButtons}>
            {membershipPlans.map((plan) => (
              <DurationButton
                key={plan.duration}
                duration={plan.duration}
                isSelected={selectedDuration === plan.duration}
                onSelect={() => handleDurationSelect(plan.duration)}
                t={t}
              />
            ))}
          </View>
        </View>
      </AnimatedLinearGradient>
    </TouchableOpacity>
  );
};

const FeatureItem = ({ title, highlight, textColor }) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(300).damping(10).springify()}
      style={styles.featureRow}
    >
      <Star color={highlight ? "#FFD700" : textColor} size={16} />
      <Text style={[styles.featureTitle, { color: textColor }]}>{title}</Text>
    </Animated.View>
  );
};

const DurationButton = ({ duration, isSelected, onSelect }) => {
  const getDurationText = (duration) => {
    return `${duration} Months`;
  };
  return (
    <TouchableOpacity
      style={[
        styles.durationButton,
        isSelected && styles.selectedDurationButton,
      ]}
      onPress={onSelect}
    >
      <Text
        style={[
          styles.durationButtonText,
          isSelected && styles.selectedDurationButtonText,
        ]}
      >
        {getDurationText(duration)}
      </Text>
    </TouchableOpacity>
  );
};

const SubscriptionPlans = ({ plans }) => {
  const uniquePlans = Array.from(
    new Set(plans.map((plan) => plan.membershipType)),
  ).map((type) => plans.find((plan) => plan.membershipType === type));
  const [selectedPlan, setSelectedPlan] = useState(uniquePlans[1]);
  const [paymentSharePopUp, setPaymentSharePopUp] = useState(false);
  const [payButtonLoading, setPayButtonLoading] = useState(false);
  const [shareButtonLoading, setShareButtonLoading] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("");
  const [renew, setRenew] = useState(false);

  const modalRef = useRef();
  const scrollRef = useRef();

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params && route.params?.renew == true && plans?.length > 1) {
      setRenew(true);
      const stDate = new Date(Number(membership.membershipStartDate));
      const enDate = new Date(Number(membership.membershipEndDate));

      const durationOfMembership = differenceInMonths(enDate, stDate);
      const planFound = plans
        .filter((plan) => plan.duration == durationOfMembership)
        .filter((plan) => plan.membershipType == membership.membershipType);
      if (!planFound || planFound?.length < 1) {
        Toast.show("Membership not active anymore", Toast.LONG);
      } else if (planFound) {
        setSelectedPlan(planFound[0]);
        setPaymentSharePopUp(true);
      }
    }
  }, [route.params]);

  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        const scrollTo = wp(70) + CARD_MARGIN * 2;
        scrollRef.current.scrollTo({ x: scrollTo, y: 0, animated: true });
      }
    }, 100);
  }, []);

  const groupedPlans = useMemo(() => {
    const grouped = plans.reduce((acc, plan) => {
      if (!acc[plan.membershipType]) {
        acc[plan.membershipType] = [];
      }
      acc[plan.membershipType].push(plan);
      return acc;
    }, {});

    Object.keys(grouped).forEach((membershipType) => {
      grouped[membershipType].sort((a, b) => a.duration - b.duration);
    });

    return grouped;
  }, [plans]);

  useEffect(() => {
    // openRenewModal();
    // checkForRenew();
    setButtonTitle(getTitle());
  }, []);

  useEffect(() => {
    pricingHelper();
  }, [selectedPlan]);

  // const openRenewModal = () => {
  //   modalRef.current.present();
  // };

  const closeRenewModal = () => {
    modalRef.current.dismiss();
  };

  // const checkForRenew = () => {
  //   const membershipType = membership.membershipType;
  //   const membershipEndDate = membership.membershipEndDate;
  //   const currentTime = new Date().getTime();
  //   const diff = membershipEndDate - currentTime;

  //   if (membershipType == "Free") return;
  //   if (
  //     (membershipType == "Silver" ||
  //       membershipType == "Gold" ||
  //       membershipType == "Platinum") &&
  //     diff < 60 * 24 * 60 * 60 * 1000
  //   ) {
  //     openRenewModal();
  //   }
  // };

  const isDisabled = () => {
    const stDate = new Date(Number(membership.membershipStartDate));
    const enDate = new Date(Number(membership.membershipEndDate));

    const durationOfMembership = differenceInMonths(enDate, stDate);

    if (
      membership?.membershipType == selectedPlan?.membershipType &&
      durationOfMembership == selectedPlan.duration
    )
      return true;
  };

  const getTitle = () => {
    if (membership.membershipType == "Free" || membership.freeTrialActive) {
      return "Join now";
    }
    return "Upgrade now";
  };

  const paytringWrapper = async (share = false, type, plan, amount) => {
    const data = {
      phone: profile.phoneNumber,
      amount: amount,
      email:
        profile.email != null || profile.email != ""
          ? profile.email
          : "void@paytring.com",
      cname: profile.name,
      type: type,
      planId: plan?.id,
    };
    if (share) {
      setShareButtonLoading(true);
    } else {
      setPayButtonLoading(true);
    }
    try {
      const response = await globalThis.axios.post(
        `${globalThis.SERVER_URL}/paytring/createOrder`,
        data,
      );
      const orderData = response.data;
      setPayButtonLoading(false);
      setShareButtonLoading(false);
      setPaymentSharePopUp(false);
      if (share) {
        handlePaymentShare(orderData, amount);
      } else {
        navigation.navigate("PaytringView", {
          callback: () => {
            navigation.navigate("PaymentSuccessful", {
              type: "",
              navigateTo: "",
            });
          },
          error_handler: () => {
            navigation.navigate("PaymentFailed", {
              type: "",
              navigateTo: "",
            });
          },
          order_id: orderData?.order_id,
        });
      }
    } catch (error) {
      setPayButtonLoading(false);
      setShareButtonLoading(false);
      setPaymentSharePopUp(false);
      globalThis
        .crashlytics()
        .log(`Error in paytringWrapper SubscriptionPlans.js ${error}`);
    }
  };

  const handlePaymentShare = async (orderData, amount) => {
    try {
      Share.share({
        title: "GoHappy Payment Link",
        message: `Hey, ${profile.name} has requested an amount of ₹${amount} for joining GoHappyClub Membership. Click on the link to pay. \nhttps://api.paytring.com/pay/token/${orderData?.order_id}`,
      });
    } catch (error) {
      console.log("Error in sharing payment link : ", error);
      globalThis
        .crashlytics()
        .log(`Error in handlePaymentShare Contribution.js ${error}`);
    }
  };

  const handleBuyPlan = async (share = false, type, plan) => {
    paytringWrapper(share, type, plan, plan.subscriptionFees);
  };

  const handleUpgradePlan = async (share = false, type, plan) => {
    // handle upgrade plan logic
    paytringWrapper(share, type, plan, pricingHelper());
  };

  const handleRenewPlan = async (share = false, type, plan) => {
    paytringWrapper(share, type, plan, plan.subscriptionFees);
  };

  const pricingHelper = () => {
    let subsFees = selectedPlan?.subscriptionFees;
    if (isDisabled()) return "--";
    if (selectedPlan?.discount > 0) {
      subsFees = subsFees - (subsFees * selectedPlan?.discount) / 100;
    }
    if (
      membership.membershipType == "Free" ||
      membership.freeTrialActive == true
    ) {
      return subsFees;
    } else {
      return getRemainingMembershipValue(
        membership.membershipStartDate,
        membership.membershipEndDate,
      ) < subsFees
        ? subsFees -
            getRemainingMembershipValue(
              membership.membershipStartDate,
              membership.membershipEndDate,
            )
        : "101";
    }
  };

  const getCurrentMembershipFees = (duration) => {
    return plans
      .filter((plan) => plan.membershipType == membership.membershipType)
      .filter((plan) => plan.duration == Math.floor(duration));
  };

  const getRemainingMembershipValue = (
    membershipStartDate,
    membershipEndDate,
  ) => {
    const currentTime = new Date().getTime();
    const diff = currentTime - membershipStartDate;
    const duration = membershipEndDate - membershipStartDate;
    const subscriptionFees = getCurrentMembershipFees(
      duration / (30 * 24 * 60 * 60 * 1000),
    )[0]?.subscriptionFees;
    const usedValue = (diff / duration) * subscriptionFees;
    return Math.round(subscriptionFees - usedValue);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    let index = 0;
    uniquePlans.map((item, _index) => {
      if (plan.id == item.id) index = _index;
    });
    const scrollTo = (wp(70) + CARD_MARGIN * 2) * index;
    scrollRef.current.scrollTo({ x: scrollTo, y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={[styles.heading]}>Choose Your Plan</Text>
      <ScrollView
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={wp(30) + CARD_MARGIN * 2}
      >
        <View style={styles.container}>
          {Object.entries(groupedPlans).map(
            ([membershipType, membershipPlans]) => (
              <SubscriptionCard
                key={membershipType}
                membershipPlans={membershipPlans}
                isSelected={selectedPlan?.membershipType === membershipType}
                onSelect={handleSelectPlan}
                t={t}
              />
            ),
          )}
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
                  colors={colorMapping[selectedPlan?.membershipType]?.gradient}
                  style={styles.footerTitleText}
                />
                <View
                  style={{
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.pricingTitleText}>
                    {/* {buttonTitle == "Upgrade now"
                      ? `₹ ${pricingHelper()}`
                      : `₹ ${selectedPlan?.subscriptionFees}`} */}
                    ₹ {pricingHelper()}
                  </Text>
                  {pricingHelper() < selectedPlan?.subscriptionFees && (
                    <Text style={styles.discountText}>
                      ₹ {selectedPlan?.subscriptionFees}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
              {
                backgroundColor: isDisabled() ? Colors.grey.c : Colors.primary,

                padding: 10,
                borderRadius: 6,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={() => setPaymentSharePopUp(true)}
            disabled={isDisabled()}
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
                    color: isDisabled()
                      ? Colors.grey.countdown
                      : Colors.primaryText,
                  },
                ]}
              >
                {getTitle()}
              </Text>
              <MoveRight
                size={24}
                color={isDisabled() ? Colors.grey.countdown : Colors.black}
              />
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
              <Text style={styles.AAtitle}>{t("payment_confirmation")}</Text>
              <Text style={styles.AAmessage}>{t("below_to_pay")}</Text>{" "}
              <View style={styles.AAbuttonContainer}>
                <Button
                  outline
                  title={t("pay_now")}
                  loading={payButtonLoading}
                  buttonStyle={[styles.AApayButton, styles.AAbutton]}
                  onPress={() => {
                    if (renew) {
                      handleRenewPlan("renewal", selectedPlan);
                      return;
                    } else if (buttonTitle == "Join now")
                      handleBuyPlan("subscription", selectedPlan);
                    else if (buttonTitle == "Upgrade now")
                      handleUpgradePlan("upgrade", selectedPlan);
                  }}
                  disabled={payButtonLoading || shareButtonLoading}
                  loadingStyle={{
                    color: Colors.black,
                  }}
                  titleStyle={{
                    color: Colors.primaryText,
                  }}
                />
                <Button
                  outline
                  title={t("share")}
                  loading={shareButtonLoading}
                  buttonStyle={[styles.AAshareButton, styles.AAbutton]}
                  onPress={() => {
                    if (renew) {
                      handleRenewPlan(true, "renewal", selectedPlan);
                      return;
                    } else if (buttonTitle == "Join now")
                      handleBuyPlan(true, "subscription", selectedPlan);
                    else if (buttonTitle == "Upgrade now")
                      handleUpgradePlan(true, "upgrade", selectedPlan);
                  }}
                  disabled={shareButtonLoading || payButtonLoading}
                />
              </View>
            </View>
          }
          onDismiss={() => {
            setPaymentSharePopUp(false);
            setRenew(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

SubscriptionCard.propTypes = {
  membershipPlans: PropTypes.array,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  t: PropTypes.func,
};

FeatureItem.propTypes = {
  title: PropTypes.string.isRequired,
  highlight: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
};

DurationButton.propTypes = {
  duration: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

SubscriptionPlans.propTypes = {
  plans: PropTypes.array.isRequired,
};

export default SubscriptionPlans;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? hp(4) : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    flexDirection: "row",
  },
  heading: {
    fontSize: wp(8),
    fontWeight: "bold",
    textAlign: "center",
    // marginTop: 20,
    color: "#1a1a1a",
    fontFamily: "NunitoSans-SemiBold",
    marginBottom: Platform.OS === "android" ? hp(4) : hp(2),
  },

  scrollContent: {
    paddingHorizontal: wp(10),
    // paddingVertical: 10,
  },
  card: {
    width: wp(70),
    marginHorizontal: CARD_MARGIN,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    backdropFilter: "blur(12px)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  duration: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  monthlyPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  featuresContainer: {
    gap: 0,
  },
  featureTitle: {
    fontSize: 14,
    color: "#666",
  },
  featureValue: {
    fontSize: hp(2),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  highlightedValue: {
    color: "#00A86B",
  },
  selectedPlanContainer: {
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  durationsContainer: {
    position: "absolute",
    bottom: 15,
    left: 20,
  },
  durationTitle: {
    fontSize: 14,
    fontWeight: "500",
    // color: "#666",
    marginBottom: 8,
  },
  durationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  selectedDurationButton: {
    backgroundColor: Colors.primary,
  },
  footerContainer: {
    marginTop: "2%",
    backgroundColor: Colors.bottomNavigation,
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
    fontSize: 18,
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
  discountText: {
    fontSize: hp(2),
    color: Colors.lowOpacityBlack,
    fontWeight: "300",
    textDecorationLine: "line-through",
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
    paddingVertical: 6,
    alignItems: "center",
    gap: wp(1),
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  durationButtonText: {
    fontSize: 14,
    color: "#4b5563",
  },
  durationButtonTextSelected: {
    color: "#ffffff",
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
