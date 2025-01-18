import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Rewards from "../../components/Rewards/Rewards";
import GOHLoader from "../../commonComponents/GOHLoader";

const RewardsScreen = () => {
  const [rewards, setRewards] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const profile = useSelector((state) => state.profile.profile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateVouchers = async (voucherIds) => {
      try {
        const res = await axios.post(
          `${SERVER_URL}/membership/updateVoucher?toExpire=true`,
          {
            voucherIds,
          }
        );
      } catch (error) {
        console.log("Error in updating vouchers ==>", error);
        crashlytics().log(`Error in updateVouchers RewardsScreen ${error}`)
      }
    };
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
        const currTime = new Date().getTime();
        const newVouchers = response2?.data?.filter((voucher) => {
          if (
            (voucher.expiryDate < currTime ||
              voucher.parentExpiryDate < currTime) &&
            voucher.status == "ACTIVE"
          ) {
            voucher.status = "EXPIRED";
            return voucher;
          } else if (voucher.parentStatus != "ACTIVE") {
            voucher.status = "EXPIRED";
            return voucher;
          }
        });
        const expiredVouchersIds = newVouchers
          .filter((i) => i.status == "EXPIRED")
          .map((i) => i.id);
        console.log(expiredVouchersIds);
        // setVouchers(newVouchers);
        setVouchers(response2.data);
        setLoading(false);
        await updateVouchers(expiredVouchersIds);
      } catch (error) {
        crashlytics().log(`Error in getRewards RewardsScreen ${error}`)
        setLoading(false);
        console.log("Error in getting rewards ==>", error);
      }
    };

    getRewards();
  }, []);

  return (
    <>
      <View>
        <Rewards rewards={rewards} vouchers={vouchers} loading={loading} />
      </View>
    </>
  );
};

export default RewardsScreen;

const styles = StyleSheet.create({});
