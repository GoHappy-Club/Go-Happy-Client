import React, { Component, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import PhoneInput from "react-native-phone-number-input";
import analytics from "@react-native-firebase/analytics";

import Video from "react-native-video";

import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { Button } from "react-native-elements";
import { BottomSheet, ListItem } from "react-native-elements";

import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import LinearGradient from "react-native-linear-gradient";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import RenderHtml from "react-native-render-html";
import { PrivacyPolicy, TermOfUse } from "../../config/CONSTANTS.js";
import RNOtpVerify from "react-native-otp-verify";

const LoginScreen = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [showPhoneNumberError, setShowPhoneNumberError] = useState(false);
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loader, setLoader] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingVerifyButton, setLoadingVerifyButton] = useState(false);
  const [loadingResendButton, setLoadingResendButton] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [confirmResult, setConfirmResult] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state,setState]=useState("");
  const [city, setCity] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [conditionDialog, setConditionDialog] = useState(false);
  const [conditionText, setConditionText] = useState("");
  const [dob, setDob] = useState("");
  const [reachedBackendSignIn, setReachedBackendSignIn] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [source, setSource] = useState("");
  const [copiedText, setCopiedText] = useState("");
  const [fcmToken, setFcmToken] = useState("");
  const [unformattedNumber, setUnformattedNumber] = useState("");
  const phoneInput = useRef();

  useEffect(() => {
    console.log(
      "State updated inside useefect==>",
      name,
      email,
      city,
      emergencyContact
    );
  }, [name, email, city, emergencyContact]);

  useEffect(() => {
    getCurrentUserInfo();

    dynamicLinks().onLink((url) => {
      if (url) {
        setReferralCode(url.url.split("=")[1]);
      }
    });

    dynamicLinks()
      .getInitialLink()
      .then((url) => {
        if (url) {
          setReferralCode(url.url.split("=")[1]);
        }
      });

    RNOtpVerify.getOtp()
      .then((p) => RNOtpVerify.addListener(otpHandler))
      .catch((p) => {});

    return () => {
      RNOtpVerify.removeListener();
    };
  }, []);

  const otpHandler = (message) => {
    const otpList = message.match(/\b\d{6}\b/);
    if (otpList && otpList.length > 0) {
      const verificationCode = otpList[0];
      setVerificationCode(verificationCode);
    }
  };

  const setProfile = (
    name,
    email,
    phoneNumber,
    profileImage,
    token,
    plan,
    sessionsAttended,
    dateOfJoining,
    selfInviteCode,
    city,
    emergencyContact,
    fcmToken
  ) => {
    let { profile, actions } = props;
    profile = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      profileImage: profileImage,
      token: token,
      membership: plan,
      sessionsAttended: sessionsAttended,
      // dob: dob,
      dateOfJoining: dateOfJoining,
      selfInviteCode: selfInviteCode,
      city: city,
      emergencyContact: emergencyContact,
      fcmToken: fcmToken,
    };
    actions.setProfile(profile);
  };

  validatePhoneNumber = () => {
    const regex = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    if (unformattedNumber.length < 10) {
      setPhoneNumberError(
        "It looks like your phone number might be missing a few digits. Please enter a valid 10-digit phone number to continue."
      );
      setShowPhoneNumberError(true);
      return false;
    }
    if (unformattedNumber.length > 10) {
      setPhoneNumberError(
        "Your phone number seems to have more than 10 digits. Please double-check and enter a valid 10-digit number."
      );
      setShowPhoneNumberError(true);
      return false;
    }
    if (!regex.test(phoneNumber)) {
      setPhoneNumberError(
        "Please enter a valid 10-digit phone number to continue."
      );
      setShowPhoneNumberError(true);
      return false;
    }
    return true;
  };
  const handlePhoneNumberInput = (text) => {
    setPhoneNumber(text);
  };
  const handleSendCode = (resend) => {
    if (resend) {
      setLoadingButton(true);
    } else {
      setLoadingButton(true);
    }
    const state = {
      phoneNumber,
      phoneNumberError,
      showPhoneNumberError,
      password,
      showAlert,
      loader,
      loadingButton,
      loadingVerifyButton,
      loadingResendButton,
      userInfo,
      confirmResult,
      verificationCode,
      userId,
      email,
      name,
      city,
      emergencyContact,
      conditionDialog,
      conditionText,
      dob,
      reachedBackendSignIn,
      referralCode,
      source,
      copiedText,
      fcmToken,
    };

    crashlytics().log(JSON.stringify(state));
    if (validatePhoneNumber()) {
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber)
        .then((confirmResult) => {
          setConfirmResult(confirmResult);
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              setUserId(user.uid);
              try {
                _backendSignIn(
                  user.uid,
                  user.displayName,
                  "https://www.pngitem.com/pimgs/m/272-2720607_this-icon-for-gender-neutral-user-circle-hd.png",
                  user.phoneNumber
                );
              } catch (error) {}
            }
          });
          if (resend) {
            setLoadingResendButton(false);
          } else {
            setLoadingButton(false);
          }
        })
        .catch((error) => {
          crashlytics().recordError(JSON.stringify(error));
          alert(
            'There was some issue with the login, please close and open the app again and try. If you still face issues then click the "Contact Us" button.'
          );
          if (resend) {
            setLoadingResendButton(false);
          } else {
            setLoadingButton(false);
          }
        });
    } else {
      if (resend) {
        setLoadingResendButton(false);
      } else {
        setLoadingButton(false);
      }
    }
  };
  const changePhoneNumber = () => {
    setConfirmResult(null);
    setVerificationCode(null);
    setPhoneNumber(null);
  };
  const resendOtp = () => {
    const resend = true;
    handleSendCode(resend);
  };
  const handleVerifyCode = (code) => {
    if (code == null) {
      code = verificationCode;
    }
    // Request for OTP verification
    if (code.length == 6) {
      setLoadingVerifyButton(true);
    } else {
      setShowAlert(true);
      return;
    }

    if (code.length == 6) {
      confirmResult
        .confirm(code)
        .then((user) => {
          setUserId(user.user.uid);
          try {
            _backendSignIn(
              user.user.uid,
              user.user.displayName,
              "https://www.pngitem.com/pimgs/m/272-2720607_this-icon-for-gender-neutral-user-circle-hd.png",
              user.user.phoneNumber
            );
          } catch (error) {}
        })
        .catch((error) => {
          crashlytics().recordError(JSON.stringify(error));
          setLoadingVerifyButton(false);
          setShowAlert(true);
        });
    } else {
    }
  };

  const handleInputChange = (text) => {
    if (text.length <= 6 && /^[0-9]*$/.test(text)) {
      setVerificationCode(text);
    }
    if (text.length == 6 && /^[0-9]*$/.test(text)) {
      handleVerifyCode(text);
    }
  };

  renderConfirmationCodeView = () => {
    return (
      <View
        // behavior="height"
        // keyboardVerticalOffset={height / 10}
        style={styles.verificationView}
      >
        <TextInput
          style={styles.otp_input}
          onChangeText={handleInputChange}
          value={verificationCode}
          keyboardType="numeric"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          autoFocus
        />
        <Button
          outline
          style={[styles.themeButton, { paddingTop: 20 }]}
          title="Verify Code"
          loading={loadingVerifyButton}
          onPress={() => handleVerifyCode(null)}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#4c669f", "#3b5998", "#192f6a"],
            start: { x: 0, y: 0.25 },
            end: { x: 0.5, y: 1 },
            locations: [0, 0.5, 0.6],
          }}
        />
        <Button
          type="clear"
          title="Resend OTP"
          loading={loadingResendButton}
          onPress={resendOtp}
        />
        <Button
          type="clear"
          title="Re-Enter the Phone Number"
          loading={loadingButton}
          onPress={changePhoneNumber}
        />
      </View>
    );
  };
  const getCurrentUserInfo = async () => {
    console.log("runningn getCurrentUserInfo");
    try {
      const token1 = await AsyncStorage.getItem("token");
      const fcmToken1 = await firebase.messaging().getToken();
      AsyncStorage.setItem("fcmToken", fcmToken1);
      setFcmToken(fcmToken1);
      if (token1 != null) {
        const name = await AsyncStorage.getItem("name");
        const email = await AsyncStorage.getItem("email");
        const profileImage = await AsyncStorage.getItem("profileImage");
        const token = await AsyncStorage.getItem("token");
        const membership = await AsyncStorage.getItem("membership");
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");
        const sessionsAttended = await AsyncStorage.getItem("sessionsAttended");
        const dateOfJoining = await AsyncStorage.getItem("dateOfJoining");
        const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
        const city = await AsyncStorage.getItem("city");
        const emergencyContact = await AsyncStorage.getItem("emergencyContact");
        setProfile(
          name,
          email,
          phoneNumber,
          profileImage,
          token,
          membership,
          sessionsAttended,
          dateOfJoining,
          selfInviteCode,
          city,
          emergencyContact,
          fcmToken
        );
        axios
          .post(SERVER_URL + "/user/update", {
            fcmToken: fcmToken,
            phone: phoneNumber,
          })
          .then((response) => {})
          .catch((error) => {
            console.log(error);
          });
        props.navigation.replace("Additional Details", {
          navigation: props.navigation,
          email: email,
          phoneNumber: phoneNumber,
          name: name,
          dateOfJoining: dateOfJoining,
          city: city,
          emergencyContact: emergencyContact,
        });
        return;
      }
      setLoader(false);
    } catch (error) {}
  };
  const _backendSignIn = (token, name, profileImage, phone) => {
    if (reachedBackendSignIn == false) {
      setReachedBackendSignIn(true);
    } else {
      return;
    }
    if (name == null) {
      name = "";
    }
    var url = SERVER_URL + "/auth/login";
    axios
      .post(url, {
        token: token,
        name: name,
        profileImage: profileImage,
        phone: phone.substr(1),
        referralId: referralCode,
        source: source,
        fcmToken: fcmToken,
      })
      .then(async (response) => {
        console.log("inside then of backendsign");
        if (response.data && response.data != "ERROR") {
          if (response.data.phone != null) {
            AsyncStorage.setItem("phoneNumber", response.data.phone);
          }
          if (response.data.name != null) {
            AsyncStorage.setItem("name", response.data.name);
          }
          if (response.data.email != null) {
            AsyncStorage.setItem("email", response.data.email);
          }
          if (response.data.emergencyContact != null) {
            AsyncStorage.setItem(
              "emergencyContact",
              response.data.emergencyContact
            );
          }
          if (response.data.city != null) {
            AsyncStorage.setItem("city", response.data.city);
          }
          setName(response.data.name);
          setEmail(response.data.email);
          setCity(response.data.city);
          setEmergencyContact(response.data.emergencyContact);
          if (response.data.profileImage != null) {
            AsyncStorage.setItem("profileImage", response.data.profileImage);
          }
          AsyncStorage.setItem("token", token);
          AsyncStorage.setItem("membership", response.data.membership);
          AsyncStorage.setItem(
            "sessionsAttended",
            response.data.sessionsAttended
          );
          AsyncStorage.setItem("dateOfJoining", response.data.dateOfJoining);
          AsyncStorage.setItem("selfInviteCode", response.data.selfInviteCode);
          setProfile(
            response.data.name,
            response.data.email,
            response.data.phone,
            response.data.profileImage,
            token,
            response.data.membership,
            response.data.sessionsAttended,
            response.data.dateOfJoining,
            response.data.selfInviteCode,
            response.data.city,
            response.data.emergencyContact,
            fcmToken
          );
          console.log(
            "response ==>",
            response.data.name,
            response.data.email,
            response.data.city,
            response.data.emergencyContact
          );

          console.log("setted==>", email, city, emergencyContact);
          if (pending(response.data.phone, response.data.name)) {
            props.navigation.replace("Additional Details", {
              navigation: props.navigation,
              email: response.data.email,
              phoneNumber: response.data.phone,
              name: response.data.name,
              state: state,
              city: response.data.city,
              emergencyContact: response.data.emergencyContact,
              // dob: response.data.dob,
              dateOfJoining: response.data.dateOfJoining,
            });
            return;
          } else {
            await analytics().logEvent("login_click", {
              phoneNumber: phoneNumber,
              email: email,
              name: name,
            });
            setLoader(true);
            props.navigation.replace("GoHappy Club");
            setLoader(false);
          }
        } else if (response.data == "ERROR") {
          setShowAlert(true);
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("inside catch of backendsign", error);

        ////console.log(error);
      });
  };
  const pending = (phoneNumber, name) => {
    console.log("inside pending==>", "phone==>", phoneNumber, "name==>", name);
    if (
      phoneNumber == null ||
      phoneNumber.length == 0 ||
      name == null ||
      name.length == 0
    ) {
      return true;
    }
    return false;
  };
  const showConditions = (type) => {
    if (type == 0) {
      const { width } = Dimensions.get("window");
      setConditionText(TermOfUse);
    } else {
      setConditionText(PrivacyPolicy);
    }
    var flag = !conditionDialog;
    setConditionDialog(flag);
  };
  if (loader == true) {
    return (
      <Video
        source={require("../../images/logo_splash.mp4")}
        style={{
          position: "absolute",
          backgroundColor: "white",
          top: 0,
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 1,
        }}
        muted={true}
        repeat={true}
        resizeMode="cover"
      />
    );
  }
  return (
    <View style={styles.container}>
      <View style={{ width: "40%", marginLeft: "auto" }}>
        <Button
          style={{ marginLeft: "auto" }}
          type="clear"
          title="Contact Us"
          // loading={this.loadingResendButton}
          onPress={() => {
            Linking.openURL(
              "https://wa.me/7888384477?text=Hi%20GoHappy%20Club%20Team%2C%20%0ACan%20you%20please%20help%20me%3F%0AI%20am%20facing%20trouble%20with%20login"
            );
          }}
        />
      </View>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={height/10}>
      <Image
        resizeMode="contain"
        style={styles.logo}
        source={require("../../images/logo.png")}
      />

      <Text
        style={{
          fontWeight: "normal",
          fontSize: 30,
          color: "black",
          alignSelf: "center",
        }}
      >
        LOGIN or SIGN UP
      </Text>
      {!confirmResult && (
        <View
          style={styles.page}
          behavior="height"
          keyboardVerticalOffset={100}
        >
          <PhoneInput
            style={styles.textInput}
            ref={phoneInput}
            keyboardType="phone-pad"
            defaultCode="IN"
            layout="first"
            onChangeFormattedText={handlePhoneNumberInput}
            withDarkTheme
            maxLength={10}
            withShadow
            autoFocus
          />
          <Text style={{ width: "80%" }}>
            <Text
              style={{
                paddingTop: 10,
                width: "80%",
                color: "grey",
                fontSize: 12,
              }}
            >
              By signing up, I agree to the{" "}
            </Text>
            <Text
              style={{ color: "blue", width: "80%", fontSize: 12 }}
              onPress={() => showConditions(0)}
            >
              Terms of Use
            </Text>
            <Text style={{ width: "80%", color: "grey", fontSize: 12 }}>
              {" "}
              and{" "}
            </Text>
            <Text
              style={{ color: "blue", width: "80%", fontSize: 12 }}
              onPress={() => showConditions(1)}
            >
              Privacy Policy
            </Text>
            <Text style={{ width: "80%", color: "grey", fontSize: 12 }}>
              , including usage of cookies.
            </Text>
          </Text>

          <>
            <BottomSheet modalProps={{}} isVisible={conditionDialog}>
              <Text style={styles.title}>Please Read Below</Text>
              <ListItem key="1">
                <ListItem.Content>
                  <ListItem.Title>
                    <View style={{ width: width * 0.9 }}>
                      <RenderHtml source={conditionText} />
                    </View>
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                key="2"
                containerStyle={{ backgroundColor: "blue" }}
                onPress={() => showConditions(1)}
              >
                <ListItem.Content>
                  <ListItem.Title style={styles.buttonBottomSheet}>
                    Accept
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </BottomSheet>
          </>

          <Button
            outline
            style={[styles.themeButton, { paddingTop: 20 }]}
            title={"Login"}
            loading={loadingButton}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#4c669f", "#3b5998", "#192f6a"],
              start: { x: 0, y: 0.25 },
              end: { x: 0.5, y: 1 },
              locations: [0, 0.5, 0.6],
            }}
            onPress={() => handleSendCode(false)}
          />
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                "https://wa.me/7888384477?text=Hi%20GoHappy%20Club%20Team%2C%20%0ACan%20you%20please%20help%20me%3F%0AI%20am%20facing%20trouble%20with%20login"
              );
            }}
          >
            <Text style={{ color: "#4c669f", fontSize: 14 }}>
              Trouble logging in? Contact Us
            </Text>
          </TouchableOpacity>
          <AwesomeAlert
            show={showPhoneNumberError}
            showProgress={false}
            title="Error"
            message={phoneNumberError}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showConfirmButton={true}
            confirmButtonColor="#29BFC2"
            confirmText="Try Again"
            onConfirmPressed={() => {
              setShowPhoneNumberError(false);
            }}
          />
        </View>
      )}
      {confirmResult && (
        <View style={styles.page}>{renderConfirmationCodeView()}</View>
      )}
      </KeyboardAvoidingView>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Login Error"
        message="Invalid Credentials"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Try Again"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </View>
  );
};
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: "30%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fffaf1",
  },
  containerX: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  titleX: {
    fontSize: 22,
    alignSelf: "center",
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcP: {
    marginTop: 10,
    fontSize: 12,
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: height * 0.7,
  },

  button: {
    backgroundColor: "#136AC7",
    borderRadius: 5,
    padding: 10,
  },

  buttonBottomSheet: {
    color: "white",
    alignSelf: "center",
  },

  buttonDisabled: {
    backgroundColor: "#999",
    borderRadius: 5,
    padding: 10,
  },

  buttonLabel: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center",
  },
  container1: {
    flex: 1,
    backgroundColor: "#fffaf1",
    justifyContent: "space-around",
  },
  otp_input: {
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 18,
    borderRadius: 8,
    textAlign: "center",
    color: "black",
  },
  input: {
    width: "90%",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  userBtn: {
    backgroundColor: "#f0ad4e",
    paddingVertical: 15,
    height: 60,
  },
  btnTxt: {
    fontSize: 20,
    textAlign: "center",
    color: "black",
    fontWeight: "700",
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: "white",
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    // marginTop: -20,
    // marginRight: -20
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },

  newinput: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
    color: "white",
    paddingHorizontal: 10,
  },
  container2: {
    flex: 1,
    backgroundColor: "#aaa",
  },
  title2: {
    color: "white",
    marginTop: "30%",
    marginBottom: 10,
    opacity: 0.9,
    textAlign: "center",
    fontSize: 30,
  },
  cover: {
    flex: 1,
    justifyContent: "center",
    marginBottom: -10,
    // width:600,height:'100%'
  },
  page: {
    marginTop: "10%",
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 200
  },
  textInput: {
    width: "90%",
    height: 40,
    borderColor: "#555",
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    color: "#000",
    fontSize: 16,
  },
  themeButton: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  themeButtonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  verificationView: {
    width: "100%",
    alignItems: "center",
    // marginTop: 50
  },
  underlineStyleBase: {
    borderColor: "black",
    color: "black",
  },

  underlineStyleHighLighted: {
    borderColor: "black",
  },
});

const mapStateToProps = (state) => ({
  profile: state.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
