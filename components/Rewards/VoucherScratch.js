import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScratchCard } from "rn-scratch-card";

import { hp, wp } from "../../helpers/common";
import ScratchForeground from "../../images/scratch_foreground.png";

const VoucherScratch = () => {
  const [scratchPercent, setScratchPercent] = useState(0);
  const route = useRoute();
  const { id, color, icon, amount, setScratchTrue } = route.params;

  useEffect(() => {
    if (scratchPercent > 55) setScratchTrue(id, amount);
  }, [scratchPercent]);

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: color }]}>
          <FontAwesomeIcon
            size={54}
            icon={icon}
            color="black"
            style={styles.icon}
          />
          {amount && <Text style={styles.amount}>₹{amount}</Text>}
        </View>
        {scratchPercent < 55 && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              backgroundColor: "transparent",
              alignItems: "center",
              borderRadius: 16,
              zIndex: 10,
            }}
          >
            <ScratchCard
              source={ScratchForeground}
              brushWidth={100}
              onScratch={(e) => {
                console.log("Scratched", e);
                setScratchPercent(e);
              }}
              style={styles.scratch_card}
            />
          </View>
        )}
      </View>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: -10000,
        }}
      />
    </>
  );
};

export default VoucherScratch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: wp(80),
    height: wp(80),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  scratch_card: {
    backgroundColor: "transparent",
    width: wp(80),
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 3,
  },
  amount: {
    fontSize: wp(8),
    fontWeight: "bold",
    color: "#000",
    fontFamily: "NunitoSans-SemiBold",
  },
  titleSection: {
    alignItems: "start",
    width: "100%",
    paddingVertical: hp(1),
    flex: 1,
  },
});
