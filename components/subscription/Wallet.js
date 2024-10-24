import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  Platform,
} from "react-native";
import React, { useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { hp, wp } from "../../helpers/common";
import { useSelector } from "react-redux";
import { Colors } from "../../assets/colors/color";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";

const Wallet = () => {
  const [nonMemberPopUp, setNonMemberPopUp] = useState(false);

  const membership = useSelector((state) => state.membership.membership);
  const navigation = useNavigation();

  return (
    <>
      <View
        style={{
          paddingTop: hp(8),
          alignItems: "center",
        }}
      >
        <SubscriptionCard />
        <View style={styles.coinsContainer}>
          {/* Inner Container with Text and Image */}
          <View style={styles.innerContainer}>
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.titleText}>Go Coins</Text>
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
                setNonMemberPopUp(true);
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
              <Text style={styles.buttonText}>Add More Go Coins</Text>
            </View>
          </Pressable>
        </View>
      </View>
      {nonMemberPopUp && (
        <AwesomeAlert
          show={nonMemberPopUp}
          showProgress={false}
          title={"Not a Members"}
          message={
            "You are not a member of GoHappy Club, Join us by clicking below button."
          }
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          showCancelButton={false}
          confirmText="Join Now"
          confirmButtonColor={Colors.primary}
          onConfirmPressed={() => {
            navigation.navigate("SubscriptionPlans");
          }}
          onDismiss={() => setNonMemberPopUp(false)}
        />
      )}
    </>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  coinsContainer: {
    width: wp(95),
    backgroundColor: "#FFF5D7", // Light gold background for a premium feel
    borderRadius: 20,
    padding: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10, // Shadow for Android
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
});
