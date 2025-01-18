import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import TransactionHistory from "../../components/subscription/TransactionHistory";
import { useSelector } from "react-redux";
import { hp, wp } from "../../helpers/common";
import GOHLoader from "../../commonComponents/GOHLoader";
import { Colors } from "../../assets/colors/color";

const AllTransactions = () => {
  const profile = useSelector((state) => state.profile.profile);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${SERVER_URL}/membership/getTransactions`,
          {
            phone: profile.phoneNumber,
          }
        );
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        crashlytics().log(`Error in getAllTransactions ${error}`);
        setLoading(false);
        console.log("Error in gettin all transactions ==>", error);
      }
    };

    getAllTransactions();
  }, []);

  return (
    <>
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
      {!loading && (
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.background,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: wp(95),
              // justifyContent: "center",
              alignItems: "center",
              height:hp(100)
            }}
          >
            <TransactionHistory transactions={transactions} />
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default AllTransactions;

const styles = StyleSheet.create({});
