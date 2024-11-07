import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Wallet from "../../components/subscription/Wallet";
import { useSelector } from "react-redux";
import Video from "react-native-video";
import GOHLoader from "../../commonComponents/GOHLoader";

const WalletScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const profile = useSelector((state) => state.profile.profile);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${SERVER_URL}/membership/getRecentTransactions`,
          {
            phone: profile.phoneNumber,
          }
        );
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error in getting transaction ==>", error);
      }
    };
    getTransactions();
  }, []);
  return (
    <>
      {loading && (
        <GOHLoader/>
      )}
      {!loading && (
        <View>
          <Wallet transactions={transactions}/>
        </View>
      )}
    </>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({});
