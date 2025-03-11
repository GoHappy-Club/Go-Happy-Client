import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "@react-native-community/blur";
import { X } from "lucide-react-native";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Colors } from "../../assets/colors/color";
import ReferralsList from "./ReferralsList";

const screenWidth = Dimensions.get("window").width;

const ReferBottomSheet = ({
  modalRef,
  closeModal,
  type,
  numberReferrals,
  referrals,
  trivialTitle1,
  trivialTitle2,
}) => {
  const { t } = useTranslation();
  const renderBackdrop = useCallback(
    ({ animatedIndex }) => {
      const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
          animatedIndex.value,
          [-1, 0],
          [0, 1],
          Extrapolation.CLAMP,
        ),
      }));

      const containerStyle = [StyleSheet.absoluteFill, containerAnimatedStyle];

      if (Platform.OS === "ios") {
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
      }

      return (
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            containerAnimatedStyle,
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeModal}
            activeOpacity={1}
          />
        </Animated.View>
      );
    },
    [closeModal],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["50%", "80%"]}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      handleStyle={{ display: "none" }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        borderRadius: 40,
        backgroundColor: Colors.background,
        shadowColor: "#000",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 20,
      }}
      onChange={(index) => {
        if (index === -1) {
          closeModal();
        }
      }}
    >
      {type == "conditionsDialog" && (
        <BottomSheetView style={{ flex: 1, justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => {
              closeModal();
            }}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              padding: 6,
              backgroundColor: Colors.grey.f0,
              borderRadius: 40,
            }}
          >
            <X color="#000" size={24} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              maxWidth: screenWidth * 0.9,
              marginTop: screenWidth * 0.1,
            }}
          >
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.header}>
                <Text style={styles.bold}>{t("follow_simple_steps")}</Text>
              </Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}> {t("step_1")}</Text>
                <Text style={styles.listItem}> {t("step_2")}</Text>
                <Text style={styles.listItem}> {t("step_3")}</Text>
                <Text style={styles.listItem}> {t("step_4")}</Text>
              </View>
            </ScrollView>
          </View>
        </BottomSheetView>
      )}
      {type == "referralsList" && (
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          style={{
            flex: 1,
            backgroundColor: Colors.background,
            borderRadius: 40,
          }}
        >
          <TouchableOpacity
            onPress={closeModal}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: 6,
              backgroundColor: Colors.grey.f0,
              borderRadius: 40,
            }}
          >
            <X color="#000" size={24} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginTop: screenWidth * 0.1 }}>
            <ReferralsList
              numberReferrals={numberReferrals}
              referrals={referrals}
              trivialTitle1={trivialTitle1}
              trivialTitle2={trivialTitle2}
            />
          </View>
        </BottomSheetScrollView>
      )}
    </BottomSheetModal>
  );
};

ReferBottomSheet.propTypes = {
  closeModal: PropTypes.func,
  modalRef: PropTypes.object,
  type: PropTypes.string,
  numberReferrals: PropTypes.number,
  referrals: PropTypes.array,
  trivialTitle1: PropTypes.string,
  trivialTitle2: PropTypes.string,
};

export default ReferBottomSheet;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    fontSize: 18,
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});
