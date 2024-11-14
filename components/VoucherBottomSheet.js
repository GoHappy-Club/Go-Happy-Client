import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback } from "react";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Colors } from "../assets/colors/color";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { X } from "lucide-react-native";
import { hp } from "../helpers/common";
import { MaterialIndicator } from "react-native-indicators";
import { VouchersCard } from "./Rewards";

const screenWidth = Dimensions.get("window").width;

const VoucherBottomSheet = ({
  modalRef,
  closeModal,
  vouchers,
  children,
  showVouchers,
  voucherLoading,
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
    <BottomSheet
      ref={modalRef}
      index={0}
      snapPoints={["13%", "80%"]}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      handleStyle={{ display: "none" }}
      backdropComponent={showVouchers ? renderBackdrop : null}
      enableContentPanningGesture={showVouchers ? true : false}
      backgroundStyle={{
        borderRadius: 40,
        backgroundColor: Colors.beige,
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
      <BottomSheetScrollView style={{ flex: 1, height: "100%" }}>
        {/* {showVouchers && (
          <TouchableOpacity
            onPress={() => {
              closeModal();
            }}
            style={{
              position: "absolute",
              top: hp(2),
              right: 20,
              padding: 6,
              backgroundColor: Colors.grey.f0,
              borderRadius: 40,
            }}
          >
            <X color="#000" size={24} />
          </TouchableOpacity>
        )} */}
        <View style={{ flex: 1 }}>{!showVouchers && children}</View>
        {voucherLoading && (
          <MaterialIndicator
            color="black"
            size={26}
            style={{
              position: "absolute",
              top: "50%",
              alignSelf: "center",
            }}
          />
        )}
        <View style={{ flex: 1, marginTop: screenWidth * 0.1 }}>
          <ScrollView
            contentContainerStyle={[
              styles.grid,
              {
                height: showVouchers ? "100%" : "auto",
              },
            ]}
            // style={{ flex: 1 }}
          >
            {!voucherLoading &&
              showVouchers &&
              vouchers.length > 0 &&
              vouchers.map((voucher, index) => (
                <VouchersCard
                  id={voucher.id}
                  image={voucher.image}
                  title={voucher.title}
                  key={voucher.id}
                  onPress={() => {}}
                />
              ))}
          </ScrollView>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default VoucherBottomSheet;

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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    width: "100%",
    top: hp(5),
  },
});
