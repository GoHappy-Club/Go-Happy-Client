import {
  BackHandler,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../assets/colors/color";
import { hp, wp } from "../../helpers/common";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";

const PaymentFailed = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [helpLink, setHelpLink] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/properties/list`);
        const properties = response.data?.properties[0];
        setHelpLink(properties?.whatsappHelpLink);
      } catch (error) {}
    };
    fetchProperties();
  }, []);

  // type -> normal, empty for subscription
  const { type, navigateTo } = route?.params;
  useEffect(() => {
    const backAction = () => {
      navigation.navigate(navigateTo ? navigateTo : "GoHappy Club");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  if (type == "normal")
    return (
      <View style={styles.container}>
        <View style={styles.goBackContainer}>
          <TouchableOpacity
            style={styles.goBackTouchable}
            onPress={() => {
              navigation.navigate("OverviewScreen");
            }}
          >
            <ChevronLeft size={24} color={Colors.black} />
            <Text style={styles.goBackText}>Home</Text>
          </TouchableOpacity>
        </View>
        <FastImage
          source={require("../../images/paymentError.png")}
          style={styles.image}
        />
        <Text style={styles.sorryTitle}>Sorry!</Text>
        <View style={styles.textWrapper}>
          <Text style={styles.plainText}>We couldn't process your payment</Text>
          <Text style={styles.plainText}>Please try again.</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
            styles.retryButton,
          ]}
          onPress={() =>
            navigation.navigate(navigateTo ? navigateTo : "GoHappy Club")
          }
        >
          <View
            style={{
              flexDirection: "row",
              gap: wp(3),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </View>
        </Pressable>
      </View>
    );
  else if (type == "pending") {
    return (
      <View style={styles.container}>
        <View style={styles.goBackContainer}>
          <TouchableOpacity
            style={styles.goBackTouchable}
            onPress={() => {
              navigation.navigate("OverviewScreen");
            }}
          >
            <ChevronLeft size={24} color={Colors.black} />
            <Text style={styles.goBackText}>Home</Text>
          </TouchableOpacity>
        </View>
        <FastImage
          source={require("../../images/paymentError.png")}
          style={styles.image}
        />
        <Text style={styles.sorryTitle}>Sorry!</Text>
        <View style={styles.textWrapper}>
          <Text style={styles.plainText}>
            We couldn't verify your Payment, it is still in Pending.
          </Text>
          <Text style={styles.plainText}>Please contact support.</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
            styles.retryButton,
          ]}
          onPress={() => Linking.openURL(helpLink)}
        >
          <View
            style={{
              flexDirection: "row",
              gap: wp(3),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.retryText}>Help Me</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.goBackContainer}>
        <TouchableOpacity
          style={styles.goBackTouchable}
          onPress={() => {
            navigation.navigate("OverviewScreen");
          }}
        >
          <ChevronLeft size={24} color={Colors.black} />
          <Text style={styles.goBackText}>Home</Text>
        </TouchableOpacity>
      </View>
      <FastImage
        source={require("../../images/paymentError.png")}
        style={styles.image}
      />
      <Text style={styles.sorryTitle}>Sorry!</Text>
      <View style={styles.textWrapper}>
        <Text style={styles.plainText}>
          We couldn't process your request to join GoHappy Club.
        </Text>
        <Text style={styles.plainText}>Please try again.</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
          },
          styles.retryButton,
        ]}
        onPress={() => navigation.navigate("SubscriptionPlans")}
      >
        <View
          style={{
            flexDirection: "row",
            gap: wp(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default PaymentFailed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp(50),
    height: wp(60),
  },
  textWrapper: {
    marginBottom: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  sorryTitle: {
    fontSize: wp(8),
    fontWeight: "bold",
    color: Colors.red,
    fontFamily: "monospace",
    marginVertical: hp(2),
  },
  plainText: {
    fontSize: wp(4),
    color: Colors.black,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    width: wp(95),
  },
  retryButton: {
    backgroundColor: Colors.pink.sessionDetails,
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    width: wp(60),
  },
  retryText: {
    fontSize: wp(6),
    fontWeight: "bold",
    color: Colors.primaryText,
    fontFamily: Platform.OS == "android" ? "Droid Sans Mono" : "Avenir",
  },
  goBackContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  goBackTouchable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  goBackText: {
    fontSize: wp(4),
    color: Colors.black,
  },
});
