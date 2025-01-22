import { BackHandler, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Paytring from "react-native-paytring";
import { useNavigation, useRoute } from "@react-navigation/native";

const PaytringView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { callback, error_handler, order_id } = route?.params;
  return (
    <Paytring
      init={(args) => {
        args.open(order_id);
      }}
      success={() => {
        callback();
      }}
      failure={() => {
        error_handler();
      }}
    />
  );
};

export default PaytringView;

const styles = StyleSheet.create({});
