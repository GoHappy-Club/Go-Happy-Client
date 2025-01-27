import { BackHandler, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Paytring from "react-native-paytring";
import { useNavigation, useRoute } from "@react-navigation/native";

const PaytringView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { callback, error_handler, order_id } = route?.params;

  const [webViewOpen, setWebViewOpen] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (webViewOpen) {
        console.log("here");
        setWebViewOpen(false);
        return true;
      } else {
        console.log("here1");
        setWebViewOpen(false);
        navigation.goBack();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [webViewOpen]);

  return (
    <Paytring
      init={(args) => {
        setWebViewOpen(true);
        args.open(order_id);
      }}
      success={() => {
        setWebViewOpen(false);
        callback();
      }}
      failure={() => {
        setWebViewOpen(false);
        error_handler();
      }}
    />
  );
};

export default PaytringView;

const styles = StyleSheet.create({});
