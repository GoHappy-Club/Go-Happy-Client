import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import { Colors } from "../assets/colors/color";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";

const { width, height } = Dimensions.get("window");

const BottomSheet = ({ modalRef, closeModal }) => {
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={["50%"]}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      enableGestureInteraction={true}
      handleStyle={{ display: "none" }}
      backgroundStyle={{ borderRadius: 40, backgroundColor: Colors.green }}
      backdropComponent={customBackdrop}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 15,
              right: 20,
              padding: 6,
              backgroundColor: Colors.grey.f0,
              borderRadius: 40,
            }}
            onPress={closeModal}
          >
            <X color="#000" size={24} />
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const customBackdrop = ({ animatedIndex }) => {
  const continerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });
  const containerStyle = [StyleSheet.absoluteFill, continerAnimatedStyle];
  return (
    <Animated.View style={containerStyle}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurAmount={1}
        blurType="regular"
      />
    </Animated.View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
