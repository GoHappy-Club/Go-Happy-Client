import { faGift, faTrophy } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Colors } from "../../assets/colors/color";
import { hp, wp } from "../../helpers/common";
import { setMembership } from "../../redux/actions/counts";
import { getRandomColor } from "./Rewards";
import RewardsCard from "./RewardsCard";

const CoinbackRewards = ({
  rewards,
  navigation,
  profile,
  dispatch,
  membership,
  setAmount,
  styles,
}) => {
  const [fixedRewards, setFixedRewards] = useState([]);

  useEffect(() => {
    const rewardsWithColor = rewards
      .map((item) => ({
        ...item,
        color: item.color || getRandomColor(),
      }))
      .sort((a, b) => {
        // Sort so that items with scratched: false come first
        if (a.scratched === false && b.scratched !== false) return -1;
        if (a.scratched !== false && b.scratched === false) return 1;
        return 0;
      });

    setFixedRewards(rewardsWithColor);
  }, [rewards]);

  const setScratchedTrue = async (id, amount) => {
    const updatedRewards = fixedRewards.map((reward) => {
      if (reward.id === id) {
        return { ...reward, scratched: true };
      }
      return reward;
    });
    setFixedRewards(updatedRewards);
    setAmount(
      updatedRewards
        .filter((item) => item.scratched == true)
        .reduce((_acc, item) => _acc + item.amount, 0),
    );
    await saveScratchInBackend(id, amount);
  };

  const saveScratchInBackend = async (id, amount) => {
    try {
      await globalThis.axios.post(
        `${globalThis.SERVER_URL}/membership/scratchCardReward`,
        {
          phone: profile.phoneNumber,
          coinTransactionId: id,
        },
      );
      dispatch(
        setMembership({
          ...membership,
          coins: Number.parseInt(membership.coins) + amount,
        }),
      );
    } catch (error) {
      globalThis.crashlytics().log(`Error in saveScratchInBackend: ${error}`);
      console.log("error in saving==>", error);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: rewards.length == 1 ? "flex-start" : "center",
      }}
    >
      {rewards?.length == 0 && (
        <View
          style={{
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text
            style={{
              color: Colors.greyishText,
              fontSize: wp(4),
              fontWeight: "bold",
              textAlign: "center",
              marginTop: hp(10),
            }}
          >
            You don&apos;t have any reward yet.
          </Text>
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {fixedRewards.map((item, index) => (
          <RewardsCard
            id={item.id}
            key={index}
            icon={item.source == "coinback" ? faGift : faTrophy}
            amount={item.amount}
            title={item.title}
            color={item.color}
            scratched={item.scratched}
            navigation={navigation}
            setScratchedTrue={setScratchedTrue}
            styles={styles}
          />
        ))}
      </ScrollView>
    </View>
  );
};

CoinbackRewards.propTypes = {
  rewards: PropTypes.array,
  navigation: PropTypes.object,
  profile: PropTypes.object,
  dispatch: PropTypes.func,
  membership: PropTypes.object,
  setAmount: PropTypes.func,
  styles: PropTypes.object,
};

export default CoinbackRewards;
