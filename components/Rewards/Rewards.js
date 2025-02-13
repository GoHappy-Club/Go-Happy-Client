import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGift, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { hp, wp } from "../../helpers/common";
import { Tab, TabView } from "@rneui/themed";
import { Colors } from "../../assets/colors/color";
import { useNavigation } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { format, fromUnixTime } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setMembership } from "../../redux/actions/counts";
import FastImage from "react-native-fast-image";
import GOHLoader from "../../commonComponents/GOHLoader";
import CoinbackRewards from "./CoinbackRewards";
import VouchersCard from "./VouchersCard";

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
          styles={styles}
          formatDate={formatDate}
        />
      ))}
    </ScrollView>
  </View>
);

const Rewards = ({ rewards, vouchers, loading }) => {
  const [index, setIndex] = useState(0);
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
          <View style={styles.topContent}>
            <FastImage
              source={require("../../images/coins.png")}
              style={{
                height: 70,
                width: 70,
              }}
            />
            <Text style={styles.rewardsAmount}>{amount}</Text>
          </View>
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
            backgroundColor: Colors.primary,
          }}
          titleStyle={{
            color: Colors.primaryText,
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
          <TabView.Item
            style={{
              width: "100%",
              height: "100%",
              display:
                Platform.OS === "android"
                  ? "flex"
                  : index == 0
                    ? "flex"
                    : "none",
            }}
          >
            {loading == false ? (
              <CoinbackRewards
                rewards={rewards}
                navigation={navigation}
                profile={profile}
                dispatch={dispatch}
                membership={membership}
                setAmount={setAmount}
                styles={styles}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: Colors.background,
                }}
              >
                <GOHLoader />
              </View>
            )}
          </TabView.Item>
          <TabView.Item
            style={{
              width: "100%",
              height: "100%",
              display:
                Platform.OS === "android"
                  ? "flex"
                  : index == 1
                    ? "flex"
                    : "none",
            }}
          >
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
  topContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
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
    aspectRatio: 1,
    margin: "2%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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
    backgroundColor: Colors.background,
    borderRadius: 15,
    transform: [{ translateY: -15 }],
  },
  cutoutRight: {
    position: "absolute",
    right: -15,
    top: "50%",
    width: 30,
    height: 30,
    backgroundColor: Colors.background,
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
