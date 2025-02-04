import { BackHandler, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";
import { verifyPayment } from "../helpers/VerifyPayment";

const PaytringView = () => {
  const webview = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();
  // const order_id = "726840485091477669";
  const { callback, error_handler, order_id } = route?.params;
  console.log("ORDER ID", order_id);
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [webViewOpen, setWebViewOpen] = useState(false);

  // useEffect(() => {
  //   const backAction = () => {
  //     if (webViewOpen) {
  //       console.log("here");
  //       setWebViewOpen(false);
  //       return true;
  //     } else {
  //       console.log("here1");
  //       setWebViewOpen(false);
  //       navigation.goBack();
  //       return true;
  //     }
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, [webViewOpen]);

  const messageHandler = (event) => {
    console.log(event);
    console.log(event.nativeEvent);
    // const message = event.nativeEvent.data;
    // console.log(message);
    // if (message === "payment.success") {
    //   success?.();
    //   setOrderId("");
    // } else if (message === "payment.failed") {
    //   failure?.();
    //   setOrderId("");
    // } else if (message === "payment.close") {
    //   failure?.();
    //   setOrderId("");
    // } else {
    //   failure?.();
    //   setOrderId("");
    // }
  };

  const progressHandler = async (nativeEvent) => {
    console.log("URL", nativeEvent?.url);
    const url = nativeEvent?.url;
    if (url.includes("callback")) {
      const response = await verifyPayment(order_id);
      console.log("RESPONSE", response);
    }
  };

  return (
    <View style={{ position: "absolute", top: 0, left: 0, zIndex: 9999 }}>
      <WebView
        ref={webview}
        scalesPageToFit={true}
        source={{
          // html: `<!DOCTYPE html><html><head><title>Mobile View</title></head><body><script>document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');</script><style>body { margin: 0; } iframe { width: 100vw; height: 100vh; border: none; }</style><iframe src='${`https://api.paytring.com/pay/token/${order_id}`}' style='min-width: 100vw; min-height: 100vh; border: 0;'></iframe></body></html>`,
          uri: `https://api.paytring.com/pay/token/${order_id}`,
        }}
        onLoadProgress={({ nativeEvent }) => progressHandler(nativeEvent)}
        style={{
          width: deviceWidth,
          height: deviceHeight,
          zIndex: 999999,
        }}
        javaScriptEnabled={true}
        // userAgent={
        //   "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        // }
        injectedJavaScript={`
          window.addEventListener('message', (e) => {
            console.log(e.data);
            if (e.data.eventname === 'Transaction_Status') {
                window.ReactNativeWebView.postMessage("payment." + e.data.data);
            }
          });
        `}
        onMessage={messageHandler}
      />
    </View>
  );
};

export default PaytringView;

const styles = StyleSheet.create({});
