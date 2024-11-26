import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback } from "react";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Colors } from "../../assets/colors/color";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import ReferralsList from "./ReferralsList";
import { X } from "lucide-react-native";
import { hp } from "../../helpers/common";

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

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["50%","80%"]}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      handleStyle={{ display: "none" }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        borderRadius: 40,
        backgroundColor: Colors.white,
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
                <Text style={styles.bold}>Follow these simple steps:</Text>
              </Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>
                  1. Share the referral link with your friends who are above 50
                  years of age.
                </Text>
                <Text style={styles.listItem}>
                  2. Ask them to click on the link, install the GoHappy Club app
                  and register themselves in the app.
                </Text>
                <Text style={styles.listItem}>
                  3. Once registered, ask them to book and attend any session
                  they want.
                </Text>
                <Text style={styles.listItem}>
                  4. Receive Thank You Gift{" "}
                  from GoHappy Club delivered to your home once you have seven
                  successful referrals.
                </Text>
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
          }}
          style={{
            flex: 1,
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
    fontSize: 18
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});
