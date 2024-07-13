import { getPayload } from "../../services/PhonePe/PaymentServices";
import React, { Component } from "react";

import PhonePePaymentSDK from "react-native-phonepe-pg";

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiEndPoint: "/pg/v1/pay",
      merchantId: "GOHAPPYCLUBONLINE",
      appId: "",
      checksum:
        "b9e20ef4d7e972fad89ff89bb93feab4c1f28d4f0db2149a25be8493a2a1a2d2###1",
      openEnvironment: false,
      environmentDropDownValue: "PRODUCTION",
      environments: [
        { label: "SANDBOX", value: "SANDBOX" },
        { label: "PRODUCTION", value: "PRODUCTION" },
      ],
      packageName: "",
      callbackURL: "reactDemoAppScheme",
      phonePeAppInstalled: false,
      gPayAppInstalled: false,
      paytmAppInstalled: false,
      message: "Message: ",
      // shareableLink: "",
    };
    // this.phonePe();
  }
  PaymentError() {
    return "Your payment could not be processed. Please try again later.";
  }
  async phonePeShare(phone, amount, callback, error_handler, paymentType) {
    payload = await getPayload(phone, amount * 100, paymentType);
    requestBody = payload.requestBody;
    checksum = payload.checksum;
    const options = {
      method: "post",
      url: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: requestBody,
      },
    };
    try {
      const response = await axios.request(options);
    const shareableLink =
      response.data.data.instrumentResponse.redirectInfo.url;
    return shareableLink
    } catch (error) {
      console.log("Error in paymentjs==>", error)
    }
    
  }
  phonePe(phone, amount, callback, error_handler, paymentType) {
    //console.log('phonepe')
    PhonePePaymentSDK.init(
      this.state.environmentDropDownValue,
      this.state.merchantId,
      this.state.appId,
      true
    )
      .then((result) => {
        this.setState({
          message: "Message: SDK Initialisation ->" + JSON.stringify(result),
        });
        //console.log(result)
        this.startTransaction(
          phone,
          amount,
          callback,
          error_handler,
          paymentType
        );
      })
      .catch((error) => {
        this.setState({
          message: "error:" + error.message,
        });
        error_handler(error);
      });
    //console.log(error)
  }
  async startTransaction(phone, amount, callback, error_handler, paymentType) {
    payload = await getPayload(phone, amount * 100, paymentType);
    console.log(payload);
    requestBody = payload.requestBody;
    checksum = payload.checksum;
    PhonePePaymentSDK.startTransaction(
      requestBody,
      checksum,
      this.state.packageName,
      this.state.callbackURL
    )
      .then((a) => {
        console.log(a);
        this.setState({
          message: JSON.stringify(a),
        });
        if (a.status == "SUCCESS") {
          callback(phone);
        } else {
          throw Error;
        }
      })
      .catch((error) => {
        this.setState({
          message: error.message,
        });
        error_handler();
      });
  }
  handleIsPhonePeAppInstalled() {
    PhonePePaymentSDK.isPhonePeInstalled()
      .then((a) => {
        setPhonePeAppInstalled(a);
        if (a) {
          setMessage("Message: PhonePe App Installed");
        } else {
          setMessage("Message: PhonePe App Unavailable");
        }
      })
      .catch((error) => {
        setMessage("error:" + error.message);
      });
  }
  handleIsGPayAppInstalled() {
    PhonePePaymentSDK.isGPayAppInstalled()
      .then((a) => {
        setGPayAppInstalled(a);
        if (a) {
          setMessage("Message: Gpay App Installed");
        } else {
          setMessage("Message: Gpay App Unavailable");
        }
      })
      .catch((error) => {
        setMessage("error:" + error.message);
      });
  }

  handleIsPaytmInstalled() {
    PhonePePaymentSDK.isPaytmAppInstalled()
      .then((a) => {
        setPaytmAppInstalled(a);
        if (a) {
          setMessage("Message: Paytm App Installed");
        } else {
          setMessage("Message: Paytm App Unavailable");
        }
      })
      .catch((error) => {
        setMessage("error:" + error.message);
      });
  }

  getPackageSignatureForAndroid() {
    if (Platform.OS === "android") {
      PhonePePaymentSDK.getPackageSignatureForAndroid()
        .then((packageSignture) => {
          setMessage(JSON.stringify(packageSignture));
        })
        .catch((error) => {
          setMessage("error:" + error.message);
        });
    }
  }

  getUpiAppsForAndroid() {
    if (Platform.OS === "android") {
      PhonePePaymentSDK.getUpiAppsForAndroid()
        .then((upiApps) => {
          if (upiApps != null) setMessage(JSON.stringify(JSON.parse(upiApps)));
        })
        .catch((error) => {
          setMessage("error:" + error.message);
        });
    }
  }
}

const phonepe_payments = new Payments();
export default phonepe_payments;
