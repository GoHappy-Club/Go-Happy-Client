import React, { Component } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  BackHandler,
  useWindowDimensions,
} from "react-native";
import { BottomSheet, ListItem, Text, Button } from "react-native-elements";
import { connect, useSelector } from "react-redux";
import { setProfile } from "../redux/actions/counts";
import { bindActionCreators } from "redux";
import firebase from "@react-native-firebase/app";
import { FirebaseDynamicLinksProps } from "../config/CONSTANTS";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Clipboard from "@react-native-clipboard/clipboard";
import RenderHtml from "react-native-render-html";
import toUnicodeVariant from "./toUnicodeVariant.js";
// import { refreshProfile } from "../services/profile/ProfileService";
import ReferralsList from "./ReferralsList";
import { FlatList } from "react-native-gesture-handler";
import { Colors } from "../constants/Colors.js";
const screenWidth = Dimensions.get("window").width;
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
      conditionText:
        '<p style="text-align:center"><span style="font-size:16px"><strong>Follow these simple steps:</strong></span></p><ol><li>&nbsp;Share the referral link with&nbsp;your friends who are above&nbsp;50 years of age.</li><li>Ask them to click on the link, install the GoHappy Club app and register themselves in the app.</li><li>Once registered, ask them to book and attend any session they want.</li><li>Receive <strong>Thank You Gift</strong> from GoHappy Club delivered to your home once you have seven successful referrals.</li></ol>',
      profileImage:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg/220px-Matt_LeBlanc_as_Joey_Tribbiani.jpg",
    };
    this._retrieveData();
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
    ToastAndroid.show("Referral link copied", ToastAndroid.LONG);
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
    this.props.loadMySessions("", function () {
      _this.setState({ refreshing: false });
    });
  }
  // Item = ({ title }) => (
  //   <View style={styles.item}>
  //     <Text style={styles.title}>{title}</Text>
  //   </View>
  // );
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

  closeShowReferralsStatus() {
    this.setState({ showReferralsStatus: false });
  }

  requestReferrals() {
    ////console.log("requestReferrals");
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
      // if (_callback) {
      //   _callback();
      // }
    });
  }

  onPressReferralsButton() {
    this.requestReferrals();
    this.setState({
      showReferralsStatus: true,
    });
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
    var flag = !this.state.conditionDialog;
    this.setState({ conditionDialog: flag });
  }
  render() {
    const { referralLink } = this.state;
    return (
      <View style={{ backgroundColor: Colors.white }}>
        <ScrollView>
          <Text style={styles.title}>Refer & Win</Text>
          <Text style={styles.subtitle}>
            Members who will introduce atleast seven people (50+ of age) to join
            our GoHappy Club will get exciting gifts delivered at their homes!!
          </Text>
          {/* <View
          style={{
            marginLeft: "8%",
            marginTop: "15%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} color={"#ffc8c8"} size={20} />
          <Text style={styles.info}>How it works</Text>
        </View> */}
          <Image
            resizeMode="cover"
            style={{
              width: "100%",
              height: 150,
              // alignSelf: "center",
              // paddingLeft: 200,
              // paddingRight: 100,
            }}
            source={require("../images/1_2_3-Refer.png")}
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
              <Image
                resizeMode="contain"
                style={{
                  width: "15%",
                  height: 40,
                  // alignSelf: "center",
                }}
                source={require("../images/whatsapp.png")}
              />
              <Image
                resizeMode="contain"
                style={{
                  // width: "100%",
                  width: "15%",
                  height: 40,
                  // alignSelf: "center",
                }}
                source={require("../images/facebook.png")}
              />
              <Image
                resizeMode="contain"
                style={{
                  // width: "100%",
                  width: "15%",
                  height: 40,
                  // alignSelf: "center",
                }}
                source={require("../images/instagram.png")}
              />
              {/* <Image
                resizeMode="contain"
                style={{
                  // width: "100%",
                  width: "12%",
                  height: 40,
                  // alignSelf: "center",
                }}
                source={require("../images/sms.png")}
              /> */}
            </View>
          </View>
          {/* <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          > */}
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
          {/* </View> */}
          <Image
            resizeMode="cover"
            style={{
              width: "100%",
              height: 220,
              alignSelf: "center",
              // marginLeft: "10%",
              // marginRight: "10%",
            }}
            source={require("../images/refer.png")}
          />

          <>
            <BottomSheet modalProps={{}} isVisible={this.state.conditionDialog}>
              {/* <Text style={styles.title}>Please Read Below</Text> */}
              <ListItem key="1">
                <ListItem.Content>
                  <ListItem.Title>
                    <View style={{ flex: 1, maxWidth: screenWidth }}>
                      <RenderHtml
                        style={{ width: "100%" }}
                        // contentWidth={screenWidth}
                        source={{
                          html: this.state.conditionText,
                        }}
                      />
                    </View>
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                key="2"
                containerStyle={{ backgroundColor: Colors.primary }}
                onPress={this.showConditions.bind(this)}
              >
                <ListItem.Content>
                  <ListItem.Title style={{ color: Colors.white }}>
                    Close
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </BottomSheet>
          </>
          <>
            <BottomSheet
              modalProps={{
                fullScreen: true,
                onRequestClose: () =>
                  this.setState({ showReferralsStatus: false }),
              }}
              isVisible={this.state.showReferralsStatus}
              onClose={() => this.setState({ showReferralsStatus: false })}
              // enablePanDownToClose={true}
            >
              {/* <ListItem
                key="2"
                // containerStyle={{ backgroundColor: Colors.white, margin: 0 }}
                // onPress={this.closeShowReferralsStatus.bind(this)}
              >
                <ListItem.Content>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={this.closeShowReferralsStatus.bind(this)}
                    underlayColor={Colors.white}
                  >
                    <Text style={styles.backText}>back</Text>
                  </TouchableOpacity>
                </ListItem.Content>
              </ListItem> */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={this.closeShowReferralsStatus.bind(this)}
                underlayColor={Colors.white}
              >
                <Text style={styles.backText}>Click to Exit</Text>
              </TouchableOpacity>
              <ListItem containerStyle={styles.BSContainer}>
                <ListItem.Content>
                  <ListItem.Title>
                    <View style={{ flex: 1 }}>
                      <ReferralsList
                        numberReferrals={this.state.numberReferrals}
                        referrals={this.state.referrals}
                        trivialTitle1={this.state.trivialTitle1}
                        trivialTitle2={this.state.trivialTitle2}
                        // requestReferrals={async (_callback) => {
                        //   await this.requestReferrals.bind(this);
                        //   _callback();
                        // }}
                      />
                    </View>
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </BottomSheet>
          </>
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
    color: Colors.black,
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
    backgroundColor: Colors.referPrimary,
    alignSelf: "center",
    alignItems: "center",
    marginTop: "5%",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    marginTop: "3%",
    width: "80%",
    backgroundColor: Colors.referPrimary,
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
    shadowColor: Colors.black,
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
