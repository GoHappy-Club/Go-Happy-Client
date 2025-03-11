import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useSelector } from "react-redux";

import { Colors } from "../../assets/colors/color";
import GOHLoader from "../../commonComponents/GOHLoader";
import Wallet from "../../components/subscription/Wallet";

const WalletScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setLoading(true);
        const response = await globalThis.axios.post(
          `${globalThis.SERVER_URL}/membership/getRecentTransactions`,
          {
            phone: profile.phoneNumber,
          },
        );
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        globalThis
          .crashlytics()
          .log(`Error in getRecentTransactions WalletScreen ${error}`);
        setLoading(false);
        console.log("Error in getting transaction ==>", error);
      }
    };
    getTransactions();
  }, [membership]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
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
      {!loading && <Wallet transactions={transactions} />}
    </SafeAreaView>
  );
};

export default WalletScreen;
