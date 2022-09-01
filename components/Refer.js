import React, { Component } from "react";
import {
  Share,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { Text } from "react-native-elements";
import { connect, useSelector } from "react-redux";
import { setProfile } from "../redux/actions/counts";
import { bindActionCreators } from "redux";
import firebase from "@react-native-firebase/app";
import { FirebaseDynamicLinksProps } from "../config/CONSTANTS";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Clipboard from "@react-native-community/clipboard";
// import { refreshProfile } from "../services/profile/ProfileService";

class Refer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      email: "",
      password: "",
      showAlert: false,
      loader: false,
      mySession: [],
      refreshing: false,
      DATA: [],
      referralLink: String,
      profileImage:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg/220px-Matt_LeBlanc_as_Joey_Tribbiani.jpg",
    };
    this._retrieveData();
  }
  shareMessage = () => {
    Share.share({
      message:
        "Come and join my happy family, GoHappy Club and attend free sessions on Fitness,  Learning and Entertainment, carefully designed for the 50+ with a dedicated team to treate you with uttermost love and respect. \n Click on the link below to install the application using my referral link and attend FREE sessions. " +
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
    } else return null;
  }
  copyToClipboard = () => {
    Clipboard.setString(this.state.referralLink);
    ToastAndroid.show("Referral link copied", ToastAndroid.LONG);
  };
  trimContent(text, cut) {
    if (text.length < cut) return text;
    return text.substring(0, cut) + "...";
  }
  _onRefresh() {
    this.setState({ refreshing: true });
    var _this = this;
    this.props.loadMySessions("", function () {
      _this.setState({ refreshing: false });
    });
  }
  Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  createDynamicReferralLink = async () => {
    let { profile, actions } = this.props;
    let selfInviteCode = this.props.profile.selfInviteCode;
    // alert('hi');
    console.log(this.props.profile);
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
  componentDidMount() {
    // RefreshProfile

    // alert(JSON.stringify(useSelector((state) => state.profile)));
    this.createDynamicReferralLink();
  }
  render() {
    const { profile } = this.props;
    const { referralLink } = this.state;

    return (
      <View style={{ backgroundColor: "white" }}>
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
                backgroundColor: "#2bbdc3",
              }}
              underlayColor={"#2bbdc3"}
              onPress={this.copyToClipboard.bind(this)}
            >
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Copy
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              Share with your friends via SMS/Email/WhatsApp by clicking on the
              refer now button below.
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
          <TouchableOpacity
            style={styles.referButton}
            underlayColor={"#2bbdc3"}
            onPress={this.shareMessage.bind(this)}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={faShareAlt} size={20} />
              <Text style={styles.referButtonText}>REFER NOW</Text>
            </View>
          </TouchableOpacity>
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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    backgroundColor: "#ffc8c8",
    width: 50,
    height: 50,
  },
  referButton: {
    marginTop: "3%",
    backgroundColor: "#ff8159",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: "center",
  },
  referButtonText: {
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: "10%",
  },
  messageBox: {
    width: "90%",
    backgroundColor: "#fef9f3",
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
    backgroundColor: "#fef9f3",
    textAlign: "center",
    alignSelf: "center",
    fontWeight: "bold",
  },
  title: {
    color: "black",
    marginTop: "7%",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 32,
  },
  subtitle: {
    color: "black",
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
    backgroundColor: "#b1f2f4",
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
