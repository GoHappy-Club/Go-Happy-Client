import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Colors } from "../../assets/colors/color";
import { wp, hp } from "../../helpers/common";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";
import { Button } from "react-native-elements";
import phonepe_payments from "../PhonePe/Payments";
import { TouchableOpacity } from "react-native";

const predefinedPackages = [
  {
    id: 1,
    amount: 100,
    coins: 100,
    description: "Starter Pack",
    backgroundColor: Colors.white,
    textColor: Colors.black,
  },
  {
    id: 2,
    amount: 250,
    coins: 275,
    description: "Value Pack (10% Bonus)",
    backgroundColor: Colors.white,
    textColor: Colors.black,
  },
  {
    id: 3,
    amount: 500,
    coins: 600,
    description: "Super Saver Pack (20% Bonus)",
    backgroundColor: Colors.white,
    textColor: Colors.black,
  },
  {
    id: 4,
    amount: 1000,
    coins: 1250,
    description: "Mega Pack (25% Bonus)",
    backgroundColor: Colors.white,
    textColor: Colors.black,
  },
];

const WalletTopUp = () => {
  const [amount, setAmount] = useState("");
  const [payButtonLoading, setPayButtonLoading] = useState(false);
  const [shareButtonLoading, setShareButtonLoading] = useState(false);
  const [paymentSharePopUp, setPaymentSharePopUp] = useState(false);
  const [error, setError] = useState(false);
  const [plans, setPlans] = useState(null);

  const inputRef = useRef();

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

  const planSelected = (plan, key) => {
    const selected = predefinedPackages.map((item, index) => {
      if (index == key) {
        item.backgroundColor = Colors.pink.sessionDetails;
        item.textColor = Colors.white;
        return;
      }
      item.backgroundColor = Colors.white;
      item.textColor = Colors.grey.countdown;
    });
    setPlans(selected);
    setAmount(String(plan.coins));
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Top Up Your Wallet</Text>

        {/* <View style={styles.cardContainer}>
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
        </View> */}
        <View style={{ flexDirection: "column", marginTop: "5%" }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                inputRef.current.focus();
              }}
              style={{
                ...styles.paymentContainer,
              }}
            >
              <Image
                source={require("../../images/GoCoins.png")}
                style={{
                  height: 40,
                  width: 40,
                }}
              />
              <TextInput
                ref={inputRef}
                style={styles.paymentInput}
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                }}
                placeholder="0"
                keyboardType="numeric"
                // autoFocus={true}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: wp(5),
                marginBottom:wp(2),
                color: Colors.green,
                fontFamily: "Poppins-Regular",
              }}
            >
              {amount} coins = ₹500
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setAmount("501")}
              >
                <Image
                  source={require("../../images/GoCoins.png")}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                <Text style={styles.buttonText}>501</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setAmount("1100")}
              >
                <Image
                  source={require("../../images/GoCoins.png")}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                <Text style={styles.buttonText}>1100</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setAmount("2100")}
              >
                <Image
                  source={require("../../images/GoCoins.png")}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                <Text style={styles.buttonText}>2100</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setAmount("5100")}
              >
                <Image
                  source={require("../../images/GoCoins.png")}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
                <Text style={styles.buttonText}>5100</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              disabled={amount < 1}
              style={
                (amount < 1 && styles.checkoutButtonDisabled) ||
                styles.checkoutButtonEnabled
              }
              onPress={() => {
                if (!validateAmount()) return;
                setPaymentSharePopUp(true);
              }}
            >
              <View>
                <Text style={styles.optionList}>Click To Pay</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.orText}>OR</Text>

        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
          {predefinedPackages.map((plan, index) => (
            <View style={{ width: "50%" }} key={index}>
              <TouchableOpacity
                style={{
                  backgroundColor: plan.backgroundColor,
                  shadowColor: Colors.black,
                  elevation: 10,
                  shadowOffset: { height: 2 },
                  shadowOpacity: 0.3,
                  borderRadius: 10,
                  height: 100,
                  margin: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => planSelected(plan, index)}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ fontSize: 30, color: plan.textColor }}>
                    ₹{plan.amount}
                  </Text>
                  <Text style={{ color: plan.textColor }}>
                    {plan.description}
                  </Text>
                  <Text style={{ color: plan.textColor }}>
                    {plan.coins} coins
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
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
  optionList: {
    fontSize: 16,
    padding: 10,
    color: Colors.white,
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    marginTop: wp(5),
  },
  checkoutButtonEnabled: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    marginTop: wp(5),
  },
  input: {
    height: "10%",
    fontSize: 20,
    // marginTop:-,
    // borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    // marginTop:'20%',
    width: "auto",
    alignItems: "center",
  },
  paymentContainer: {
    // width: "auto",
    // minWidth: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.grey.d,
    padding: 5,
    margin: "5%",
  },
  currencySymbol: {
    fontSize: 36,
    // marginRight: 10,
    fontWeight: "700",
  },
  paymentInput: {
    textAlign: "center",
    // width: "auto",
    // flex: 1,
    color: Colors.black,
    fontSize: 36,
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    // marginTop: "5%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.grey.d,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  orText: {
    fontSize: hp(2),
    color: Colors.grey.dark,
    marginVertical: hp(2),
  },
  packagesContainer: {
    flexDirection: "flex",
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
    width: wp(32),
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
