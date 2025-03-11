import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Clipboard from "@react-native-clipboard/clipboard";
import firebase from "@react-native-firebase/app";
import { FacebookIcon, InstagramIcon } from "lucide-react-native";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-elements";
import FastImage from "react-native-fast-image";
import Toast from "react-native-simple-toast";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Colors } from "../../assets/colors/color.js";
import { FirebaseDynamicLinksProps } from "../../config/CONSTANTS.js";
import Refer123 from "../../images/1_2_3-Refer.png";
import RemoveBg from "../../images/refer Background Removed.png";
import { setProfile } from "../../redux/actions/counts.js";
import toUnicodeVariant from "../toUnicodeVariant.js";
import ReferBottomSheet from "./ReferBottomSheet.js";

const WIDTH = Dimensions.get("window").width;
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
      .then(() => {})
      .catch(() => {});
  };
  _retrieveData = async () => {
    try {
      const email = await globalThis.AsyncStorage.getItem("email");
      this.setState({ email: email });
    } catch (error) {
      console.log("Error retrieving email", error);
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
    // this.props.loadMySessions("", function () {
    //   _this.setState({ refreshing: false });
    // });
  }
  createDynamicReferralLink = async () => {
    let { profile, actions } = this.props;
    let selfInviteCode = this.props.profile.selfInviteCode;
    // alert('hi');
    globalThis.crashlytics().log(JSON.stringify(this.props.profile));
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
          appStoreId: "6737447673",
          customScheme: "gohappyclient",
          fallbackUrl:
            "https://apps.apple.com/ca/app/gohappy-club/id6737447673",
        },
      },
      firebase.dynamicLinks.ShortLinkType.SHORT,
    );

    this.setState({ referralLink: link1 });

    profile.referralLink = link1;
    actions.setProfile(profile);
  };

  requestReferrals() {
    this.props.requestReferrals((responseData) => {
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
      },
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
    const { t } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView>
          <Text style={styles.title}>{t("refer_win")}</Text>
          <Text style={styles.subtitle}>{t("refer_text")}</Text>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: "100%",
              height: WIDTH > 600 ? 200 : 150,
            }}
            source={Refer123}
          />

          <View style={styles.clip}>
            <Text style={styles.link}>{referralLink}</Text>
            <TouchableOpacity
              style={{
                ...styles.copyButton,
                backgroundColor: Colors.primary,
              }}
              underlayColor={Colors.primary}
              onPress={this.copyToClipboard.bind(this)}
            >
              <Text
                style={{
                  color: Colors.primaryText,
                  fontWeight: "bold",
                }}
              >
                {t("copy")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{t("refer_msg")}</Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "3%",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <InstagramIcon size={32} color={Colors.primaryText} />
              <FacebookIcon size={32} color={Colors.primaryText} />
              <FontAwesomeIcon
                icon={faWhatsapp}
                size={32}
                color={Colors.primaryText}
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
                color={Colors.primaryText}
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
              <Text style={styles.rulesButtonText}>
                {t("rules_regulation")}
              </Text>
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
              <Text style={styles.rulesButtonText}>{t("referral_status")}</Text>
            </View>
          </TouchableOpacity>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: "100%",
              height: WIDTH > 600 ? 320 : 220,
              alignSelf: "center",
              // marginLeft: "10%",
              // marginRight: "10%",
            }}
            source={RemoveBg}
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
      </SafeAreaView>
    );
  }
}

Refer.propTypes = {
  profile: PropTypes.object,
  actions: PropTypes.object,
  requestReferrals: PropTypes.func,
  mySessions: PropTypes.array,
  t: PropTypes.func,
};

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
    color: Colors.primaryText,
    justifyContent: "center",
    alignSelf: "center",
  },
  referButtonText: {
    fontWeight: "bold",
    color: Colors.primaryText,
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  clip: {
    marginTop: WIDTH < 600 ? "-10%" : 0,
    display: "flex",
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    // borderColor:Colors.black,
    // borderWidth:1
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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Refer));
