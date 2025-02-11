import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import axios from "../../config/CustomAxios";

const GUPSHUP_BASE_URL = "https://enterprise.smsgupshup.com/GatewayAPI/rest";

const OTPAuthWrapper = {
  GupshupWrapper: {
    sendOtp: (phoneNumber) => {
      return axios.post(`${SERVER_URL}/auth/init`, {
        phone: phoneNumber,
      });
    },

    verifyOtp: async (phoneNumber, code) => {
      // Implementation for OTP verification
      return axios.post(`${SERVER_URL}/auth/verify`, {
        phone: phoneNumber,
        otp: code,
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
