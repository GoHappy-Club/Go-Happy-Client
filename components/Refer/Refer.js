import React, { Component } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-simple-toast";
import { Text } from "react-native-elements";

import { connect, useSelector } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import firebase from "@react-native-firebase/app";
import { FirebaseDynamicLinksProps } from "../../config/CONSTANTS.js";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Clipboard from "@react-native-clipboard/clipboard";
import toUnicodeVariant from "../toUnicodeVariant.js";

import { Colors } from "../../assets/colors/color.js";
import ReferBottomSheet from "./ReferBottomSheet.js";
class Refer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referrals: [],
      trivialTitle1: "",
      trivialTitle2: "Attended",
      showReferralsStatus: false,
      numberReferrals: 0,
      phoneNumber: "",
      email: "",
      password: "",
      showAlert: false,
      loader: false,
      mySession: [],
      refreshing: false,
      DATA: [],
      referralLink: "",
      conditionDialog: false,
      htmlContentWidth: 0,
      type: "",
    };
    this._retrieveData();
    this.bottomSheetRef = React.createRef();
  }

  shareMessage = () => {
    Share.share({
      message:
        "Come and join my happy family, " +
        toUnicodeVariant("GoHappy Club", "italic") +
        " and attend " +
        toUnicodeVariant("Free sessions", "bold") +
        " on " +
        toUnicodeVariant("Fitness, Learning and Fun", "bold") +
        ", carefully designed for the 50+ with a dedicated team to treat you with uttermost love and respect. \n\n" +
        toUnicodeVariant("Click on the link below ", "bold italic") +
        "(नीचे दिए गए लिंक पर क्लिक करें ) to install the application using my referral link and attend FREE sessions: " +
        this.state.referralLink,
    })
      .then((result) => {})
      .catch((errorMsg) => {});
  };
  _retrieveData = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      this.setState({ email: email });
    } catch (error) {
      // Error retrieving data
      //reverse a linked list
    }
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.mySessions !== prevState.mySessions) {
      return { mySessions: nextProps.mySessions };
    } else {
      return null;
    }
  }
  copyToClipboard = () => {
    Clipboard.setString(this.state.referralLink);
    Toast.show("Referral link copied", Toast.LONG);
  };
  trimContent(text, cut) {
    if (text.length < cut) {
      return text;
    }
    return text.substring(0, cut) + "...";
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    var _this = this;
    // this.props.loadMySessions("", function () {
    //   _this.setState({ refreshing: false });
    // });
  }
  createDynamicReferralLink = async () => {
    let { profile, actions } = this.props;
    let selfInviteCode = this.props.profile.selfInviteCode;
    // alert('hi');
    crashlytics().log(JSON.stringify(this.props.profile));
    if (selfInviteCode == null) {
      selfInviteCode = "test";
    }
    const link1 = await firebase.dynamicLinks().buildShortLink(
      {
        link: FirebaseDynamicLinksProps().link + selfInviteCode,
        domainUriPrefix: FirebaseDynamicLinksProps().domainUriPrefix,
        android: {
          packageName: FirebaseDynamicLinksProps().androidPackageName,
          fallbackUrl: FirebaseDynamicLinksProps().androidFallBackUrl,
        },
        ios: {
          bundleId: "com.gohappyclient",
          fallbackUrl:
            "https://play.google.com/store/apps/details?id=com.gohappyclient",
        },
      },
      firebase.dynamicLinks.ShortLinkType.SHORT
    );

    this.setState({ referralLink: link1 });

    profile.referralLink = link1;
    actions.setProfile(profile);
  };

  requestReferrals() {
    var output = this.props.requestReferrals((responseData) => {
      // for testing
      // responseData = this.state.responseData;
      var countReferrals = 0;
      // insert title to json object
      var referralsWithTitles = [];
      for (let i = 0; i < Object.keys(responseData.referrals).length; i++) {
        var dt = new Date(Number(responseData.referrals[i].time));
        responseData.referrals[i].time = dt.toDateString();
        referralsWithTitles.push(responseData.referrals[i]);
        if (responseData.referrals[i].hasAttendedSession == true) {
          countReferrals++;
        }
      }
      this.setState({
        numberReferrals: countReferrals,
        referrals: referralsWithTitles,
      });
    });
  }
  closeShowReferralsStatus() {
    this.bottomSheetRef.current.close();
    this.setState({ showReferralsStatus: false });
  }

  onPressReferralsButton() {
    this.requestReferrals();
    this.setState(
      {
        showReferralsStatus: true,
        type: "referralsList",
      },
      () => {
        this.bottomSheetRef.current.present();
      }
    );
  }

  componentDidMount() {
    let { profile } = this.props;
    if (profile.referralLink == null || profile.referralLink.length == 0) {
      this.createDynamicReferralLink();
    } else {
      this.setState({ referralLink: profile.referralLink });
    }
  }

  showConditions() {
    this.setState({ type: "conditionsDialog" }, () => {
      this.bottomSheetRef.current.present();
    });
  }

  hideConditions() {
    this.setState({ type: "" }, () => {
      this.bottomSheetRef.current.dismiss();
    });
  }
  render() {
    const { referralLink } = this.state;
    return (
      <View style={{ backgroundColor: Colors.background }}>
        <ScrollView>
          <Text style={styles.title}>Refer & Win</Text>
          <Text style={styles.subtitle}>
            Members who will introduce atleast seven people (50+ of age) to join
            our GoHappy Club will get exciting gifts delivered at their homes!!
          </Text>
          <FastImage
            resizeMode="cover"
            style={{
              width: "100%",
              height: 150,
            }}
            source={require("../../images/1_2_3-Refer.png")}
          />

          <View style={styles.clip}>
            <Text style={styles.link}>{referralLink}</Text>
            <TouchableOpacity
              style={{
                ...styles.copyButton,
                backgroundColor: Colors.referPrimary,
              }}
              underlayColor={Colors.referPrimary}
              onPress={this.copyToClipboard.bind(this)}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontWeight: "bold",
                }}
              >
                Copy
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              Share with your friends via WhatsApp/Facebook personally and in
              groups by clicking on the "Refer Now" button below.
            </Text>

            <View
              style={{ display: "flex", flexDirection: "row", margin: "3%" }}
            >
              <FastImage
                resizeMode="contain"
                style={{
                  width: "15%",
                  height: 40,
                }}
                source={require("../../images/whatsapp.png")}
              />
              <FastImage
                resizeMode="contain"
                style={{
                  width: "15%",
                  height: 40,
                }}
                source={require("../../images/facebook.png")}
              />
              <FastImage
                resizeMode="contain"
                style={{
                  width: "15%",
                  height: 40,
                }}
                source={require("../../images/instagram.png")}
              />
            </View>
          </View>
          <TouchableOpacity
            style={
              referralLink.length == 0
                ? styles.referButtonDisabled
                : styles.referButton
            }
            underlayColor={Colors.referPrimary}
            onPress={this.shareMessage.bind(this)}
            disabled={referralLink.length == 0 ? true : false}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faShareAlt}
                size={20}
                color={Colors.white}
              />
              <Text style={styles.referButtonText}>REFER NOW</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rulesButton}
            underlayColor={Colors.referPrimary}
            onPress={this.showConditions.bind(this)}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.rulesButtonText}>Rules & Regulations</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rulesButton}
            underlayColor={Colors.referPrimary}
            onPress={this.onPressReferralsButton.bind(this)}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.rulesButtonText}>
                Click Here to See Your Referral Status
              </Text>
            </View>
          </TouchableOpacity>
          <FastImage
            resizeMode="cover"
            style={{
              width: "100%",
              height: 220,
              alignSelf: "center",
              // marginLeft: "10%",
              // marginRight: "10%",
            }}
            source={require("../../images/refer Background Removed.png")}
          />

          <ReferBottomSheet
            closeModal={() => this.bottomSheetRef.current.close()}
            modalRef={this.bottomSheetRef}
            type={this.state.type}
            numberReferrals={this.state.numberReferrals}
            referrals={this.state.referrals}
            trivialTitle1={this.state.trivialTitle1}
            trivialTitle2={this.state.trivialTitle2}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    width: "auto",
    padding: 4,
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    elevation: 10,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
  },
  backText: {
    color: "#000",
    textAlign: "center",
    fontSize: 18,
  },
  circleNumber: {
    display: "flex",
    flexDirection: "column",
  },
  dashes: {
    fontSize: 38,
    fontWeight: "bold",
  },
  number: {
    alignSelf: "center",
    fontSize: 38,
    fontWeight: "bold",
  },
  cicle: {
    borderRadius: 80,
    backgroundColor: Colors.referCircle,
    width: 50,
    height: 50,
  },
  referButton: {
    marginTop: "3%",
    backgroundColor: Colors.primary,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: "center",
  },
  referButtonDisabled: {
    marginTop: "3%",
    backgroundColor: Colors.referLinkBackground,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: "center",
  },
  rulesButton: {
    marginLeft: "2%",
    paddingTop: 8,
    paddingBottom: 2,
    alignSelf: "center",
  },
  BSContainer: {
    backgroundColor: Colors.white,
  },
  rulesButtonText: {
    fontWeight: "bold",
    color: Colors.primary,
    justifyContent: "center",
    alignSelf: "center",
  },
  referButtonText: {
    fontWeight: "bold",
    color: Colors.white,
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: "10%",
  },
  messageBox: {
    width: "90%",
    backgroundColor: "#F2EBE2",
    alignSelf: "center",
    alignItems: "center",
    marginTop: "5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    marginTop: "3%",
    width: "80%",
    backgroundColor: "#F2EBE2",
    textAlign: "center",
    alignSelf: "center",
    fontWeight: "bold",
  },
  title: {
    color: Colors.black,
    marginTop: "7%",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 32,
  },
  subtitle: {
    color: Colors.black,
    marginTop: 6,
    textAlign: "center",
    fontSize: 14,
    marginLeft: 16,
    marginRight: 16,
  },
  info: {
    marginLeft: "2%",
    color: "#ffb5b5",
  },
  link: {
    backgroundColor: Colors.referLinkBackground,
    padding: 5,
    marginTop: 40,
    fontWeight: "700",
    alignSelf: "center",
    width: "88%",
  },
  clip: {
    marginTop: "-10%",
    display: "flex",
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  copyButton: {
    // height: "39%",
    marginTop: 40,
    padding: 5,
  },
});
const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Refer);
