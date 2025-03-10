import axios from "axios";
import { Component } from "react";
import { Platform } from "react-native";
import PhonePePaymentSDK from "react-native-phonepe-pg";

import { getPayload } from "../../services/PhonePe/PaymentServices";

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiEndPoint: "/pg/v1/pay",
      merchantId: "GOHAPPYCLUBONLINE",
      appId: null,
      // checksum:
      //   "b9e20ef4d7e972fad89ff89bb93feab4c1f28d4f0db2149a25be8493a2a1a2d2###1",
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
  async phonePeShare(
    phone,
    amount,
    error_handler,
    paymentType,
    orderId = null,
    tambolaTicket = null,
    membershipId,
    coinsToGive = null,
  ) {
    let payload = await getPayload(
      phone,
      amount * 100,
      paymentType,
      orderId,
      tambolaTicket,
      membershipId,
      coinsToGive,
    );
    let requestBody = payload.requestBody;
    let checksum = payload.checksum;
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
      let shareableLink =
        response.data.data.instrumentResponse.redirectInfo.url;
      const shortenLinkApi =
        "https://ulvis.net/api.php?url=" + shareableLink + "&private=1";
      await axios
        .request({
          method: "get",
          url: shortenLinkApi,
        })
        .then((re) => {
          console.log(re.data);
          shareableLink = re.data;
        })
        .catch((err) => {
          console.error(err);
        });
      return shareableLink;
    } catch (error) {
      console.log("Error in phonePeShare", error);
      error_handler();
    }
  }
  phonePe(
    phone,
    amount,
    callback,
    error_handler,
    paymentType,
    orderId = null,
    tambolaTicket = null,
    membershipId,
    coinsToGive = null,
  ) {
    console.log(orderId, tambolaTicket);
    const _this = this;
    PhonePePaymentSDK.init(
      _this.state.environmentDropDownValue,
      _this.state.merchantId,
      _this.state.appId,
      true,
    )
      .then(async (result) => {
        console.log("init success", result);
        // _this.setState({
        //   message: "Message: SDK Initialisation ->",
        // });
        console.log(_this.state.message);
        await _this.startTransaction(
          phone,
          amount,
          callback,
          error_handler,
          paymentType,
          membershipId,
          coinsToGive,
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
  async startTransaction(
    phone,
    amount,
    callback,
    error_handler,
    paymentType,
    membershipId,
    coinsToGive,
  ) {
    let payload = await getPayload(
      phone,
      amount * 100,
      paymentType,
      null,
      null,
      membershipId,
      coinsToGive,
    );
    let requestBody = payload.requestBody;
    let checksum = payload.checksum;
    console.log(checksum);
    console.log(requestBody);
    PhonePePaymentSDK.startTransaction(
      requestBody,
      checksum,
      // this.state.packageName,
      // this.state.callbackURL
      null,
      "gohappyclub",
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
  getPackageSignatureForAndroid() {
    if (Platform.OS === "android") {
      PhonePePaymentSDK.getPackageSignatureForAndroid()
        .then((packageSignture) => {
          this.setState({ message: JSON.stringify(packageSignture) });
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
    }
  }

  getUpiAppsForAndroid() {
    if (Platform.OS === "android") {
      PhonePePaymentSDK.getUpiAppsForAndroid()
        .then((upiApps) => {
          if (upiApps != null)
            this.setState({ message: JSON.stringify(JSON.parse(upiApps)) });
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
    }
  }
}

const phonepe_payments = new Payments();
export default phonepe_payments;
