import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../assets/colors/color";
import GOHLoader from "../../commonComponents/GOHLoader";
import SubscriptionPlans from "../../components/subscription/SubscriptionPlans";

const SubscriptionScreen = () => {
  // pass this subscription plans as a prop to the child component
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPlans = async () => {
    //get all subscription plans by api
    const url = globalThis.SERVER_URL + "/membership/listAll";
    try {
      setLoading(true);
      const response = await globalThis.axios.get(url);
      const plansToShow = response.data.filter(
        (plan) => plan.membershipType != "Free",
      );
      setPlans(plansToShow);
      setLoading(false);
    } catch (error) {
      globalThis
        .crashlytics()
        .log(`Error in getPlans SubscriptionScreen ${error}`);
      setLoading(false);
      console.log("Error in fetching plans", error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.background,
      }}
    >
      {loading && (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
          }}
        >
          <GOHLoader />
        </View>
      )}
      {!loading && <SubscriptionPlans plans={plans} />}
    </SafeAreaView>
  );
};

export default SubscriptionScreen;
