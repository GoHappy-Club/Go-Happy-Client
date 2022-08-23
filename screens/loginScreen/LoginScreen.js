import React, { Component } from "react";
import {
  Dimensions,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  View,
} from "react-native";
import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import PhoneInput from "react-native-phone-number-input";

import Video from "react-native-video";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { Button } from "react-native-elements";
import { BottomSheet, ListItem } from "react-native-elements";
import OTPInputView from "@bherila/react-native-otp-input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import LinearGradient from "react-native-linear-gradient";
import dynamicLinks from "@react-native-firebase/dynamic-links";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      loader: true,
      loadingButton: false,
      userInfo: null,
      confirmResult: null,
      verificationCode: "",
      userId: "",
      email: "",
      name: "",
      state: "",
      city: "",
      conditionDialog: false,
      conditionText: "",
      dob: "",
      reachedBackendSignIn: false,
      referralCode: "",
      copiedText: "",
    };
    this.getCurrentUserInfo();
  }
  componentDidMount() {
    dynamicLinks().onLink((url) => {
      if (url === null) {
        return;
      }
      alert("test1", url);
      console.log("this is the url", url.url);
      alert(JSON.stringify(url));
      this.setState({ referralCode: url.url.split("=")[1] });
    });
    dynamicLinks()
      .getInitialLink()
      .then((url) => {
        if (url === null) {
          return;
        }

        console.log("this is the initial url", url);
        // alert(JSON.stringify(url));
        this.setState({ referralCode: url.url.split("=")[1] });
        alert("test2" + this.state.referralCode);
      });
  }
  setProfile(
    name,
    email,
    phoneNumber,
    profileImage,
    token,
    plan,
    sessionsAttended,
    dob,
    dateOfJoining,
    selfInviteCode
  ) {
    let { profile, actions } = this.props;
    profile = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      profileImage: profileImage,
      token: token,
      membership: plan,
      sessionsAttended: sessionsAttended,
      dob: dob,
      dateOfJoining: dateOfJoining,
      selfInviteCode: selfInviteCode,
    };
    actions.setProfile(profile);
  }
  getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    this.setState({ currentUser });
  };
  validatePhoneNumber = () => {
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    return regexp.test(this.state.phoneNumber);
  };
  handleSendCode = () => {
    // Request to send OTP
    console.log("in handle send code", this.state.phoneNumber);
    this.setState({ loadingButton: true });
    if (this.validatePhoneNumber()) {
      console.log("here1");
      firebase
        .auth()
        .signInWithPhoneNumber(this.state.phoneNumber)
        .then((confirmResult) => {
          console.log("in handle send code inside");
          this.setState({ confirmResult });
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              console.log("this is user", user);
              this.setState({ userId: user.uid });
              try {
                this._backendSignIn(
                  user.uid,
                  user.displayName,
                  "https://www.pngitem.com/pimgs/m/272-2720607_this-icon-for-gender-neutral-user-circle-hd.png",
                  user.phoneNumber
                );
              } catch (error) {
                console.log(error);
              }
            }
          });
          this.setState({ loadingButton: false });
        })
        .catch((error) => {
          // if(JSON.stringify(error).includes('too-many')){
          // 	alert(error);
          // }
          // else{
          // 	alert(JSON.stringify(error));
          // }
          alert(error);
          console.log(error);

          this.setState({ loadingButton: false });
        });
    } else {
      alert("Invalid Phone Number");
      this.setState({ loadingButton: false });
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
    // this.loadingButton=true;
    //this.setState({ confirmResult: null, verificationCode: ''})
    this.handleSendCode();
  };
  handleVerifyCode = () => {
    const { confirmResult, verificationCode } = this.state;

    // Request for OTP verification
    if (verificationCode.length == 6) {
      this.setState({ loadingButton: true });
    } else {
      this.setState({ showAlert: true });
    }
    console.log("fsddfssdfsdfdsfdsfsdfs", verificationCode);
    if (verificationCode.length == 6) {
      confirmResult
        .confirm(verificationCode)
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
            console.log(error);
          }
          //   this.setState({ loadingButton:false });
          console.log("fsddfssdfsdfdsfdsfrwerewrwerwerwerewrewrsdfs");
        })
        .catch((error) => {
          //   alert(error.message)

          this.setState({ loadingButton: false, showAlert: true });

          console.log("fwrewrsdfs");
        });
    } else {
      //   alert('Please enter a 6 digit OTP code.')

      console.log("fwrewrsdfsOTP");
    }
  };

  renderConfirmationCodeView = () => {
    return (
      <View style={styles.verificationView}>
        <OTPInputView
          style={{ width: "80%", height: 60, color: "#000" }}
          pinCount={6}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeChanged={(code) => {
            this.setState({ verificationCode: code });
          }}
        />
        <Button
          outline
          style={[styles.themeButton, { paddingTop: 20 }]}
          title="Verify Code"
          loading={this.state.loadingButton}
          onPress={this.handleVerifyCode}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#4c669f", "#3b5998", "#192f6a"],
            start: { x: 0, y: 0.25 },
            end: { x: 0.5, y: 1 },
            locations: [0, 0.5, 0.6],
          }}
        ></Button>
        <Button
          type="clear"
          title="Resend OTP"
          loading={this.state.loadingButton}
          onPress={this.resendOtp.bind(this)}
        ></Button>
        <Button
          type="clear"
          title="Enter a Different Phone Number"
          loading={this.state.loadingButton}
          onPress={this.changePhoneNumber}
        ></Button>
      </View>
    );
  };
  getCurrentUserInfo = async () => {
    try {
      const token1 = await AsyncStorage.getItem("token");

      if (token1 != null) {
        const name = await AsyncStorage.getItem("name");
        const email = await AsyncStorage.getItem("email");
        const profileImage = await AsyncStorage.getItem("profileImage");
        const token = await AsyncStorage.getItem("token");
        const membership = await AsyncStorage.getItem("membership");
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");
        const sessionsAttended = await AsyncStorage.getItem("sessionsAttended");
        const dob = await AsyncStorage.getItem("dob");
        const dateOfJoining = await AsyncStorage.getItem("dateOfJoining");
        const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
        this.setProfile(
          name,
          email,
          phoneNumber,
          profileImage,
          token,
          membership,
          sessionsAttended,
          dob,
          dateOfJoining,
          selfInviteCode
        );
        // this.props.navigation.replace('GoHappy Club');

        // this.setState({loader:false});
        this.props.navigation.replace("Additional Details", {
          navigation: this.props.navigation,
          email: email,
          phoneNumber: phoneNumber,
          name: name,
          dob: dob,
          dateOfJoining: dateOfJoining,
        });
        return;
        // }
      }
      this.setState({ loader: false });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        // some other error
      }
    }
  };
  async createDynamicReferralLink(name, phone) {
    const link1 = await firebase.dynamicLinks().buildShortLink(
      {
        link:
          "https://gohappyclub.in/refer?idx=" +
          name.substring(0, 4) +
          phone.substring(2, 4) +
          phone.substring(10, 12),
        domainUriPrefix: "https://gohappyclub.page.link",
      },
      dynamicLinks.ShortLinkType.UNGUESSABLE
    );
    console.log(link1);
    alert(link1);
  }
  _backendSignIn(token, name, profileImage, phone) {
    console.log(token, name, profileImage, phone);
    this.createDynamicReferralLink(name, phone);
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
      })
      .then((response) => {
        console.log("backend sign in", response);
        if (response.data && response.data != "ERROR") {
          // this.setState({fullName: userInfo.fullName});
          if (response.data.phone != null)
            AsyncStorage.setItem("phoneNumber", response.data.phone);
          // AsyncStorage.setItem('fullName',response.data.fullName);

          if (response.data.name != null)
            AsyncStorage.setItem("name", response.data.name);
          if (response.data.email != null)
            AsyncStorage.setItem("email", response.data.email);
          if (response.data.profileImage != null)
            AsyncStorage.setItem("profileImage", response.data.profileImage);
          AsyncStorage.setItem("token", token);
          AsyncStorage.setItem("membership", response.data.membership);
          AsyncStorage.setItem(
            "sessionsAttended",
            response.data.sessionsAttended
          );
          AsyncStorage.setItem("dob", response.data.dob);
          AsyncStorage.setItem("dateOfJoining", response.data.dateOfJoining);
          this.setProfile(
            name,
            response.data.email,
            response.data.phone,
            response.data.profileImage,
            token,
            response.data.membership,
            response.data.sessionsAttended,
            response.data.dob,
            response.data.dateOfJoining,
            response.data.selfInviteCode
          );
          this.setState({
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phone,
            dob: response.data.dob,
          });
          if (this.pending()) {
            console.log(this.state);
            this.props.navigation.replace("Additional Details", {
              navigation: this.props.navigation,
              email: response.data.email,
              phoneNumber: response.data.phone,
              name: name,
              state: this.state.state,
              city: this.state.city,
              dob: response.data.dob,
              dateOfJoining: response.data.dateOfJoining,
            });
            return;
          } else {
            this.setState({ loader: true });
            this.props.navigation.replace("GoHappy Club");
            this.setState({ loader: false });
          }
        } else if (response.data == "ERROR") {
          this.setState({ showAlert: true, loader: false });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  pending() {
    console.log("state in pending", this.state);
    if (
      this.state.phoneNumber == null ||
      this.state.phoneNumber.length == 0 ||
      this.state.name == null ||
      this.state.name.length == 0 ||
      this.state.dob == null ||
      this.state.dob.length == 0
    )
      return true;
    return false;
  }
  showConditions(type) {
    var tac =
      'These terms of use (“Terms of Use” or “Terms”) mandate the terms and conditions on which the users (“User”) access and register on the "GoHappy Club” through its mobile device application (the “App”) , which provides audio and audio-visual content in the genre of inter alia wellness, meditation, educational programs, lifestyle and entertainment services (collectively referred to as the “Platform”) to end-users (hereinafter referred to as “End-User” or “you” or “your”), operated by GoHappy Club(“Partnership Firm”) ,a partnership firm established under the laws of India having its registered office at 306/19, Lane No:5 Golden City, Amritsar (143001), Punjab.The terms “we”, “our” or “us” refer to the firm. The terms “you”, “your” or “yourself” refer to the User. ' +
      "Please read these Terms carefully before accepting as they contain provisions that define your limits, your exercise of legal rights and obligations with respect to your use of our Services. By accessing and using our Services, you agree to be bound, without limitation or qualification, by these Terms. If you do not agree to be bound by these Terms, do not use the Services in any manner whatsoever or authorize or permit any other person or entity to do so. Any person who is not legally eligible to be bound by these Terms shall not access and use the Services. If you are not willing to agree to the foregoing, you should not click to affirm your acceptance thereto, in which case you are prohibited from accessing or using the Services.Nothing in these Terms shall be deemed to confer any third-party rights or benefits. While certain aspects of the Services or using certain Services, you will be subject to any additional terms applicable to such services that may be posted on the Service from time to time. All such terms are hereby incorporated by reference into these Terms of Service. The Services would be availed through the platform wherein our experts / mentors (Guides) would take /teach through the sessions as scheduled and communicated to you . " +
      "1. ELIGIBILITY: You must be of 50 years or more in your province, territory, or country, and otherwise be fully able and competent to enter into, abide by, and comply with these Terms .The Platform Services are not available to minors i.e. persons under the age of 18 (eighteen) years or to any Users suspended or removed by theCompany for any reason whatsoever. You represent that You are of legal age to form a binding contract and are not a person barred from receiving Platform Services under the applicable laws. At any time during your use of our Services, we reserve the right to terminate your access without prior warning (i) if any information provided proves to be inaccurate, not current or incomplete; (ii) if it is believed that your actions may cause legal liability for you or us; and/or (iii) if you are found to be non-compliant with these Terms. " +
      "The Company reserves the right to refuse access to the Platform or Platform Services to new Users or to terminate access granted to existing User(s) at any time without according any reasons for doing so. You shall not have more than one active Account (as defined hereinafter) on the Platform. Additionally, You are prohibited from selling, trading, or otherwise transferring Your Account to another party or impersonating any other person for the purposing of creating an account with the Platform. " +
      "2. CHANGES OR MODIFICATIONS: We may modify these Terms from time to time in our sole discretion. We will notify or let you know by posting the modified Terms on the platform. You shall, at all times, be responsible for regularly reviewing and noting the changes made to the Terms. Your continued use of our Services after the effective date of any change to the Terms will signify your assent to and will be deemed to be your acceptance of the modified Terms. If you don’t agree to be bound by the modified Terms, kindly discontinue accessing and using the Services immediately. We may change or discontinue all or any part of the Services, at any time and without notice, at our sole discretion. " +
      "3. SYSTEM REQUIREMENTS: For using the services in our Platform, you would require one or more compatible devices (mobile handset ), Internet access (fees may apply), and certain software and may require obtaining updates or upgrades from time to time. Because use of the Services involves hardware, software, and Internet access, your ability to access and use the Services may be affected by the performance of these factors. High speed Internet access is recommended. GoHappy Club shall also not be responsible for any reduction in speed or efficiency of the Services due to poor connectivity or any other such collateral requirements related to internet services. You acknowledge and agree that such collateral system requirements, which may be changed from time to time, are your responsibility, and we shall not, under any circumstances whatsoever, be responsible or liable for such costs or performance . " +
      "4. USE OF THE APPLICATION You shall be solely responsible for accessing and using our Services and shall ensure that you comply with laws of the territory while using our Services including but not limited to intellectual property, privacy, cookies and third party rights. You will use the Services only for such purposes as is permitted by (a) these Terms; and (b) any law, regulation or generally accepted practices or guidelines applicable in the country of which you are a citizen, in which you are a resident or from where you use the Services. You shall not use the Services or any Content (as defined) for any purpose that is unlawfulor prohibited by these Terms, or to solicit the performance of any illegal activity or other activity that infringes the rights of Ultrahuman andor others. " +
      "You shall be solely responsible and liable for your use of the Services, including without limitation for any and all Content transmitted, streamed, communicated, recorded, received, and/or stored to or through the Services by you. To the extent that you choose to use any software applicationsprovided by us in relation to the Services, you agree that you will promptly install all upgrades, bug fixes, patches, and other corrections relating to the Services made available by us." +
      "We would be improving our Services and creating new ones all the time. We at our sole discretion, at any time, with or without notice, and without any obligation or liability to you or any other party may suspend, terminate, limit, change, modify, downgrade, and/or update the Services (inwhole or in part), including without limitation, any feature, functionality, integration or component thereof. " +
      "The Services shall not, and is not intended to be used for any application where failure, interruption or malfunction may reasonably be anticipated to result in bodily injury, loss of life, or substantial damage to property and we shall not be liable for any claims, damages or loss which arise from such limitation. " +
      "5. REGISTRATION AND LOGIN DETAILS You need to register with GoHappy Club to access the platform and actively access all features in the platform as a User, through your account (“User Account”) which can be created by filling your contact number to login . To create a User Account, you must submit the information requested for at the time of registration (“Registration Information”) through your contact number ,subsequent to it an OTP will be generated which needs to be filled accordingly for its activation and therafter you can access the platform. " +
      "Our information collection and use policies with respect to the privacy of such information are set forth in the Privacy Policy. You acknowledge and agree that you are solely responsible for the accuracy and content of the Registration Information, and you agree to keep it up to date. " +
      "At any time after the registration, we reserve the right to suspend or terminate your User Account (i) if any Registration Information or any information provided thereafter proves to be inaccurate, not current or incomplete; (ii) if it is believed that your actions may cause legal liability for you, other End-Users or us; and/or (iii) if you are found to be non-compliant with these Terms. " +
      "You are responsible for safeguarding your User Account details and password. You agree that you will not disclose your password to any third party and that you will take sole responsibility for any activities or actions underyour User Account. You shall notify GoHappy Club immediately in case of any breach of security or any unauthorized use of your User Account. Similarly, you shall never use another person’s User Account without prior consent from GoHappy Club.You agree that you will not misrepresent yourself or represent yourself on the platform. You hereby expressly acknowledge and agree that you will be liable for any losses, damages (whether direct or indirect) caused to you, GoHappy Club or any others as a result of unauthorized use of your User Account. " +
      "By agreeing to create a User Account, you may receive occasional special offer, marketing, and survey communication emails with respect to the Services/Content. You can unsubscribe from the GoHappy Club commercial emails by following the opt-out instruction in these emails. " +
      "6. CHARGES, FEES AND SUBSCRIPTIONS TERMS Whenever you sign up or login GoHappy Club you may avail the services with a free trial period which includes certain sessions or whatsoever may be the available offer duringthe said period. The free trial period for any services offered will last for the period of time specified when you signed or logged in . Free trials shall not be combined with any other offers, as specified or communicated while login. You can also contribute to the club. " +
      "You agree to pay for all fees and charges along with applicable taxes incurred while using the GoHappy Club Services. " +
      "**For the purpose of clarity, monthly cycle means a 30 days cycle from the payment to GoHappy Club" +
      "Payment terms " +
      "All payments in respect of the GoHappy Club Services shall be made to the Company through the payment gateways as made available to you for purchasing any plan/ services. To the extent permitted by applicable law and subject to the Company’s Privacy Policy, you acknowledge and agree that the Company may use certain third-party vendors and service providers, including payment gateways, to process payments and manage payment card information. " +
      "In order to make payments online, You are requested to use a valid payment mode (card or netbanking or third party wallets or details required for any other mode of payment) (“Payment Details”) with the authority to use the same and to have sufficient funds or credit available to complete the payment on the GoHappy Club for availing the services . By providing the Payment Details, You represent, warrant, and covenant that: (1) You are legally authorized to provide such Payment Details; (2) You are legally authorized to perform payments using such Payment Details; and (3) such action does not violate the terms and conditions applicable to Your use of such Payment Details or applicable law. You agree that You are responsible for any fees charged by your internet service provider in connection with the payment services to avail the GoHappy Club payment plans. You may add, delete, and edit the Payment Details You have provided from time to time through the Platform. " +
      "The payment receipt for completion of a transaction shall be provided by the third party payment vendor and the transaction summary shall be provided by the Company, the payment receipt and transaction summary shall be made available on the Platform and also sent to your registered email address. " +
      "Except to the extent otherwise required by applicable law, the Company is not liable for any payments authorized through the Platform using your Payment Details. Particularly, the Company is not liable for any payments that do not complete because: (1) Your payment card or net banking or third party wallet does not contain sufficient funds to complete the transaction or the transaction exceeds the credit limit in respect of the Payment Details provided; (2) You have not provided the Company with correct Payment Details;(3) Your payment card has expired; or (4) circumstances beyond the Company’s control (such as, but not limited to, power outages, interruptions of cellular service, or any other interferences from an outside force) prevent the execution of the transaction. " +
      " Refund & Cancellation Policy of Top/ Subscription Plans/Contribution " +
      "A. Contribution" +
      "Contributions once purchased cannot be cancelled.No refund will be provided for payments already made. " +
      "7. USER CONTENT " +
      "You acknowledge that you are responsible for any content you may submit through the Application, including the legality, reliability, appropriateness, originality and copyright of any such content. You may not upload to, host, display, modify, transmit, update, share, distribute or otherwise publish through this Application any content that: " +
      "is confidential, proprietary, invasive of privacy or publicity rights, infringing on patents" +
      " trademarks, copyrights, or other intellectual property rights, unlawful, harmful, threatening, false, fraudulent, libellous, defamatory, obscene, vulgar, pornographic, paedophilic, profane, abusive, harassing, hateful, racially, ethnically or otherwise objectionable, disparaging, relating or encouraging money laundering or gambling, or otherwise unlawful in any manner whatever, including, but not limited to any content that encourages conduct that would constitute a criminal offence, violates the rights of any party or otherwise gives rise to civil liability or otherwise violates any applicable laws for the time being in force; belongs to another person and towhich you do not have any right to; violates any law for the time being in force; harms minors in any way; deceives or misleads the addressee about the origin of such messages or communicates any information which is grossly offensive or menacing in nature; threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign states, or public order or causes incitement to the commission of any cognisable offence of prevents investigation of any offence or is insulting to any other nation; infringes upon or violates any third party's privacy rights (including without limitation unauthorized disclosure of a person's name, physical address, phone number or email address); provides material that exploitspeople in a sexual, violent or otherwise inappropriate manner or solicits personal information from anyone; interferes with another user's use and enjoyment of the Platform or any other individual's user and enjoyment of similar services; or directly or indirectly, offer for trade, the dealing of any item which is prohibited or restricted in any manner under the provisions of any applicable law, rule, regulation or guideline for the time being in force; may contain software viruses or malware or files or programs designed to interrupt, destroy or limit the functionality of any computer; contains advertisements or solicitations of any kind, or other commercial content; is designed to impersonate others; contains messages that offer unauthorized downloads of any copyrighted, confidential or private information; contains multiple messages placed within individual folders by the same user restating the same point; contains identical (or substantially similar) messages to multiple recipients advertising any service, expressing a political or other similar message, or any other type of unsolicited commercial message; this prohibition includes but is not limited to (a) using the invitation functionality that may be available on the Platform to send messages to people who do not know you or who are unlikely to recognize you as a known contact; (b) using the Platform to connect to people who do not know you and then sending unsolicited promotional messages to those direct connections without their permission; or (c) sending messages to distribution lists, newsgroup aliases or group aliases. You may not use a false email address or other identifying information, impersonate any person or entity or otherwise mislead as to the origin of any content. Some features that may be available on this Platform require registration. By registering, you agree to provide true, accurate, current and complete information about yourself. " +
      "With respect to any content you submit or make available through the Application (other than personal information, which is handled in accordance with the Privacy Notice, you grant GoHappy Clyb a perpetual, irrevocable, non-terminable, worldwide, royalty-free and non-exclusive license to use, copy, distribute, publicly display, modify, create derivative works, and sublicense such content or any part of such content, in any media. You hereby represent, warrant and covenant that any content you provide does not include anything (including, but not limited to, text, images, music or video) to which you do not have the fullright to grant such a license to GoHappy club. " +
      "GoHappy club does not authorise or approve such unauthorised usage of your information but by using the Application, you acknowledge and agree that GoHappy Club will not be responsible for any third party's use of any of your information which you may have publicly disclosed on the Application. We advise that you exercise caution in disclosing any information on the Application which may become publicly available. " +
      "8. DISCLAIMERS " +
      "EXCEPT AS OTHERWISE EXPRESSLY PROVIDED IN THESE TERMS OF USE, OR REQUIRED BY APPLICABLE LAW, GoHappy CLUB MAKES NO REPRESENTATIONS, COVENANTS OR WARRANTIES AND OFFERS NO OTHER CONDITIONS, EXPRESS OR IMPLIED, REGARDING ANY MATTER, INCLUDING, WITHOUT LIMITATION, THE MERCHANTABILITY, SUITABILITY, FITNESS FOR A PARTICULAR USE OR PURPOSE, OR NON-INFRINGEMENT OF PRODUCTS, ANY CONTENT ON THE APPLICATION, OR SERVICES PURCHASED THROUGH THE APPLICATION AS WELL AS WARRANTIES IMPLIED FROM A COURSE OF PERFORMANCE OR COURSE OF DEALING. " +
      "YOUR USE OF THIS PLATFORM IS AT YOUR SOLE RISK. THE PLATFORM IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. WE RESERVE THE RIGHT TO RESTRICT OR TERMINATE YOUR ACCESS TO THE APPLICATION OR ANY FEATURE OR PART THEREOF AT ANY TIME. EVERGREEN CLUB DISCLAIMS ANY WARRANTIES THAT ACCESS TO THE APPLICATION WILL BE UNINTERRUPTED OR ERROR-FREE; THAT THE APPLICATION WILL BE SECURE; THAT THE APPLICATION OR THE SERVER THAT MAKES THE APPLICATION AVAILABLE WILL BE VIRUS-FREE; OR THAT INFORMATION ON THE APPLICATION WILL BE CORRECT, ACCURATE, ADEQUATE, USEFUL, TIMELY, RELIABLE OR OTHERWISE COMPLETE. IF YOU DOWNLOAD ANY CONTENT FROM THIS APPLICATION, YOU DO SO AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY SUCH CONTENT. NO ADVICE OR INFORMATION OBTAINED BY YOU FROM THE APPLICATION SHALL CREATE ANY WARRANTY OF ANY KIND. " +
      "9 .Contact US" +
      "In the event You have any complaints or concerns with respect to the GoHappy Club platform or our services or if You have any questions, please feel free to contact us on care@gohappyclub.in or reach out to our customer support via Call or WhatsApp on +917888384477 (between 9:00 am – 9 pm).";
    var pp =
      'GoHappy Club, a firm incorporated under the laws of India having registered office at B-306/19, Lane No5, Golden City ,Amritsar (143001),Punjab. ("Company" or "we" or "us" or "our"), provides Services (as defined in the Terms of Service) through its Mobile Application "GoHappy Club"at Google Play Store/Apple Play Store ( collectively referred to as "Platform"). Any Service availed by Users of the Platform (as defined in the Terms of Service) (hereinafter referred to as "you", "your" or "User") through the Platform is conditioned upon your acceptance of the terms and conditions contained in Terms of Service, as available on Platform and this privacy policy ("Privacy Policy"). THIS PRIVACY POLICY HAS BEEN DRAFTED AND PUBLISHED IN ACCORDANCE WITH THE INFORMATION TECHNOLOGY ACT 2000, THE INFORMATION TECHNOLOGY (AMENDMENT) ACT 2008, AND THE INFORMATION TECHNOLOGY (REASONABLE SECURITY PRACTICES AND PROCEDURES AND SENSITIVE PERSONAL DATA OR INFORMATION) RULES 2011. THIS PRIVACY POLICY CONSTITUTES A LEGAL AGREEMENT BETWEEN YOU, AS A USER OF THE PLATFORM AND US, AS THE OWNER OF THE PLATFORM. YOU MUST BE A NATURAL PERSON WHO IS AT LEAST 18 YEARS OF AGE. This privacy policy sets out how GoHappy Club Club uses and protects any information that you give GoHappy club when you use this Application. GoHappy Club is committed to ensuring that your privacy is protected. If we are asking you to provide certain information by which you can be identified while using this Application, then you can be assured that it will only be used in accordance with this privacy statement. GoHappy Club may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are satisfied with any changes. You undertake that you shall be solely responsible for the accuracy and truthfulness of the Personal Information you share with us.' +
      "GoHappy Club is committed to ensuring that your privacy is protected. While signing up, some personal information is collected from and about you. This privacy policy sets out the details of how GoHappy Club uses the personal information collected, the manner in which it is collected, by whom as well as the purposes for which it is used." +
      "While registering, when you accept the terms of this Privacy Policy and your use of the App signifies your continued acceptance thereof. In order to use the App, you will be required to refer and accept the terms of the Privacy Policy as revised from time to time." +
      "Information collected while signing up:" +
      "Name" +
      "Email address" +
      "Mobile number" +
      "Date of Birth" +
      "Address" +
      "Use of Information" +
      "The personal information collected from or about you above, will be stored locally in the App on your device and will only be uploaded to and used by GoHappy Club" +
      "The mobile number and email address that you provide at the time of registration may be used to communicate with you through SMS, email, push notifications, or other such means for sending notifications or invites for the upcoming events." +
      "We may also use the information to customize the website according to your interests or based on your feedback and reviews." +
      'You understand and acknowledge that the Company reserves the right to track your Geographical location ("Track") during the provision of the Services or while using the Application.' +
      "DATA STORAGE AND DATA PROCESS" +
      "GoHappy  Club will ensure that any personal information collected from you would be taken in a fair and reasonable manner, and where it has a lawful reason to do so. Use of your personal information by GoHappy Club depends on the purpose for which you access the Platform and/or the nature of GoHappy Club services availed by you. The Company may use or process personal information for the following purposes:" +
      "For providing information in respect of the services requested and to contact you in relation to the same and when otherwise necessary;" +
      "for communicating /sending you information / recommendations relating to our services;" +
      "for enabling and improving the Platform and its content to provide better features and services.;" +
      "for compliance with internal policies and procedures / regulations of the state or any other law being in process." +
      "We will only retain your personal Information collected from you as long as it is necessary to fulfil the purposes as aforementioned. If you have chosen to receive any promotional / marketing communications from us, we will retain Information about your marketing preferences for a reasonable period of time, which will be kept based on the date you last expressed interest in our content or Services while accessing our platform. We may also retain your Information, if necessary, for our legitimate business interests or any other , such as fraud prevention or to maintain the security of our users." +
      "We will take all possible reasonable steps to accurately record the Information that you provide to us including any subsequent updates. You can review, update and amend the Information that we maintain about you, and if in case you want to make any change or delete any information, you can request to delete Information about you that is inaccurate, incomplete or irrelevant for legitimate purposes, or is being processed in a way which infringes any applicable legal requirement." +
      "We do not collect or otherwise record, process, organize, structure, store, adapt, alter, retrieve, use, disclose by transmission, dissemination or otherwise make available any End-User’s Personal Information or information pertaining to his/her race, religion, caste, sexual orientation or health or any other information that may be deemed to be sensitive the ordinary course of our business." +
      "We generally store Information closest to the End-User or Participant where they are located through our data centres available globally. We may transfer your Information to Third-Parties acting on our behalf, for the purposes of processing or storage." +
      "GOVERNING STATUTE" +
      "This Privacy Policy is governed by and is compliant with the Information Technology( Reasonable Security Practices and Procedures and Sensitive Personal Data or Information)Rules 2011, which is designed to protect Personal Information of the End-User(s) of the Services; and other applicable rules and regulations related to privacy." +
      "COOKIES" +
      'We may set "cookies" to track your use of the Platform. Cookies are small, encrypted files that a site or its service provider transfers to your device’s hard drive that enables the sites or service provider’s systems to recognize your device, capture and remember certain information. By using the Application, you signify your consent to our use of cookies for its smooth functioning of the Application and the user interface .' +
      "DISCLOSURES" +
      "We do not sell/rent your Personal Information to anybody and will never do so. We have reserved your personal information as per laws of the land, and we may disclose your Personal Information in the following cases:" +
      "Legal and Regulatory Authorities: Only when we may be required to disclose your Personal Information due to legal or regulatory requirements. In such instances, we reserve the right to disclose your Personal Information as required in order to comply with our legal obligations, including but not limited to complying with court orders, warrants, or discovery requests. We may also disclose your Personal Information(a) to law enforcement officers or others; (b) to comply with a judicial proceeding, court order, or legal process served on us or the Platform; (c) to enforce or apply this Privacy Policy or the Terms of Service or our other policies or Agreements; (d) for an insolvency proceeding involving all or part of the business or asset to which the information pertains; (e) respond to claims that any Personal Information violates the rights of third-parties; (f) or protect the rights, property, or personal safety of the Company, or the general public. You agree and acknowledge that we may not inform you prior to or after disclosures made according to this section." +
      "Persons Who Acquire Our Assets or Business: If we sell or transfer any of our business or assets, certain Personal Information may be a part of that sale or transfer. In the event of such a sale or transfer, we will notify you in respect of such changes ." +
      "Co-branding / Joint Marketing Tie ups : Where permitted by law, we may share your Personal Information with joint marketers/ affiliates with whom we have a marketing arrangement, we would require all such joint marketers to have written contracts with us that specify the appropriate use of your Personal Information, require them to safeguard your Personal Information, and prohibit them from making unauthorized or unlawful use of your Personal Information." +
      "DATA RETENTION" +
      " We will retain your Personal Information for as long as your registration with us is valid and till the time you are using the services . We may also retain and use your Personal Information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. Subject to this section, we will try to delete your Personal Information upon reasonable written request for the same. Please note, however, that there might be latency in deleting Personal Information from our servers and backed-up versions might exist even after deletion." +
      "SECURITY" +
      "We value your Personal Information, and protect it on the Platform against loss, misuse or alteration by taking extensive security measures. In order to protect your Personal Information, we have implemented adequate technology and will update these measures as new technology becomes available, as appropriate. All Personal Information is securely stored on a secure cloud setup and all communication takes place via secure SSL communication channels. Although we provide appropriate firewalls and protections, we cannot warrant the security of any Personal Information transmitted as our systems are not hack proof. Data pilferage due to unauthorized hacking, virus attacks, technical issues is possible, and we take no liabilities or responsibilities for it." +
      "You are responsible for all actions that take place under your User Account. If you choose to share your User Account details and password or any Personal Information with third parties, you are solely responsible for the same. If you lose control of your User Account, you may lose substantial control over your Personal Information and may be subject to legally binding actions." +
      "ACCESSING AND MODIFYING PERSONAL INFORMATION" +
      " In case you need to access, review, and/or make changes to the Personal Information, you shall have to login to your User Account and change the requisite details. You shall keep your Personal Information updated to help us better serve you." +
      "." +
      "COMMUNICATIONS FROM THE PLATFORM" +
      "Special Offers and Updates: We may send you information on services, special deals or any other deals in respect of the services being utilised by you. You may also unsubscribe any promotional messages in case you want to opt out and do not want any promotional messages." +
      "Service Announcements: On certain occasions or under law, we are required to send out Service or Platform related announcements. We respect your privacy, however you may not opt-out of these communications. These communications would not be promotional in nature." +
      "Customer Service: We communicate with Customer(s) on a regular basis to provide requested services and in regard to issues relating to their User Account, services and we will reply via email or phone/ WhatsApp, based on Customer(s) requirements and convenience." +
      "INDEMNIFICATION" +
      "You agree to indemnify us, our subsidiaries, affiliates, officers, agents, co-branders or other partners, and employees and hold us harmless from and against any claims and demand, including reasonable attorneys' fees, made by any third party arising out of or relating to: (i) Personal Information and contents that you submit or share through the Platform; (ii) your violation of this Privacy Policy, (iii) or your violation of rights of another Customer(s)." +
      "LIMITATIONS OF LIABILITY" +
      "You expressly understand and agree that the Company shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, information, details or other intangible losses (even if the Company has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the Services; (ii) unauthorized access to or alteration of your Personal Information." +
      "GOVERNING LAWS AND DUTIES" +
      "You expressly understand and agree that the Company, including its directors, officers, employees, representatives or the service provider, shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if the Company has been advised of the possibility of such damages), resulting from; (a) use or the inability to avail the Services (b) inability to use the Platform (c) failure or delay in providing the Services or access to the Platform (d) any performance or non-performance by the Company (e) any damages to or viruses that may infect your electronic devices or other property as the result of your access to the Platform or your downloading of any content from the Platform and (f) server failure or otherwise or in any way relating to the Services." +
      "JURISDICTION:" +
      "This Agreement shall be construed and governed by the laws of India and courts of law at Amritsar shall have exclusive jurisdiction over such disputes without regard to principles of conflict of laws." +
      "CHANGES TO THIS POLICY" +
      "We may update this Privacy Policy without notice to you. You are encouraged to check this Privacy Policy on a regular basis to be aware of the changes made to it. Continued use of the Services and access to the Platform shall be deemed to be your acceptance of this Privacy Policy." +
      "YOUR ACCEPTANCE OF THE PRIVACY POLICY" +
      "BY USING OR VISITING THE PLATFORM, YOU SIGNIFY YOUR AGREEMENT OF THIS PRIVACY POLICY. IF YOU DO NOT AGREE TO ANY OF THESE TERMS, PLEASE DO NOT USE THIS PLATFORM OR SERVICES" +
      "CONTACT US" +
      "If you have questions, concerns or grievances regarding this Privacy Policy, you can email us at our support email-address: support@gohappyclub.in";
    if (type == 0) {
      this.setState({ conditionText: tac });
    } else {
      this.setState({ conditionText: pp });
    }
    var flag = !this.state.conditionDialog;
    this.setState({ conditionDialog: flag });
  }
  render() {
    if (this.state.loader == true) {
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      // return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
      return (
        <Video
          source={require("../../images/logo_splash.mp4")}
          style={{
            position: "absolute",
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
    const navigation = this.props.navigation;
    const title = "Login";
    return (
      <View style={styles.container}>
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
        {!this.state.confirmResult && (
          <View style={styles.page}>
            <PhoneInput
              style={styles.textInput}
              ref={this.state.phoneNumber}
              keyboardType="phone-pad"
              defaultCode="IN"
              layout="first"
              onChangeText={(text) => {
                this.setState({ phoneNumber: text });
              }}
              onChangeFormattedText={(text) => {
                this.setState({ phoneNumber: text });
              }}
              withDarkTheme
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
                onPress={this.showConditions.bind(this, 0)}
              >
                Terms of service
              </Text>
              <Text style={{ width: "80%", color: "grey", fontSize: 12 }}>
                {" "}
                and{" "}
              </Text>
              <Text
                style={{ color: "blue", width: "80%", fontSize: 12 }}
                onPress={this.showConditions.bind(this, 1)}
              >
                Privacy Policy
              </Text>
              <Text style={{ width: "80%", color: "grey", fontSize: 12 }}>
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
                    <ListItem.Title>{this.state.conditionText}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <ListItem
                  key="2"
                  containerStyle={{ backgroundColor: "blue" }}
                  onPress={this.showConditions.bind(this, 1)}
                >
                  <ListItem.Content>
                    <ListItem.Title style={{ color: "white" }}>
                      Close
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
                colors: ["#4c669f", "#3b5998", "#192f6a"],
                start: { x: 0, y: 0.25 },
                end: { x: 0.5, y: 1 },
                locations: [0, 0.5, 0.6],
              }}
              onPress={this.handleSendCode}
            ></Button>
          </View>
        )}
        {this.state.confirmResult && (
          <View style={styles.page}>{this.renderConfirmationCodeView()}</View>
        )}
        <ImageBackground
          resizeMode="contain"
          style={styles.cover}
          source={require("../../images/login_bg.png")}
        ></ImageBackground>
        {/* <Text style={{fontSize:20,color:'black',alignSelf:'center'}}>India ka Sabse Khush Pariwar</Text> */}
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Login Error"
          message="Invalid Credentials"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Try Again"
          confirmButtonColor="#DD6B55"
          onConfirmPressed={() => {
            this.setState({ showAlert: false });
          }}
        />
      </View>
    );
  }
}
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
    width: 250,
    height: 250,
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
    color: "#fff",
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
