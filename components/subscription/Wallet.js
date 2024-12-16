import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { hp, wp } from "../../helpers/common";
import { useSelector } from "react-redux";
import { Colors } from "../../assets/colors/color";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import TransactionHistory from "./TransactionHistory";

const Wallet = ({ transactions }) => {
  const [nonMemberPopUp, setNonMemberPopUp] = useState(false);

  const membership = useSelector((state) => state.membership.membership);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.subscriptionContainer}>
          <SubscriptionCard />
        </View>
        <View style={styles.coinsContainer}>
          <View style={styles.innerContainer}>
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.titleText}>Happy Coins</Text>
              <Text
                style={[
                  styles.coinsText,
                  {
                    color:
                      membership.membershipType !== "Free"
                        ? Colors.black
                        : Colors.grey.countdown,
                  },
                ]}
              >
                {membership.coins}
              </Text>
            </View>
            <Image
              source={require("../../images/GoCoins.png")}
              style={styles.coinImage}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              if (membership.membershipType === "Free") {
                navigation.navigate("SubscriptionPlans");
                return;
              }
              navigation.navigate("TopUpScreen");
            }}
          >
            <View style={styles.buttonContent}>
              <Image
                source={require("../../images/GoCoins.png")}
                style={styles.buttonImage}
              />
              <Text style={styles.buttonText}>Add More Happy Coins</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.transactionHistoryContainer}>
          <TransactionHistory transactions={transactions} seeAll={true} />
        </View>
      </ScrollView>
      {nonMemberPopUp && (
        <AwesomeAlert
          show={nonMemberPopUp}
          showProgress={false}
          title={"Failed"}
          message={
            "You are not a member of GoHappy Club, Join us by clicking below button."
          }
          messageStyle={{
            textAlign: "center",
            fontFamily: "Poppins-Regular",
          }}
          titleStyle={{
            fontSize: wp(5),
            fontFamily: "NunitoSans-SemiBold",
            color: Colors.red,
          }}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          showCancelButton={false}
          confirmText="Join Now"
          confirmButtonColor={Colors.primary}
          onConfirmPressed={() => {
            setNonMemberPopUp(false);
            navigation.navigate("SubscriptionPlans");
          }}
          onDismiss={() => setNonMemberPopUp(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? hp(6) : 0, // Ensure space for Android status bar
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: hp(1), // Prevent overlap with bottom edges
  },
  subscriptionContainer: {
    paddingHorizontal: wp(7),
    width: "100%",
    // marginBottom: hp(2),
  },
  coinsContainer: {
    width: wp(95),
    backgroundColor: Colors.bottomNavigation,
    borderRadius: 20,
    padding: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    marginVertical: hp(2),
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  coinsText: {
    fontSize: 28,
    fontWeight: "600",
  },
  coinImage: {
    width: wp(20),
    height: wp(20),
    resizeMode: "contain",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1),
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  buttonImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionHistoryContainer: {
    width: wp(95),
    justifyContent: "center",
    alignItems: "center",
  },
});
