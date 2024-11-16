import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Colors } from "../assets/colors/color";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { hp, wp } from "../helpers/common";
import { MaterialIndicator } from "react-native-indicators";
import { formatDate, getRandomColor } from "./Rewards";

const screenWidth = Dimensions.get("window").width;

const VoucherBottomSheet = ({
  modalRef,
  closeModal,
  vouchers,
  children,
  showVouchers,
  voucherLoading,
  title,
  selectedVoucher,
  setSelectedVoucher,
}) => {
  const [selectedVoucherL, setSelectedVoucherL] = useState(null);

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

  const snapPoints = React.useMemo(
    () => [title.toLowerCase().startsWith("book") ? "13%" : "8%", "60%"],
    [title]
  );

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucherL(voucher);
  };
  const handleApplyVoucher = () => {
    setSelectedVoucher(selectedVoucherL);
    closeModal();
  };

  return (
    <BottomSheet
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      handleStyle={{ display: "none" }}
      backdropComponent={showVouchers ? renderBackdrop : null}
      enableContentPanningGesture={showVouchers}
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
      <View style={styles.container}>
        <BottomSheetScrollView contentContainerStyle={styles.scrollViewContent}>
          {!showVouchers && (
            <View style={styles.childrenContainer}>{children}</View>
          )}
          {showVouchers && (
            <View style={styles.vouchersContainer}>
              {voucherLoading && (
                <View style={styles.loadingContainer}>
                  <MaterialIndicator color="black" size={26} />
                </View>
              )}
              {!voucherLoading && (
                <>
                  {vouchers.map((voucher) => (
                    <VouchersCard
                      key={voucher.id}
                      id={voucher.id}
                      voucher={voucher}
                      onPress={() => handleVoucherSelect(voucher)}
                      isSelected={selectedVoucherL?.id === voucher.id}
                    />
                  ))}
                  {vouchers.length < 1 && (
                    <View style={styles.loadingContainer}>
                      <Text>Sorry, You don't have any vouchers.</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </BottomSheetScrollView>
        {showVouchers && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.applyButton,
                !selectedVoucherL && styles.applyButtonDisabled,
              ]}
              onPress={handleApplyVoucher}
              disabled={!selectedVoucherL}
            >
              <Text style={styles.applyButtonText}>Apply Voucher</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

const VouchersCard = ({ voucher, id, onPress, isSelected, color }) => {
  return (
    <TouchableOpacity
      style={[styles.voucherCard]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={voucher.status != "ACTIVE"}
    >
      <View
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          zIndex: 1,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {voucher.status == "ACTIVE"
            ? ""
            : voucher.status == "REDEEMED"
            ? "REDEEMED"
            : "EXPIRED"}
        </Text>
      </View>
      <View
        style={[
          styles.borderedContainer,
          {
            backgroundColor: isSelected
              ? Colors.primary
              : voucher.status == "ACTIVE"
              ? "white"
              : "#666",
            borderColor: isSelected ? Colors.white : "#e0e0e0",
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        <View style={styles.topSection}>
          <Image
            source={{
              uri: voucher.image,
            }}
            style={styles.logoImage}
          />
        </View>
        <View style={styles.dashedLine} />
        <View style={styles.titleSection}>
          <Text style={styles.amount}>
            {voucher.value != null
              ? `₹${voucher.value}`
              : `${voucher.percent}% OFF`}
          </Text>
          <Text style={styles.cardTitle}>{voucher.title}</Text>
          <Text style={styles.validityText}>
            Valid until {formatDate(voucher.expiryDate)}
          </Text>
        </View>
      </View>
      <View style={[styles.cutoutLeft, { backgroundColor: Colors.beige }]} />
      <View style={[styles.cutoutRight, { backgroundColor: Colors.beige }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: hp(10),
  },
  childrenContainer: {
    flex: 1,
  },
  vouchersContainer: {
    paddingHorizontal: wp(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: hp(20),
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp(4),
    backgroundColor: Colors.beige,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  applyButton: {
    backgroundColor: Colors.primary,
    padding: hp(2),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.7,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "bold",
    fontFamily: "NunitoSans-Bold",
  },
  voucherCard: {
    width: "90%",
    height: hp(16),
    marginVertical: hp(1),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  borderedContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "start",
    alignItems: "center",
    flexDirection: "row",
    padding: wp(1),
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "22%",
    paddingVertical: hp(1),
    marginLeft: 10,
  },
  logoImage: {
    width: wp(18),
    height: hp(8),
  },
  titleSection: {
    alignItems: "start",
    width: "100%",
    paddingVertical: hp(1),
    flex: 1,
  },
  amount: {
    fontSize: wp(8),
    fontWeight: "bold",
    color: "#000",
    fontFamily: "NunitoSans-SemiBold",
  },
  cardTitle: {
    fontSize: wp(4.5),
    color: "#000",
    fontFamily: "NunitoSans-SemiBold",
    width: "80%",
  },
  validityText: {
    fontSize: wp(3.5),
    color: "#888",
    fontFamily: "NunitoSans-Regular",
  },
  dashedLine: {
    borderColor: "#666",
    height: "100%",
    borderLeftWidth: 1,
    borderStyle: "dashed",
    marginLeft: wp(2),
    marginRight: wp(4),
  },
  cutoutLeft: {
    position: "absolute",
    left: -15,
    top: "50%",
    width: 30,
    height: 30,
    borderRadius: 15,
    transform: [{ translateY: -15 }],
  },
  cutoutRight: {
    position: "absolute",
    right: -15,
    top: "50%",
    width: 30,
    height: 30,
    borderRadius: 15,
    transform: [{ translateY: -15 }],
  },
});

export default VoucherBottomSheet;
