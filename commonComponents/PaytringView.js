import {
  BackHandler,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";
import { hp, wp } from "../helpers/common";
import { Colors } from "../assets/colors/color";
import AwesomeAlert from "react-native-awesome-alerts";
import { useTranslation } from "react-i18next";

const PaytringView = () => {
  const webview = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { callback, error_handler, order_id } = route?.params;
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const { t } = useTranslation();

  const [webViewOpen, setWebViewOpen] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

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
    <>
      <SafeAreaView style={{ flex: 1, height: hp(100), width: wp(100) }}>
        <View
          style={{
            width: "100%",
            backgroundColor: Colors.background,
            flexDirection: "row",
            justifyContent: "flex-start",
            padding: wp(4),
          }}
        >
          <TouchableOpacity
            style={{
              padding: 4,
              backgroundColor: Colors.white,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Colors.white,
              shadowColor: Colors.black,
              elevation: 10,
              shadowOffset: { height: 2 },
              shadowOpacity: 0.3,
            }}
            onPress={() => {
              setShowAlert(true);
            }}
          >
            <Text>{t("back")}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
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
        </View>
      </SafeAreaView>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Confirm"
        message="Are you sure you want to cancel your payment."
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Cancel"
        confirmButtonColor={Colors.primary}
        cancelButtonColor={Colors.grey.grey}
        cancelText="Yes, Go back"
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
        onCancelPressed={() => {
          error_handler?.();
          setShowAlert(false);
        }}
        onDismiss={() => {
          setShowAlert(false);
        }}
      />
    </>
  ) : null;
};

export default PaytringView;

const styles = StyleSheet.create({});
