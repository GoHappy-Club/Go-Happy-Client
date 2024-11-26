import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SubscriptionPlans from "../../components/subscription/SubscriptionPlans";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/colors/color";
import { wp, hp } from "../../helpers/common";
import { ActivityIndicator } from "react-native";
import { TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import Video from "react-native-video";
import GOHLoader from "../../commonComponents/GOHLoader";

const SubscriptionScreen = () => {
  // pass this subscription plans as a prop to the child component
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const membership = useSelector((state) => state.membership.membership);

  const navigation = useNavigation();

  const getPlans = async () => {
    //get all subscription plans by api
    const url = SERVER_URL + "/membership/listAll";
    try {
      setLoading(true);
      const response = await axios.get(url);
      const plansToShow = response.data.filter(
        (plan) => plan.membershipType != "Free"
      );
      setPlans(plansToShow);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error in fetching plans", error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  const RenderHeader = () => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingHorizontal: 20,
            paddingVertical: 10,
            width: wp(100),
          }}
        >
          <View style={styles.goHappyClubLogoWrapper}>
            <FastImage
              source={require("../../images/logo.png")}
              style={styles.logo}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      {loading && <GOHLoader />}
      {!loading && (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.grey.f0,
            paddingTop: hp(2),
          }}
        >
          {/* <RenderHeader /> */}
          <SubscriptionPlans plans={plans} />
        </SafeAreaView>
      )}
    </>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  logo: {
    width: wp(25),
    height: hp(10),
    resizeMode: "contain",
  },
});
