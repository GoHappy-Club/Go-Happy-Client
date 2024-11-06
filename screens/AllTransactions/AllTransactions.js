import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import TransactionHistory from "../../components/subscription/TransactionHistory";
import { useSelector } from "react-redux";
import { wp } from "../../helpers/common";
import Video from "react-native-video";

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
        setLoading(false);
        console.log("Error in gettin all transactions ==>", error);
      }
    };

    getAllTransactions();
  }, []);
  
  return (
    <>
      {loading && (
        <Video
          source={require("../../images/logo_splash.mp4")}
          style={{
            position: "absolute",
            top: 0,
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 1,
          }}
          muted={true}
          repeat={true}
          resizeMode="cover"
        />
      )}
      {!loading && (
        <View
          style={{
            flex: 1,
            // justifyContent: "center",
            alignItems: "center",
            height: wp(100),
            backgroundColor: "#FFF5D7",
          }}
        >
          <TransactionHistory transactions={transactions} />
        </View>
      )}
    </>
  );
};

export default AllTransactions;

const styles = StyleSheet.create({});
