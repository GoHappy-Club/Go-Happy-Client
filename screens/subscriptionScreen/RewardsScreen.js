import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Rewards from "../../components/Rewards";
import GOHLoader from "../../commonComponents/GOHLoader";

const RewardsScreen = () => {
  const [rewards, setRewards] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const profile = useSelector((state) => state.profile.profile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRewards = async () => {
      setLoading(true);
      try {
        const response1 = await axios.post(
          `${SERVER_URL}/membership/getRewards`,
          {
            phone: profile.phoneNumber,
          }
        );
        const response2 = await axios.post(
          `${SERVER_URL}/membership/getVouchers`,
          {
            phone: profile.phoneNumber,
          }
        );
        setRewards(response1.data);
        setVouchers(response2.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error in getting rewards ==>", error);
      }
    };

    getRewards();
  }, []);

  return (
    <>
      {loading && <GOHLoader />}
      {!loading && (
        <View>
          <Rewards rewards={rewards} vouchers={vouchers} />
        </View>
      )}
    </>
  );
};

export default RewardsScreen;

const styles = StyleSheet.create({});
