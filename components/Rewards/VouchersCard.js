import PropTypes from "prop-types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";

import { Colors } from "../../assets/colors/color";
import { wp } from "../../helpers/common";
import Coins from "../../images/coins.png";

const VouchersCard = ({ voucher, onPress, styles, formatDate }) => {
  return (
    <TouchableOpacity style={[styles.voucherCard]} onPress={onPress}>
      {voucher.status != "ACTIVE" && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
            backgroundColor: "black",
            paddingHorizontal: wp(1),
            paddingVertical: wp(0.5),
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {voucher.status == "ACTIVE" ? "" : voucher.status}
          </Text>
        </View>
      )}
      <Animated.View
        style={[
          styles.borderedContainer,
          {
            backgroundColor:
              voucher.status == "ACTIVE" ? Colors.beige : Colors.grey.d,
          },
        ]}
      >
        <View style={styles.topSection}>
          <Animated.Image
            source={{
              uri: voucher.image,
            }}
            style={styles.logoImage}
          />
        </View>
        <View
          style={{
            borderColor: "#666",
            height: "100%",
            borderLeftWidth: 1,
            borderStyle: "dashed",
            marginLeft: wp(2),
            marginRight: wp(4),
          }}
        />
        <Animated.View style={styles.titleSection}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            {voucher?.value != null && (
              <FastImage
                source={Coins}
                style={{
                  width: wp(8),
                  aspectRatio: 1,
                }}
              />
            )}
            <Animated.Text style={styles.amount}>
              {voucher?.value != null
                ? `${voucher?.value}`
                : `${voucher?.percent}% OFF`}
            </Animated.Text>
          </View>
          <Animated.Text style={styles.cardTitle}>
            {voucher.title}
          </Animated.Text>
          <Animated.Text style={styles.validityText}>
            {voucher.status == "ACTIVE"
              ? "Valid until"
              : `${
                  voucher?.status?.charAt(0) +
                  voucher.status.slice(1).toLowerCase()
                } on`}{" "}
            {voucher.status == "REDEEMED"
              ? formatDate(voucher?.redemptionTime)
              : formatDate(
                  Math.min(voucher.expiryDate, voucher.parentExpiryDate),
                )}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
      <View style={styles.cutoutLeft} />
      <View style={styles.cutoutRight} />
    </TouchableOpacity>
  );
};

VouchersCard.propTypes = {
  voucher: PropTypes.object,
  onPress: PropTypes.func,
  styles: PropTypes.object,
  formatDate: PropTypes.func,
};

export default VouchersCard;
