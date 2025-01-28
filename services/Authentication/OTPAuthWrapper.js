import axiosOg from "axios";
import Config from "react-native-config";
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";

const GUPSHUP_BASE_URL = "https://enterprise.smsgupshup.com/GatewayAPI/rest";

const OTPAuthWrapper = {
  GupshupWrapper: {
    sendOtp: (phoneNumber) => {
      const messageTemplate =
        "Dear User,\n\n" +
        "Your OTP for login to GoHappy Club is %code%. This code is valid for 30 minutes. Please do not share this OTP.\n\n" +
        "Regards,\nGoHappy Club Team";

      return axiosOg.get(GUPSHUP_BASE_URL, {
        params: {
          userid: Config.GS_USER_ID,
          password: Config.GS_PASSWORD,
          method: "TWO_FACTOR_AUTH",
          v: "1.1",
          phone_no: phoneNumber,
          format: "text",
          otpCodeLength: "6",
          otpCodeType: "NUMERIC",
          msg: messageTemplate,
        },
      });
    },

    verifyOtp: async (phoneNumber, code) => {
      // Implementation for OTP verification
      return axiosOg.get(GUPSHUP_BASE_URL, {
        params: {
          userid: Config.GS_USER_ID,
          password: Config.GS_PASSWORD,
          method: "TWO_FACTOR_AUTH",
          v: "1.1",
          phone_no: phoneNumber,
          otp_code: code,
        },
      });
    },
  },

  FirebaseWrapper: {
    sendOtp: async (phoneNumber) => {
      return firebase.auth().signInWithPhoneNumber(phoneNumber);
    },

    verifyOtp: async (confirmResult, code) => {
      return confirmResult.confirm(code);
    },
  },
};

export default OTPAuthWrapper;
