import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGift, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { hp, wp } from "../helpers/common";
import { Tab, TabView } from "@rneui/themed";
import { Colors } from "../assets/colors/color";
import { useNavigation } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { format, fromUnixTime } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setMembership } from "../redux/actions/counts";
import FastImage from "react-native-fast-image";
import GOHLoader from "../commonComponents/GOHLoader";

const COLORS = {
  blue: "#B8D8FF",
  red: "#FFB3B3",
  yellow: "#FFF4B8",
  purple: "#E5C8FF",
  green: "#B8FFCC",
  orange: "#FFD4C2",
  indigo: "#C8CFFF",
  teal: "#B8FFF0",
  pink: "#FFC2E5",
};

export const getRandomColor = () => {
  const colorKeys = Object.keys(COLORS);
  const randomIndex = Math.floor(Math.random() * colorKeys.length);
  return COLORS[colorKeys[randomIndex]];
};

export const formatDate = (date) => {
  const dt = fromUnixTime(date / 1000);
  const finalTime = format(dt, "MMM d, yyyy");
  return finalTime;
};

const RewardsCard = ({
  id,
  icon,
  amount,
  title,
  color,
  scratched,
  navigation,
  setScratchedTrue,
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
            source={require("../images/scratch_foreground.png")}
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
                source={require("../images/GoCoins.png")}
                style={{
                  height: wp(8),
                  width: wp(8),
                }}
              />
              {amount && <Text style={styles.amount}>{amount}</Text>}
            </View>
            {/* {title && <Text style={styles.cardTitle}>{title}</Text>} */}
          </View>
        </View>
      )}
    </>
  );
};

const VouchersCard = ({ voucher, id, onPress }) => {
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
        sharedTransitionTag={`sharedBg${id}`}
        style={[
          styles.borderedContainer,
          {
            backgroundColor:
              voucher.status == "ACTIVE" ? "white" : Colors.grey.d,
          },
        ]}
      >
        <View style={styles.topSection}>
          <Animated.Image
            sharedTransitionTag={id}
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
          <Animated.Text
            sharedTransitionTag={`sharedValue${id}`}
            style={styles.amount}
          >
            {voucher.value != null
              ? `₹${voucher.value}`
              : `${voucher.percent}% OFF`}
          </Animated.Text>
          <Animated.Text
            sharedTransitionTag={`sharedText${id}`}
            style={styles.cardTitle}
          >
            {voucher.title}
          </Animated.Text>
          <Animated.Text
            sharedTransitionTag={`sharedExpiryDate${id}`}
            style={styles.validityText}
          >
            {voucher.status == "ACTIVE"
              ? "Valid until"
              : `${
                  voucher?.status?.charAt(0) +
                  voucher.status.slice(1).toLowerCase()
                } on`}{" "}
            {voucher.status == "REDEEMED"
              ? formatDate(voucher?.redemptionTime)
              : formatDate(
                  Math.min(voucher.expiryDate, voucher.parentExpiryDate)
                )}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
      <View style={styles.cutoutLeft} />
      <View style={styles.cutoutRight} />
    </TouchableOpacity>
  );
};

const CoinbackRewards = ({
  rewards,
  navigation,
  profile,
  dispatch,
  membership,
  setAmount,
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
        .reduce((_acc, item) => _acc + item.amount, 0)
    );
    await saveScratchInBackend(id, amount);
  };

  const saveScratchInBackend = async (id, amount) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/membership/scratchCardReward`,
        {
          phone: profile.phoneNumber,
          coinTransactionId: id,
        }
      );
      dispatch(
        setMembership({
          ...membership,
          coins: Number.parseInt(membership.coins) + amount,
        })
      );
    } catch (error) {
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
            You don't have any reward yet.
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
          />
        ))}
      </ScrollView>
    </View>
  );
};

const Vouchers = ({ vouchers, navigation }) => (
  <View
    style={{
      width: "100%",
      height: "100%",
      alignItems: vouchers.length == 1 ? "flex-start" : "center",
    }}
  >
    {vouchers?.length == 0 && (
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
          You don't have any voucher yet.
        </Text>
      </View>
    )}
    <ScrollView
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
    >
      {vouchers.map((item, index) => (
        <VouchersCard
          id={item.id}
          key={index}
          voucher={item}
          color={item.status == "ACTIVE" ? getRandomColor() : "#666"}
          onPress={(colorL) =>
            navigation.navigate("VoucherDetails", {
              id: item.id,
              image: item.image,
              title: item.title,
              code: item.code,
              color: colorL,
              value: item.value,
              percent: item.percent,
              expiryDate: item.expiryDate,
              status: item.status,
              description: item.description,
              status: item.status,
              redemptionTime: item.redemptionTime,
              parentExpiryDate: item.parentExpiryDate,
            })
          }
        />
      ))}
    </ScrollView>
  </View>
);

const Rewards = ({ rewards, vouchers, loading }) => {
  const [index, setIndex] = useState(0);
  // const amount = rewards
  //   .filter((item) => item.scratched == true)
  //   .reduce((_acc, item) => _acc + item.amount, 0);
  const [amount, setAmount] = useState(
    rewards
      .filter((item) => item.scratched == true)
      .reduce((_acc, item) => _acc + item.amount, 0)
  );
  const navigation = useNavigation();

  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();

  useEffect(() => {
    setAmount(
      rewards
        .filter((item) => item.scratched == true)
        .reduce((_acc, item) => _acc + item.amount, 0)
    );
  }, [rewards]);

  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: Colors.background,
        }}
      >
        <View style={styles.totalRewards}>
          <Text style={styles.rewardsAmount}>
            <FastImage
              source={require("../images/GoCoins.png")}
              style={{
                height: 70,
                width: 70,
              }}
            />
            {amount}
          </Text>
          <Text style={styles.rewardsLabel}>Earned in Rewards</Text>
        </View>
        <Tab
          value={index}
          onChange={(index) => {
            setIndex(index);
          }}
          dense={true}
          style={{ backgroundColor: Colors.background }}
          indicatorStyle={{
            backgroundColor: Colors.primary, // Change the indicator color to green
          }}
          titleStyle={{
            color: Colors.primary, // Set color of both active and inactive tab labels to green
          }}
        >
          <Tab.Item>Rewards</Tab.Item>
          <Tab.Item>Vouchers</Tab.Item>
        </Tab>
        <TabView
          containerStyle={{ height: "100%" }}
          value={index}
          onChange={(index) => {
            setIndex(index);
          }}
          animationType="spring"
        >
          <TabView.Item style={{ width: "100%", height: "100%" }}>
            {loading == false ? (
              <CoinbackRewards
                rewards={rewards}
                navigation={navigation}
                profile={profile}
                dispatch={dispatch}
                membership={membership}
                setAmount={setAmount}
              />
            ) : (
              <GOHLoader />
            )}
          </TabView.Item>
          <TabView.Item style={{ width: "100%", height: "100%" }}>
            <Vouchers vouchers={vouchers} navigation={navigation} />
          </TabView.Item>
        </TabView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  totalRewards: {
    padding: 24,
    backgroundColor: Colors.bottomNavigation,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: hp(30),
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardsAmount: {
    fontSize: wp(15),
    fontWeight: "bold",
    marginBottom: 4,
    color: "black",
  },
  rewardsLabel: {
    fontSize: wp(5),
    opacity: 0.8,
    color: "black",
    fontFamily: "Poppins-Regular",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    width: "100%",
  },
  card: {
    width: wp(42),
    height: wp(42),
    // height:"45%",
    aspectRatio: 1,
    margin: "2%",
    borderRadius: 20,
    // padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    // flex:1
  },
  voucherCard: {
    width: "90%",
    height: hp(16),
    marginVertical: "5%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(12px)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
    // resizeMode: "contain",
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
  cutoutLeft: {
    position: "absolute",
    left: -15,
    top: "50%",
    width: 30,
    height: 30,
    backgroundColor: "#f7f7f7",
    borderRadius: 15,
    transform: [{ translateY: -15 }],
  },
  cutoutRight: {
    position: "absolute",
    right: -15,
    top: "50%",
    width: 30,
    height: 30,
    backgroundColor: "#f7f7f7",
    borderRadius: 15,
    transform: [{ translateY: -15 }],
  },
  scratch_card: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    // backgroundColor:"green"
  },
});

export default Rewards;
