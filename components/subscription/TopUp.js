import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors } from "../../assets/colors/color";
import { wp, hp } from "../../helpers/common";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";
import { Button } from "react-native-elements";
import phonepe_payments from "../PhonePe/Payments";

const predefinedPackages = [
  { id: 1, amount: 100, coins: 100, description: "Starter Pack" },
  { id: 2, amount: 250, coins: 275, description: "Value Pack (10% Bonus)" },
  {
    id: 3,
    amount: 500,
    coins: 600,
    description: "Super Saver Pack (20% Bonus)",
  },
  { id: 4, amount: 1000, coins: 1250, description: "Mega Pack (25% Bonus)" },
];

const WalletTopUp = () => {
  const [amount, setAmount] = useState("");
  const [payButtonLoading, setPayButtonLoading] = useState(false);
  const [shareButtonLoading, setShareButtonLoading] = useState(false);
  const [paymentSharePopUp, setPaymentSharePopUp] = useState(false);
  const [error, setError] = useState(false);

  const navigation = useNavigation();

  const profile = useSelector((state) => state.profile.profile);

  const phonePe = async (type, amount, paymentType) => {
    const _callback = () => {
      setPayButtonLoading(false);
      setPaymentSharePopUp(false);
      setShareButtonLoading(false);
      navigation.navigate("PaymentSuccessful", {
        type: "normal",
        navigateTo: "WalletScreen",
      });
    };

    const _errorHandler = () => {
      setPayButtonLoading(false);
      setPaymentSharePopUp(false);
      setShareButtonLoading(false);
      navigation.navigate("PaymentFailed", {
        type: "normal",
        navigateTo: "TopUpScreen",
      });
    };
    if (type == "share") {
      setShareButtonLoading(true);
      phonepe_payments
        .phonePeShare(
          profile.phoneNumber,
          Number.parseInt(amount),
          _errorHandler,
          paymentType,
          null,
          null,
          null
        )
        .then((link) => {
          //prettier-ignore
          const message = `Hello from the GoHappy Club Family,
${toUnicodeVariant(profile.name,"italic")} is requesting a payment of ₹${toUnicodeVariant(String(plan.subscriptionFees),"bold")} for GoHappy Club Wallet top-up.
Please make the payment using the link below:
${link}
${toUnicodeVariant("Note:","bold")} The link will expire in 20 minutes.
    `;
          Share.share({
            message: message,
          })
            .then((result) => {
              setPaymentSharePopUp(false);
              setShareButtonLoading(false);
            })
            .catch((errorMsg) => {
              console.log("error in sharing", errorMsg);
              setPaymentSharePopUp(false);
              setShareButtonLoading(false);
            });
        });
    } else {
      setPayButtonLoading(true);
      phonepe_payments.phonePe(
        profile.phoneNumber,
        amount,
        _callback,
        _errorHandler,
        paymentType,
        null,
        null,
        null
      );
    }
  };

  const validateAmount = () => {
    if (amount.length == 0) {
      setError(true);
      return false;
    }
    if (!/^\d+$/.test(amount)) {
      setError(true);
      return false;
    }
    return true;
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Top Up Your Wallet</Text>

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Top Up Your Wallet</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter amount (₹)"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => {
                setError(false);
                setAmount(text);
              }}
              style={styles.amountInput}
              placeholderTextColor={Colors.grey.d}
            />
          </View>
            {error && (
              <Text
                style={{
                  color: Colors.red,
                  fontSize: 12,
                  marginLeft: 10,
                }}
              >
                Please enter valid amount.
              </Text>
            )}

          <Pressable
            style={({ pressed }) => [
              styles.topUpButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              if (validateAmount()) setPaymentSharePopUp(true);
            }}
          >
            <Text style={styles.buttonText}>Top Up</Text>
          </Pressable>
        </View>

        <Text style={styles.orText}>OR</Text>

        <View style={styles.packagesContainer}>
          {predefinedPackages.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.packageButton,
                { opacity: pressed ? 0.9 : 1 },
              ]}
              onPress={() => {
                setAmount(item.amount);
              }}
            >
              <View style={styles.packageContent}>
                <Text style={styles.packageText}>₹ {item.amount}</Text>
                <Text style={styles.packageDescription}>
                  {item.description}
                </Text>
                <Text style={styles.packageCoins}>{item.coins} Coins</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {paymentSharePopUp && (
        <AwesomeAlert
          show={paymentSharePopUp}
          showProgress={false}
          closeOnTouchOutside={
            payButtonLoading || shareButtonLoading ? false : true
          }
          closeOnHardwareBackPress={
            payButtonLoading || shareButtonLoading ? false : true
          }
          customView={
            <View style={styles.AAcontainer}>
              <Text style={styles.AAtitle}>Payment Confirmation</Text>
              <Text style={styles.AAmessage}>
                Would you like to pay this yourself or share the payment link
                with a family member?
              </Text>
              <View style={styles.AAbuttonContainer}>
                <Button
                  outline
                  title={"Pay Now"}
                  loading={payButtonLoading}
                  buttonStyle={[styles.AApayButton, styles.AAbutton]}
                  onPress={() => {
                    phonePe("self", amount, "topUp");
                  }}
                  disabled={payButtonLoading}
                />
                <Button
                  outline
                  title={"Share"}
                  loading={shareButtonLoading}
                  buttonStyle={[styles.AAshareButton, styles.AAbutton]}
                  onPress={() => {
                    phonePe("share", amount, "topUp");
                  }}
                  disabled={shareButtonLoading}
                />
              </View>
            </View>
          }
          onDismiss={() => setPaymentSharePopUp(false)}
        />
      )}
    </>
  );
};

export default WalletTopUp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: wp(5),
    backgroundColor: Colors.grey.f0,
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: hp(3),
    fontWeight: "bold",
    marginBottom: hp(3),
    textAlign: "center",
  },
  cardContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: hp(4),
    paddingHorizontal: wp(5),
    marginVertical: hp(3),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: hp(2),
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey.f1,
    marginBottom: hp(3),
    paddingHorizontal: wp(2),
  },
  amountInput: {
    fontSize: hp(2.5),
    color: Colors.black,
    textAlign: "center",
    paddingVertical: hp(1),
    fontWeight: "bold",
  },
  topUpButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: hp(2),
  },
  buttonText: {
    color: Colors.white,
    fontSize: hp(2.5),
    fontWeight: "bold",
  },
  orText: {
    fontSize: hp(2),
    color: Colors.grey.dark,
    marginVertical: hp(2),
  },
  packagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(4),
    paddingHorizontal: wp(2),
    marginVertical: hp(2),
    width: "100%",
  },
  packageButton: {
    backgroundColor: Colors.white,
    paddingVertical: hp(3),
    paddingHorizontal: wp(5),
    borderRadius: 16,
    width: wp(62),
    alignItems: "center",
    marginBottom: hp(2),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: Colors.grey.light,
  },
  packageContent: {
    alignItems: "center",
  },
  packageText: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: hp(0.8),
  },
  packageDescription: {
    fontSize: hp(1.8),
    color: Colors.grey.dark,
    textAlign: "center",
    marginVertical: hp(0.5),
    fontFamily: "Poppins-Regular",
  },
  packageCoins: {
    fontSize: hp(3),
    color: Colors.pink.sessionDetails,
    marginTop: hp(0.3),
    fontFamily: "Montserrat-SemiBold",
  },
  AAcontainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  AAtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.grey.grey,
  },
  AAmessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.grey.grey,
  },
  AAbuttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  AAbutton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 100,
  },
  AApayButton: {
    backgroundColor: Colors.primary,
  },
  AAshareButton: {
    backgroundColor: Colors.grey.grey,
  },
  AAbuttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
