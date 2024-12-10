import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useRoute } from "@react-navigation/native";
import { BlurView } from "@react-native-community/blur";
import { hp, wp } from "../helpers/common";
import { ScratchCard } from "rn-scratch-card";

const VoucherScratch = () => {
  const [scratchPercent, setScratchPercent] = useState(0);
  const route = useRoute();
  const { id, color, icon, amount, title, setScratchTrue } = route.params;

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
          {title && <Text style={styles.cardTitle}>{title}</Text>}
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
              source={require("../images/scratch_foreground.png")}
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
          backgroundColor: "rgba(0,0,0,0.5)",
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
