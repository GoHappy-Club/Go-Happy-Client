import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { X, Heart, CheckCircle, Star } from "lucide-react-native";
import { Colors } from "../../assets/colors/color";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { FreeTrialContent } from "./BottomSheetContents";

const { width, height } = Dimensions.get("window");


const BottomSheet = ({ modalRef, closeModal, type,cta }) => {
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
      snapPoints={["50%"]}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      enableGestureInteraction={true}
      handleStyle={{ display: "none" }}
      backgroundStyle={{ borderRadius: 40, backgroundColor: Colors.white }}
      backdropComponent={renderBackdrop}
      onChange={(index) => {
        if (index === -1) {
          closeModal();
        }
      }}
    >
      <BottomSheetView style={{ flex: 1, justifyContent: "space-between" }}>
        {type == "FreeTrial" && <FreeTrialContent cta={cta} />}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
