// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { hp, wp } from "../helpers/common";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { faGift, faTrophy } from "@fortawesome/free-solid-svg-icons";

// const RewardsCard = ({ icon, amount, title, color }) => (
//   <TouchableOpacity style={[styles.card, { backgroundColor: color }]}>
//     {/* <Text style={styles.cardIcon}>{icon}</Text> */}

//     <FontAwesomeIcon
//       size={34}
//       icon={icon}
//       color={"gold"}
//       style={styles.icon}
//     />
//     {amount && <Text style={styles.amount}>₹{amount}</Text>}
//     {title && <Text style={styles.cardTitle}>{title}</Text>}
//   </TouchableOpacity>
// );

// const Rewards = ({rewards}) => {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.totalRewards}>
//         <Text style={styles.rewardsAmount}>₹811</Text>
//         <Text style={styles.rewardsLabel}>Earned in Rewards</Text>
//       </View>

//       <View style={styles.grid}>
//         <RewardsCard icon={faTrophy} amount="125" color="#4285F4" />
//         <RewardsCard icon={faGift} color="#EA4335" amount={123} />
//         <RewardsCard icon={faGift} color="#FBBC04" amount={123}  />
//         <RewardsCard icon={faGift} color="#4285F4" amount={123}  />
//         <RewardsCard icon={faGift} color="#4285F4" amount={123}  />
//         <RewardsCard icon={faGift} color="#9C27B0" amount={123}  />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#FFFFFF",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     height: hp(30),
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//   },
//   headerMenu: {
//     fontSize: 24,
//   },
//   totalRewards: {
//     padding: 24,
//     backgroundColor: "#FFC107",
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     height: hp(30),
//     marginBottom: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   rewardsAmount: {
//     fontSize: wp(15),
//     fontWeight: "bold",
//     marginBottom: 4,
//     color: "black",
//   },
//   rewardsLabel: {
//     fontSize: wp(5),
//     opacity: 0.8,
//     color: "black",
//   },
//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     padding: 8,
//     justifyContent:"center",
//   },
//   card: {
//     width: "42%",
//     aspectRatio: 1,
//     margin: "2%",
//     borderRadius: 8,
//     padding: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     gap:10
//   },
//   cardIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   amount: {
//     fontSize: wp(7),
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   cardTitle: {
//     fontSize: 14,
//     color: "#FFFFFF",
//     opacity: 0.9,
//   },
// });

// export default Rewards;

import React, { useState } from "react";
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
import Animated, { SharedTransition } from "react-native-reanimated";

const COLORS = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  purple: "#9C27B0",
  green: "#34A853",
  orange: "#FF5722",
  indigo: "#3F51B5",
  teal: "#009688",
  pink: "#E91E63",
};

const getRandomColor = () => {
  const colorKeys = Object.keys(COLORS);
  const randomIndex = Math.floor(Math.random() * colorKeys.length);
  return COLORS[colorKeys[randomIndex]];
};

const RewardsCard = ({ icon, amount, title, color }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: color }]}>
    <FontAwesomeIcon size={34} icon={icon} color={"gold"} style={styles.icon} />
    {amount && <Text style={styles.amount}>₹{amount}</Text>}
    {title && <Text style={styles.cardTitle}>{title}</Text>}
  </TouchableOpacity>
);

export const VouchersCard = ({ image, title, id, onPress }) => (
  <TouchableOpacity
    style={[styles.voucherCard, { backgroundColor: "white" }]}
    onPress={onPress}
  >
    <Animated.Image
      sharedTransitionTag={id}
      source={{
        uri: image,
      }}
      style={{
        width: "100%",
        height: "70%",
        // borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "30%",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: wp(2),
        borderTopColor: "black",
        borderTopWidth: 0.5,
      }}
    >
      {title && (
        <Animated.Text sharedTransitionTag="text" style={styles.voucherTitle}>
          {title}
        </Animated.Text>
      )}
    </View>
  </TouchableOpacity>
);

const CoinbackRewards = ({ rewards }) => (
  <View
    style={{
      width: "100%",
      height: "100%",
      alignItems: rewards.length == 1 ? "flex-start" : "center",
    }}
  >
    <ScrollView
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
    >
      {rewards.map((item, index) => (
        <RewardsCard
          key={index}
          icon={item.source == "coinback" ? faGift : faTrophy}
          amount={item.amount}
          color={getRandomColor()}
        />
      ))}
    </ScrollView>
  </View>
);

const Vouchers = ({ vouchers, navigation }) => (
  <View
    style={{
      width: "100%",
      height: "100%",
      alignItems: vouchers.length == 1 ? "flex-start" : "center",
    }}
  >
    <ScrollView contentContainerStyle={styles.grid}>
      {vouchers.map((item, index) => (
        <VouchersCard
          id={item.id}
          key={index}
          image={item.image}
          title={item.title}
          color={item.status == "ACTIVE" ? getRandomColor() : "#666"}
          onPress={() =>
            navigation.navigate("VoucherDetails", {
              id: item.id,
              image: item.image,
              title: item.title,
            })
          }
        />
      ))}
    </ScrollView>
  </View>
);

const Rewards = ({ rewards, vouchers }) => {
  const [index, setIndex] = useState(null);
  const amount = rewards.reduce((_acc, item) => _acc + item.amount, 0);
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          height: "100%",
        }}
      >
        <View style={styles.totalRewards}>
          <Text style={styles.rewardsAmount}>
            <Image
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
          value={index == null ? 0 : index}
          onChange={(index) => {
            setIndex(index);
          }}
          dense
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
            <CoinbackRewards rewards={rewards} navigation={navigation} />
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
    backgroundColor: "#FFFFFF",
  },
  totalRewards: {
    padding: 24,
    backgroundColor: "#FFC107",
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
    width: "45%",
    aspectRatio: 1,
    margin: "2%",
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  voucherCard: {
    width: "45%",
    height: hp(20),
    margin: "2%",
    borderRadius: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    padding: 1,
  },
  amount: {
    fontSize: wp(7),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  voucherTitle: {
    fontSize: wp(4.5),
    color: "#000",
    opacity: 0.9,
    fontFamily: "Poppins-Regular",
  },
});

export default Rewards;
