import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import WalletTopUp from "../../components/subscription/TopUp";
import { useSelector } from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";
import { Colors } from "../../assets/colors/color";
import { useNavigation } from "@react-navigation/native";
import Video from "react-native-video";
import GOHLoader from "../../commonComponents/GOHLoader";

const TopUpScreen = () => {
  const [nonMemberPopUp, setNonMemberPopUp] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const membership = useSelector((state) => state.membership.membership);
  const navigation = useNavigation();

  const getCoinPackages = async () => {
    //get all coins packages from api
    const url = SERVER_URL + "/membership/listCoinPackages";
    try {
      setLoading(true);
      const response = await axios.get(url);
      setPackages(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error in fetching plans", error);
    }
  };

  useEffect(() => {
    getCoinPackages();
  }, []);

  useEffect(() => {
    if (membership.membershipType == "Free") {
      navigation.navigate("SubscriptionPlans");
    }
  });
  return (
    <>
      {loading && (
        <GOHLoader/>
      )}
      {!loading && <View
        style={{
          flex: 1,
        }}
      >
        <WalletTopUp packages={packages} />
      </View>}
      {nonMemberPopUp && (
        <AwesomeAlert
          show={nonMemberPopUp}
          showProgress={false}
          title={"Not a Member"}
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
    </>
  );
};

export default TopUpScreen;

const styles = StyleSheet.create({});
