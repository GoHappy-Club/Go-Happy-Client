import React, { Component } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Linking,
  PermissionsAndroid,
} from "react-native";
import { FAB, PaperProvider } from "react-native-paper";

import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { connect } from "react-redux";
import { changeCount, setProfile } from "../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { launchImageLibrary } from "react-native-image-picker";
const ImagePicker = require("react-native-image-picker");
// import ImagePicker from "react-native-image-picker";

GoogleSignin.configure({
  webClientId:
    "908368396731-fr0kop29br013r5u6vrt41v8k2j9dak1.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true,
  // hostedDomain: '', // specifies a hosted domain restriction
  // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
  // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    "908368396731-vppvalbam1en8cj8a35k68ug076pq2be.apps.googleusercontent.com", // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      loader: false,
      profileImage: "",
      name: "",
      email: "",
      membership: "",
      city: "",
      state: "",
      image: null,
    };
    this._retrieveData();
  }
  componentDidUpdate() {
    this.refreshProfile();
  }
  _handleSelectImage = async () => {
    try {
      // console.log("bla", launchImageLibrary());

      const redux_profile = this.props.profile;
      console.log("bla", redux_profile);
      // const granted = await PermissionsAndroid.request(
      //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      //   {
      //     title: "App Camera Permission",
      //     message: "App needs access to your camera ",
      //     buttonNeutral: "Ask Me Later",
      //     buttonNegative: "Cancel",
      //     buttonPositive: "OK",
      //   }
      // );
      var options = {
        mediaType: "photo",
        maxHeight: 1024,
        maxWidth: 1024,
        quality: 0.5,
        includeBase64: true,
      };

      launchImageLibrary(options, (response) => {
        console.log("nlenle", response);
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          console.log("User cancelled image picker");
          const base64Image = `data:${response.type};base64,${response.assets[0].base64}`;
          var url = SERVER_URL + "/user/updateProfileImage";
          axios
            .post(url, {
              phoneNumber: redux_profile.phoneNumber,
              profileImage: base64Image,
            })
            .then((response1) => {})
            .catch((error) => {
              // alert(error);
            });
          redux_profile.profileImage = base64Image;
          this.setState({ image: base64Image });
          // setImage(base64Image);
          AsyncStorage.setItem("profileImage", base64Image);
        }
      });
    } catch (error) {
      console.log("here", error);
    }
  };
  refreshProfile() {
    var url = SERVER_URL + "/auth/login";
    const redux_profile = this.props.profile;
    axios
      .post(url, {
        phone: redux_profile.phoneNumber,
      })
      .then((response) => {
        if (response.data && response.data != "ERROR") {
          AsyncStorage.setItem(
            "sessionsAttended",
            response.data.sessionsAttended
          );
          redux_profile.sessionsAttended = response.data.sessionsAttended;
          actions.setProfile(redux_profile);
        }
      })
      .catch((error) => {
        // alert(error);
      });
  }

  decrementCount() {
    let { count, actions } = this.props;
    count--;
    actions.changeCount(count);
  }
  incrementCount() {
    let { count, actions } = this.props;

    count++;
    actions.changeCount(count);
  }

  _signout = async () => {
    try {
      //   await GoogleSignin.revokeAccess();
      //   await GoogleSignin.signOut();
      firebase.auth().signOut();
      AsyncStorage.clear();
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error(error);
    }
  };
  _retrieveData = async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      const email = await AsyncStorage.getItem("email");
      const profileImage = await AsyncStorage.getItem("profileImage");
      const membership = await AsyncStorage.getItem("membership");
      this.setState({ name: name });
      this.setState({ email: email });
      this.setState({ profileImage: profileImage });
      this.setState({ membership: membership });
    } catch (error) {
      // Error retrieving data
    }
  };
  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this._retrieveData();
    });
  };
  openWhatsApp = () => {
    // let msg = this.state.message;
    // let mobile = this.state.mobileNo;
    let url = "https://chat.whatsapp.com/DKjqVwE9c7X4EgEBYE39yu";
    Linking.openURL(url)
      .then((data) => {})
      .catch(() => {
        alert("Make sure WhatsApp installed on your device");
      });
  };
  render() {
    if (this.state.loader == true) {
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: "#0A1045" }}
        />
      );
    }
    const navigation = this.props.navigation;
    const title = "Login";
    const { count } = this.props;
    const { profile } = this.props;
    // alert(JSON.stringify(profile));
    const now = new Date();
    var days = Math.ceil(
      (now.getTime() - Number(profile.dateOfJoining)) / (1000 * 3600 * 24)
    );

    var dayString = "";
    if (isNaN(days)) {
      days = 0;
      dayString = "day";
    } else if (days <= 1) {
      dayString = "day";
    } else {
      dayString = "days";
    }

    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <ScrollView
          style={{
            backgroundColor: "white",
            height: "100%",
          }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              shadowColor: "black",
              shadowOffset: { height: 2 },
              shadowOpacity: 0.3,
              width: "100%",
              height: Dimensions.get("window").height / 3,
              justifyContent: "center",
            }}
          >
            <Image
              style={styles.cover}
              source={{
                uri:
                  this.state.image && this.state.image.length > 0
                    ? this.state.image
                    : profile.profileImage,
                // uri: "https://images.rawpixel.com/image_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTExXzMuanBn.jpg?s=MyfPR1OOzWQDXe_rg0F-Td-wIlh0wX79G02NeNTXvdE",
                // require('../images/profile_image.jpeg')
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                paddingLeft: 20,
                height: "160%",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text
                h3
                style={{
                  overflow: "hidden",
                  backgroundColor: "rgba(41,191,194,0.9)",
                  padding: 4,
                  color: "white",
                  borderRadius: 10,
                }}
              >
                {profile.name}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#29BFC2",
              shadowColor: "black",
              shadowOffset: { height: 2 },
              shadowOpacity: 0.3,
              borderRadius: 10,
              width: Dimensions.get("window").width * 0.9,
              height: 80,
              marginTop: -10,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  width: "33%",
                  height: "100%",
                  borderColor: "#E0E0E0",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Text style={{ ...styles.cardText }}>Sessions Attended</Text>
                <Text style={{ ...styles.cardText, fontWeight: "bold" }}>
                  {profile.sessionsAttended}
                </Text>
              </View>
              <View
                style={{
                  width: "33%",
                  height: "100%",
                  justifyContent: "center",
                  borderColor: "#E0E0E0",
                  borderRightWidth: 1,
                  alignContent: "center",
                }}
              >
                <Text style={{ ...styles.cardText }}>Membership</Text>
                {/* <Text style={{...styles.cardText,fontWeight: "bold"}}>{profile.membership}</Text> */}
                <Text style={{ ...styles.cardText, fontWeight: "bold" }}>
                  Free
                </Text>
              </View>
              <View
                style={{
                  width: "33%",
                  height: "100%",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Text style={{ ...styles.cardText }}>Member Since</Text>
                {/* <Text style={{...styles.cardText,fontWeight: "bold"}}>{count}</Text> */}
                <Text style={{ ...styles.cardText, fontWeight: "bold" }}>
                  {days} {dayString}
                </Text>
              </View>
            </View>
          </View>
          {/* onPress={this._handleSelectImage.bind(this)} */}
          <View
            style={{
              marginTop: 20,
              width: Dimensions.get("window").width * 0.9,
            }}
          >
            <TouchableOpacity
              style={{
                width: "100%",
                borderTopWidth: 1,
                borderColor: "#E0E0E0",
              }}
              onPress={() => {
                this.props.navigation.navigate("Membership Details");
              }}
            >
              <View>
                <Text style={styles.optionList}>Contribute and Support Us</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ width: Dimensions.get("window").width * 0.9 }}>
            <TouchableOpacity
              style={{
                width: "100%",
                borderTopWidth: 1,
                borderColor: "#E0E0E0",
              }}
              onPress={this._handleSelectImage.bind(this)}
            >
              <View>
                <Text style={styles.optionList}>Update Profile Picture</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ width: Dimensions.get("window").width * 0.9 }}>
            <TouchableOpacity
              style={{
                width: "100%",
                borderTopWidth: 1,
                borderColor: "#E0E0E0",
              }}
              onPress={() => {
                this.props.navigation.navigate("About GoHappy Club");
              }}
            >
              <View>
                <Text style={styles.optionList}>About GoHappy Club</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ width: Dimensions.get("window").width * 0.9 }}>
            <TouchableOpacity
              style={{
                width: "100%",
                borderTopWidth: 1,
                borderColor: "#E0E0E0",
              }}
              onPress={this.openWhatsApp}
            >
              <View>
                <Text style={styles.optionList}>
                  Join Whatsapp Support Group
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ width: Dimensions.get("window").width * 0.9 }}>
            <TouchableOpacity
              style={{
                width: "100%",
                borderTopWidth: 1,
                borderColor: "#E0E0E0",
                borderBottomWidth: 1,
              }}
              onPress={this._signout.bind(this)}
            >
              <View>
                <Text style={styles.optionList}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* <View >
							<View>
								<Text >GoHappy Club from GoIndependent.in</Text>
								<Text >All rights reserved</Text>
							</View>
					</View> */}
        </ScrollView>

        <FAB
          style={styles.fab}
          icon={({ size, color }) => (
            <FontAwesomeIcon icon={faComment} color={"white"} size={25} />
          )}
          onPress={this.openWhatsApp}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#0A1045",
  },
  cover: {
    flex: 1,
    justifyContent: "center",
    // resizeMode: 'cover',
    // marginLeft:'-58%'
  },
  cardText: {
    textAlign: "center",
    marginTop: 10,
    color: "white",
  },
  optionList: {
    fontSize: 16,
    padding: 10,
    color: "#424242",
  },
  fab: {
    backgroundColor: "#29BFC2",
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const mapStateToProps = (state) => ({
  count: state.count.count,
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { changeCount }, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
