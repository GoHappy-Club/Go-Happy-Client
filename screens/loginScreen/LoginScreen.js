import React, { Component } from "react";
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
  SafeAreaView,
} from "react-native";
//import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import PhoneInput from "react-native-phone-number-input";
import analytics from "@react-native-firebase/analytics";

import Video from "react-native-video";

import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { Button } from "react-native-elements";
import { BottomSheet, ListItem } from "react-native-elements";

import { connect } from "react-redux";
import { setMembership, setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import LinearGradient from "react-native-linear-gradient";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import RenderHtml from "react-native-render-html";
import { PrivacyPolicy, TermOfUse } from "../../config/CONSTANTS.js";
import RNOtpVerify from "react-native-otp-verify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../assets/colors/color.js";
import GOHLoader from "../../commonComponents/GOHLoader.js";
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      phoneNumberError: "",
      showPhoneNumberError: false,
      password: "",
      showAlert: false,
      loader: true,
      loadingButton: false,
      loadingVerifyButton: false,
      loadingResendButton: false,
      userInfo: null,
      confirmResult: null,
      verificationCode: "",
      userId: "",
      email: "",
      name: "",
      state: "",
      city: "",
      emergencyContact: "",
      conditionDialog: false,
      conditionText: "",
      dob: "",
      reachedBackendSignIn: false,
      referralCode: "",
      source: "",
      copiedText: "",
      fcmToken: "",
      unformattedNumber: null,
    };
    this.getCurrentUserInfo();
    console.log("here");
  }
  componentDidMount() {
    dynamicLinks().onLink((url) => {
      if (url === null) {
        return;
      }
      this.setState({ referralCode: url.url.split("=")[1] });
    });
    dynamicLinks()
      .getInitialLink()
      .then((url) => {
        if (url === null) {
          return;
        }
        this.setState({ referralCode: url.url.split("=")[1] });
      });

    RNOtpVerify.getOtp()
      .then((p) => {
        RNOtpVerify.addListener(this.otpHandler);
      })
      .catch((p) => {});
  }

  componentWillUnmount() {
    RNOtpVerify.removeListener();
  }

  otpHandler = (message) => {
    const otpList = message.match(/\b\d{6}\b/);
    if (otpList && otpList.length > 0) {
      const verificationCode = otpList[0];
      this.setState({ verificationCode: verificationCode });
    }
  };

  setMembership({
    membershipType,
    id,
    membershipStartDate,
    membershipEndDate,
    coins,
    vouchers,
    freeTrialUsed,
    freeTrialActive,
  }) {
    let { membership, actions } = this.props;

    membership = {
      membershipType: membershipType,
      id: id,
      membershipStartDate: membershipStartDate,
      membershipEndDate: membershipEndDate,
      coins: coins,
      vouchers: vouchers,
      freeTrialUsed: freeTrialUsed,
      freeTrialActive: freeTrialActive,
    };
    actions.setMembership({ ...membership });
  }

  setProfile(
    name,
    email,
    phoneNumber,
    profileImage,
    token,
    sessionsAttended,
    dateOfJoining,
    selfInviteCode,
    city,
    emergencyContact,
    fcmToken,
    age,
    dob
  ) {
    let { profile, actions } = this.props;
    profile = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      profileImage: profileImage,
      token: token,
      sessionsAttended: sessionsAttended,
      // dob: dob,
      dateOfJoining: dateOfJoining,
      selfInviteCode: selfInviteCode,
      city: city,
      emergencyContact: emergencyContact,
      fcmToken: fcmToken,
      age: age,
      dob: dob,
    };
    actions.setProfile(profile);
  }

  validatePhoneNumber = () => {
    const regex = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    const unformattedNumber = this.state.unformattedNumber;
    if (unformattedNumber == null) {
      this.setState(
        {
          phoneNumberError: "Please enter a phone number first.",
        },
        () => {
          this.setState({ showPhoneNumberError: true });
        }
      );
      return false;
    }
    if (unformattedNumber.length < 10) {
      this.setState(
        {
          phoneNumberError:
            "It looks like your phone number might be missing a few digits. Please enter a valid 10-digit phone number to continue.",
        },
        () => {
          this.setState({ showPhoneNumberError: true });
        }
      );
      return false;
    }
    if (unformattedNumber.length > 10) {
      this.setState(
        {
          phoneNumberError:
            "Your phone number seems to have more than 10 digits. Please double-check and enter a valid 10-digit number.",
        },
        () => {
          this.setState({ showPhoneNumberError: true });
        }
      );
      return false;
    }
    if (!regex.test(this.state.phoneNumber)) {
      this.setState(
        {
          phoneNumberError:
            "Please enter a valid 10-digit phone number to continue.",
        },
        () => {
          this.setState({ showPhoneNumberError: true });
        }
      );
      return false;
    }
    return true;
  };
  handlePhoneNumberInput = (text) => {
    this.setState({ phoneNumber: text });
  };
  handleSendCode = (resend) => {
    // Request to send OTP
    if (resend) {
      this.setState({ loadingResendButton: true });
    } else {
      this.setState({ loadingButton: true });
    }
    crashlytics().log(JSON.stringify(this.state));
    if (this.validatePhoneNumber()) {
      firebase
        .auth()
        .signInWithPhoneNumber(this.state.phoneNumber)
        .then((confirmResult) => {
          this.setState({ confirmResult });
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.setState({ userId: user.uid });
              try {
                this._backendSignIn(
                  user.uid,
                  user.displayName,
                  "https://www.pngitem.com/pimgs/m/272-2720607_this-icon-for-gender-neutral-user-circle-hd.png",
                  user.phoneNumber
                );
              } catch (error) {}
            }
          });
          if (resend) {
            this.setState({ loadingResendButton: false });
          } else {
            this.setState({ loadingButton: false });
          }
        })
        .catch((error) => {
          crashlytics().recordError(JSON.stringify(error));
          alert(
            'There was some issue with the login, please close and open the app again and try. If you still face issues then click the "Contact Us" button.'
          );
          if (resend) {
            this.setState({ loadingResendButton: false });
          } else {
            this.setState({ loadingButton: false });
          }
        });
    } else {
      if (resend) {
        this.setState({ loadingResendButton: false });
      } else {
        this.setState({ loadingButton: false });
      }
    }
  };
  changePhoneNumber = () => {
    // this.loadingButton=true;
    this.setState({
      confirmResult: null,
      verificationCode: "",
      phoneNumber: null,
    });
  };
  resendOtp = () => {
    const resend = true;
    this.handleSendCode(resend);
  };
  handleVerifyCode = (vcode) => {
    const { confirmResult, verificationCode } = this.state;
    let code = vcode;
    if (code == null) {
      code = verificationCode;
    }
    // Request for OTP verification
    if (code.length == 6) {
      this.setState({ loadingVerifyButton: true });
    } else {
      this.setState({ showAlert: true });
      return;
    }

    confirmResult
      .confirm(code)
      .then((user) => {
        this.setState({ userId: user.user.uid });
        try {
          this._backendSignIn(
            user.user.uid,
            user.user.displayName,
            "https://www.pngitem.com/pimgs/m/272-2720607_this-icon-for-gender-neutral-user-circle-hd.png",
            user.user.phoneNumber
          );
        } catch (error) {
          console.log("Error in handleVerify==>", error);
        }
        //   this.setState({ loadingButton:false });
      })
      .catch((error) => {
        crashlytics().recordError(JSON.stringify(error));
        this.setState({ loadingVerifyButton: false, showAlert: true });
      });
  };

  handleInputChange = (text) => {
    this.setState({ verificationCode: text });
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
          onChangeText={this.handleInputChange.bind(this)}
          value={this.state.verificationCode}
          keyboardType="numeric"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          autoFocus
        />
        <Button
          outline
          style={[styles.themeButton, { paddingTop: 20 }]}
          title="Verify Code"
          loading={this.state.loadingVerifyButton}
          onPress={this.handleVerifyCode.bind(this, null)}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: Colors.linearGradient,
            start: { x: 0, y: 0.25 },
            end: { x: 0.5, y: 1 },
            locations: [0, 0.5, 0.6],
          }}
        />
        <Button
          type="clear"
          title="Resend OTP"
          loading={this.state.loadingResendButton}
          onPress={this.resendOtp.bind(this)}
        />
        <Button
          type="clear"
          title="Re-Enter the Phone Number"
          loading={this.state.loadingButton}
          onPress={this.changePhoneNumber}
        />
      </View>
    );
  };
  getCurrentUserInfo = async () => {
    try {
      const token1 = await AsyncStorage.getItem("token");
      const fcmToken = await firebase.messaging().getToken();
      AsyncStorage.setItem("fcmToken", fcmToken);
      this.setState({ fcmToken: fcmToken });
      try {
        if (token1 != null) {
          const name = await AsyncStorage.getItem("name");
          const email = await AsyncStorage.getItem("email");
          const profileImage = await AsyncStorage.getItem("profileImage");
          const token = await AsyncStorage.getItem("token");
          const phoneNumber = await AsyncStorage.getItem("phoneNumber");
          const dob = await AsyncStorage.getItem("dob");
          const sessionsAttended = await AsyncStorage.getItem(
            "sessionsAttended"
          );
          // const dob = await AsyncStorage.getItem("dob");
          const dateOfJoining = await AsyncStorage.getItem("dateOfJoining");
          const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
          const city = await AsyncStorage.getItem("city");
          const emergencyContact = await AsyncStorage.getItem(
            "emergencyContact"
          );
          const age = await AsyncStorage.getItem("age");

          //retreive membership object to save separately in redux
          const membershipType = await AsyncStorage.getItem("membershipType");
          const id = await AsyncStorage.getItem("membershipId");
          const membershipStartDate = await AsyncStorage.getItem(
            "membershipStartDate"
          );
          const membershipEndDate = await AsyncStorage.getItem(
            "membershipEndDate"
          );
          const coins = await AsyncStorage.getItem("coins");
          const freeTrialUsed = await AsyncStorage.getItem("freeTrialUsed");
          const freeTrialActive = await AsyncStorage.getItem("freeTrialActive");
          this.setProfile(
            name,
            email,
            phoneNumber,
            profileImage,
            token,
            sessionsAttended,
            dateOfJoining,
            selfInviteCode,
            city,
            emergencyContact,
            fcmToken,
            age
          );
          this.setMembership({
            membershipType: membershipType,
            id: id,
            membershipStartDate: membershipStartDate,
            membershipEndDate: membershipEndDate,
            coins: coins,
            freeTrialUsed: freeTrialUsed,
            freeTrialActive: freeTrialActive,
          });

          axios
            .post(SERVER_URL + "/user/update", {
              fcmToken: fcmToken,
              phone: phoneNumber,
            })
            .then((response) => {
              AsyncStorage.setItem(
                "freeTrialActive",
                String(response.data.freeTrialActive)
              );
              AsyncStorage.setItem(
                "membershipType",
                response.data.membershipType
              );
              AsyncStorage.setItem(
                "membershipStartDate",
                String(response.data?.membershipStartDate)
              );
              AsyncStorage.setItem(
                "membershipEndDate",
                String(response.data?.membershipEndDate)
              );
              AsyncStorage.setItem("coins", String(response.data?.coins));
              AsyncStorage.setItem(
                "freeTrialUsed",
                String(response.data?.freeTrialUsed)
              );
              AsyncStorage.setItem(
                "freeTrialActive",
                String(response.data?.freeTrialActive)
              );

              this.setProfile(
                response.data.name,
                response.data.email,
                response.data.phone,
                response.data.profileImage,
                response.data.token,
                response.data.sessionsAttended,
                response.data.dateOfJoining,
                response.data.selfInviteCode,
                response.data.city,
                response.data.emergencyContact,
                response.data.fcmToken,
                response.data.age,
                response.data.dob
              );

              AsyncStorage.setItem("email", response.data.email);
              AsyncStorage.setItem("phone", response.data.phone);
              AsyncStorage.setItem("profileImage", response.data.profileImage);
              AsyncStorage.setItem(
                "sessionsAttended",
                response.data.sessionsAttended
              );
              AsyncStorage.setItem(
                "dateOfJoining",
                response.data.dateOfJoining
              );
              AsyncStorage.setItem(
                "selfInviteCode",
                response.data.selfInviteCode
              );
              AsyncStorage.setItem("city", response.data.city);
              AsyncStorage.setItem(
                "emergencyContact",
                response.data.emergencyContact
              );
              AsyncStorage.setItem("fcmToken", response.data.fcmToken);
              AsyncStorage.setItem("age", response.data.age);
              AsyncStorage.setItem("dob", response.data.dob);
              this.setMembership({
                membershipType: response.data.membershipType,
                id: response.data.id,
                membershipStartDate: response.data?.membershipStartDate,
                membershipEndDate: response.data?.membershipEndDate,
                coins: response.data.coins,
                freeTrialUsed: response.data?.freeTrialUsed,
                freeTrialActive: response.data?.freeTrialActive,
              });
            })
            .catch((error) => {
              console.log(error);
            });
          this.props.navigation.replace("Additional Details", {
            navigation: this.props.navigation,
            email: email,
            phoneNumber: phoneNumber,
            name: name,
            dateOfJoining: dateOfJoining,
            city: city,
            emergencyContact: emergencyContact,
            profileImage: profileImage,
            dob: dob,
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
      this.setState({ loader: false });
    } catch (error) {}
  };
  _backendSignIn(token, name, profileImage, phone) {
    if (this.state.reachedBackendSignIn == false) {
      this.setState({ reachedBackendSignIn: true });
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
        referralId: this.state.referralCode,
        source: this.state.source,
        fcmToken: this.state.fcmToken,
      })
      .then(async (response) => {
        if (response.data && response.data != "ERROR") {
          this.setProfile(
            response.data.name,
            response.data.email,
            response.data.phone,
            response.data.profileImage,
            token,
            response.data.sessionsAttended,
            response.data.dateOfJoining,
            response.data.selfInviteCode,
            response.data.city,
            response.data.emergencyContact,
            this.state.fcmToken,
            response.data.age,
            response.data.dob
          );
          this.setMembership({
            membershipType: response.data.membershipType,
            id: response.data.id,
            membershipStartDate: response.data.membershipStartDate,
            membershipEndDate: response.data.membershipEndDate,
            coins: response.data.coins,
            vouchers: response.data?.vouchers,
            freeTrialUsed: response.data?.freeTrialUsed,
            freeTrialActive: response.data?.freeTrialActive,
          });
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
          if (response.data.profileImage != null) {
            AsyncStorage.setItem("profileImage", response.data.profileImage);
          }
          AsyncStorage.setItem("token", token);
          AsyncStorage.setItem(
            "sessionsAttended",
            response.data.sessionsAttended
          );
          AsyncStorage.setItem("dateOfJoining", response.data.dateOfJoining);
          AsyncStorage.setItem("selfInviteCode", response.data.selfInviteCode);
          AsyncStorage.setItem("age", response.data.age);
          AsyncStorage.setItem("dob", response.data.dob);

          // store membership details in async storage
          AsyncStorage.setItem("membershipType", response.data.membershipType);
          AsyncStorage.setItem("membershipId", response.data.id);
          if (response.data.membershipStartDate != null)
            AsyncStorage.setItem(
              "membershipStartDate",
              response.data.membershipStartDate
            );
          if (response.data.membershipEndDate != null)
            AsyncStorage.setItem(
              "membershipEndDate",
              response.data.membershipEndDate
            );
          AsyncStorage.setItem("coins", String(response.data.coins));
          AsyncStorage.setItem(
            "freeTrialUsed",
            String(response.data?.freeTrialUsed)
          );
          AsyncStorage.setItem(
            "freeTrialActive",
            String(response.data?.freeTrialActive)
          );

          this.setState({
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phone,
            city: response.data.city,
            emergencyContact: response.data.emergencyContact,
            // dob: response.data.dob,
          });
          if (this.pending(response.data.name, response.data.phone)) {
            this.props.navigation.replace("Additional Details", {
              navigation: this.props.navigation,
              email: response.data.email,
              phoneNumber: response.data.phone,
              name: response.data.name,
              state: this.state.state,
              city: response.data.city,
              emergencyContact: response.data.emergencyContact,
              dob: response.data.dob,
              dateOfJoining: response.data.dateOfJoining,
            });
            return;
          } else {
            await analytics().logEvent("login_click", {
              phoneNumber: this.state.phoneNumber,
              email: this.state.email,
              name: this.state.name,
            });
            this.setState({ loader: true });
            this.props.navigation.replace("GoHappy Club");
            this.setState({ loadingVerifyButton: false });
            this.setState({ loader: false });
          }
        } else if (response.data == "ERROR") {
          this.setState({
            showAlert: true,
            loader: false,
            loadingVerifyButton: false,
          });
        }
        this.setState({ loadingVerifyButton: false });
      })
      .catch((error) => {
        this.setState({ loadingVerifyButton: false });
        console.log("Error in backendSignin", error);
      });
  }
  pending(name, phone) {
    if (
      phone == null ||
      phone.length == 0 ||
      name == null ||
      name.length == 0
      //  ||
      // this.state.dob == null ||
      // this.state.dob.length == 0
    ) {
      return true;
    }
    return false;
  }
  showConditions(type) {
    if (type == 0) {
      const { width } = Dimensions.get("window");
      this.setState({ conditionText: TermOfUse });
    } else {
      this.setState({ conditionText: PrivacyPolicy });
    }
    var flag = !this.state.conditionDialog;
    this.setState({ conditionDialog: flag });
  }
  render() {
    if (this.state.loader == true) {
      return <GOHLoader />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ width: "40%", marginLeft: "auto" }}>
          <Button
            style={{ marginLeft: "auto" }}
            type="clear"
            title="Contact Us"
            // loading={this.state.loadingResendButton}
            onPress={() => {
              Linking.openURL(
                "https://wa.me/6280114385?text=Hi%20GoHappy%20Club%20Team%2C%20%0ACan%20you%20please%20help%20me%3F%0AI%20am%20facing%20trouble%20with%20login"
              );
            }}
          />
        </View>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={height / 10}
        >
          <FastImage
            resizeMode="contain"
            style={styles.logo}
            source={require("../../images/logo.png")}
          />

          <Text
            style={{
              fontWeight: "normal",
              fontSize: 30,
              color: Colors.black,
              alignSelf: "center",
            }}
          >
            LOGIN or SIGN UP
          </Text>
          {!this.state.confirmResult && (
            <View style={styles.page}>
              <PhoneInput
                style={styles.textInput}
                ref={this.state.phoneNumber}
                keyboardType="phone-pad"
                defaultCode="IN"
                layout="first"
                onChangeFormattedText={this.handlePhoneNumberInput}
                onChangeText={(phone) => {
                  this.setState({ unformattedNumber: phone });
                }}
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
                    color: Colors.grey.grey,
                    fontSize: 12,
                  }}
                >
                  By signing up, I agree to the{" "}
                </Text>
                <Text
                  style={{
                    color: Colors.blue.blue,
                    width: "80%",
                    fontSize: 12,
                  }}
                  onPress={this.showConditions.bind(this, 0)}
                >
                  Terms of Use
                </Text>
                <Text
                  style={{
                    width: "80%",
                    color: Colors.grey.grey,
                    fontSize: 12,
                  }}
                >
                  {" "}
                  and{" "}
                </Text>
                <Text
                  style={{
                    color: Colors.blue.blue,
                    width: "80%",
                    fontSize: 12,
                  }}
                  onPress={this.showConditions.bind(this, 1)}
                >
                  Privacy Policy
                </Text>
                <Text
                  style={{
                    width: "80%",
                    color: Colors.grey.grey,
                    fontSize: 12,
                  }}
                >
                  , including usage of cookies.
                </Text>
              </Text>

              <>
                <BottomSheet
                  modalProps={{}}
                  isVisible={this.state.conditionDialog}
                >
                  <Text style={styles.title}>Please Read Below</Text>
                  <ListItem key="1">
                    <ListItem.Content>
                      <ListItem.Title>
                        <View style={{ width: width * 0.9 }}>
                          <RenderHtml
                            // contentWidth={width}
                            source={this.state.conditionText}
                          />
                        </View>
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                  <ListItem
                    key="2"
                    containerStyle={{ backgroundColor: Colors.blue.blue }}
                    onPress={this.showConditions.bind(this, 1)}
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
                loading={this.state.loadingButton}
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: Colors.linearGradient,
                  start: { x: 0, y: 0.25 },
                  end: { x: 0.5, y: 1 },
                  locations: [0, 0.5, 0.6],
                }}
                onPress={this.handleSendCode.bind(this, false)}
              />
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://wa.me/6280114385?text=Hi%20GoHappy%20Club%20Team%2C%20%0ACan%20you%20please%20help%20me%3F%0AI%20am%20facing%20trouble%20with%20login"
                  );
                }}
              >
                <Text
                  style={{ color: Colors.blue.login, fontSize: 14 }}
                  // loading={this.state.loadingResendButton}
                >
                  Trouble logging in? Contact Us
                </Text>
              </TouchableOpacity>
              {/* <View> */}
              {/* <Text>Facing any difficulty?</Text> */}
              {/* </View> */}
              <AwesomeAlert
                show={this.state.showPhoneNumberError}
                showProgress={false}
                title="Error"
                message={this.state.phoneNumberError}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                confirmButtonColor={Colors.primary}
                confirmText="Try Again"
                onConfirmPressed={() => {
                  this.setState({ showPhoneNumberError: false });
                }}
              />
            </View>
          )}

          {this.state.confirmResult && (
            <View style={styles.page}>{this.renderConfirmationCodeView()}</View>
          )}
        </KeyboardAvoidingView>

        {/* <ImageBackground
          resizeMode="contain"
          style={styles.cover}
          source={require("../../images/login_bg.png")}
        />
        <Text style={{fontSize:20,color:'black',alignSelf:'center'}}>India ka Sabse Khush Pariwar</Text> */}
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Login Error"
          message="Invalid Credentials"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Try Again"
          confirmButtonColor={Colors.errorButton}
          onConfirmPressed={() => {
            this.setState({ showAlert: false });
          }}
        />
      </SafeAreaView>
    );
  }
}
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
    marginTop: "30%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.grey.f,
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
    color: Colors.white,
    alignSelf: "center",
  },

  buttonDisabled: {
    backgroundColor: "#999",
    borderRadius: 5,
    padding: 10,
  },

  buttonLabel: {
    fontSize: 14,
    color: Colors.white,
    alignSelf: "center",
  },
  container1: {
    flex: 1,
    backgroundColor: Colors.grey.f,
    justifyContent: "space-around",
  },
  otp_input: {
    height: 60,
    borderColor: Colors.grey.grey,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 18,
    borderRadius: 8,
    textAlign: "center",
    color: Colors.black,
  },
  input: {
    width: "90%",
    backgroundColor: Colors.white,
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
    color: Colors.black,
    fontWeight: "700",
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    color: Colors.white,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: Colors.white,
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
    color: Colors.white,
    paddingHorizontal: 10,
  },
  container2: {
    flex: 1,
    backgroundColor: "#aaa",
  },
  title2: {
    color: Colors.white,
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
    borderColor: Colors.phoneInputBorder,
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
    color: Colors.white,
  },
  verificationView: {
    width: "100%",
    alignItems: "center",
    // marginTop: 50
  },
  underlineStyleBase: {
    borderColor: Colors.black,
    color: Colors.black,
  },

  underlineStyleHighLighted: {
    borderColor: Colors.black,
  },
});

const mapStateToProps = (state) => ({
  profile: state.profile,
});

const ActionCreators = Object.assign({}, { setProfile, setMembership });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
