import { BackHandler, Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";

const PaytringView = () => {
  const webview = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { callback, error_handler, order_id } = route?.params;
  console.log("ORDER ID", order_id);
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [webViewOpen, setWebViewOpen] = useState(true);

  useEffect(() => {
    const backAction = () => {
      setWebViewOpen(false);
      error_handler?.();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [webViewOpen]);

  const progressHandler = async (nativeEvent) => {
    const url = nativeEvent?.url;
    if (url.includes("callback") || url.includes("/order/cancellation")) {
      setWebViewOpen(false);
      navigation.navigate("PaymentProcessing", {
        callback: callback,
        error_handler: error_handler,
        order_id: order_id,
      });
    }
  };

  return webViewOpen ? (
    <SafeAreaView style={{ position: "absolute", top: 0, left: 0, zIndex: 9999 }}>
      <WebView
        ref={webview}
        scalesPageToFit={true}
        source={{
          uri: `https://api.paytring.com/pay/token/${order_id}`,
        }}
        onLoadStart={({ nativeEvent }) => progressHandler(nativeEvent)}
        style={{
          width: deviceWidth,
          height: deviceHeight,
          zIndex: 999999,
        }}
        javaScriptEnabled={true}
        userAgent={
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        }
        injectedJavaScript={`
          window.addEventListener('message', (e) => {
            console.log(e.data);
            if (e.data.eventname === 'Transaction_Status') {
                window.ReactNativeWebView.postMessage("payment." + e.data.data);
            }
          });
        `}
      />
    </SafeAreaView>
  ) : null;
};

export default PaytringView;

const styles = StyleSheet.create({});
