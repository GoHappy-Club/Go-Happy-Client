import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { hp, wp } from "../../helpers/common";
import FastImage from "react-native-fast-image";

const RewardsCard = ({
  id,
  icon,
  amount,
  title,
  color,
  scratched,
  navigation,
  setScratchedTrue,
  styles,
}) => {
  return (
    <>
      {!scratched && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.card, { backgroundColor: color }]}
          onPress={() => {
            try {
              navigation.navigate("VoucherScratch", {
                id: id,
                amount: amount,
                title: title,
                color: color,
                icon: icon,
                setScratchTrue: (id, amount) => {
                  setScratchedTrue(id, amount);
                },
              });
            } catch (error) {
              console.log("Error in navigation from voucher", error);
            }
          }}
        >
          <FastImage
            source={require("../../images/scratch_foreground.png")}
            style={styles.card}
          />
        </TouchableOpacity>
      )}
      {scratched && (
        <View style={[styles.card, { backgroundColor: color }]}>
          <View
            style={{
              position: "absolute",
              width: "100%",
              backgroundColor: "transparent",
              alignItems: "center",
              borderRadius: 16,
            }}
          >
            <FontAwesomeIcon
              size={34}
              icon={icon}
              color="black"
              style={styles.icon}
            />
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
              }}
            >
              <FastImage
                source={require("../../images/coins.png")}
                style={{
                  height: wp(8),
                  width: wp(8),
                }}
              />
              {amount && <Text style={styles.amount}>{amount}</Text>}
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default RewardsCard;
