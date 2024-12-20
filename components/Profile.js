import React, { Component } from "react";
import {
  Dimensions,
  Image,
  Linking,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FAB, PaperProvider } from "react-native-paper";

import { Text } from "react-native-elements";

import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { connect } from "react-redux";
import { changeCount, setProfile } from "../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment, faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
//import axios from "axios";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { launchImageLibrary } from "react-native-image-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import { Platform } from "react-native";
import { Colors } from "../assets/colors/color.js";

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
      logoutPopup: false,
      whatsappLink: "",
    };
    this._retrieveData();
  }

  componentDidUpdate() {
    this.refreshProfile();
  }
  _handleSelectImage = async () => {
    try {
      const redux_profile = this.props.profile;
      var options = {
        mediaType: "photo",
        maxHeight: 1024,
        maxWidth: 1024,
        quality: 0.5,
        includeBase64: true,
      };
      launchImageLibrary(options, (response) => {
        ////console.log("nlenle", response);
        if (response.didCancel) {
          ////console.log("User cancelled image picker");
        } else if (response.error) {
          ////console.log("ImagePicker Error: ", response.error);
        } else {
          ////console.log("User cancelled image picker");
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
      ////console.log("here", error);
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
          //console.log('prof',response.data)
          redux_profile = response.data;
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
    this.openWhatsApp();
  };
  openWhatsApp = async () => {
    var url = SERVER_URL + "/properties/list";
    try {
      const response = await axios.get(url);
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0) {
          const now = new Date();
          const days = Math.ceil(
            (now.getTime() - Number(this.props.profile.dateOfJoining)) /
              (1000 * 3600 * 24)
          );
          if (days < 10 || Number(this.props.profile.sessionsAttended) < 5) {
            this.setState({ whatsappLink: properties[0].whatsappGroupLink[0] });
          } else {
            this.setState({ whatsappLink: properties[0].whatsappGroupLink[1] });
          }
        }
      }
    } catch (error) {
      this.error = true;
    }
  };
  render() {
    if (this.state.loader == true) {
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      return (
        <MaterialIndicator
          color={Colors.white}
          style={{ backgroundColor: Colors.materialIndicatorColor }}
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
          backgroundColor: Colors.white,
          flex: 1,
        }}
      >
        <ScrollView
          style={{
            backgroundColor: Colors.white,
            height: "100%",
          }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              shadowColor: Colors.black,
              shadowOffset: { height: 2 },
              shadowOpacity: 0.3,
              width: "100%",
              height: Dimensions.get("window").height / 3,
              justifyContent: "center",
            }}
          >
            <View style={styles.coverContainer}>
              <Image
                style={styles.cover}
                resizeMode="cover"
                source={{
                  uri:
                    this.state.image && this.state.image.length > 0
                      ? this.state.image
                      : profile.profileImage,
                  // uri: "https://images.rawpixel.com/image_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTExXzMuanBn.jpg?s=MyfPR1OOzWQDXe_rg0F-Td-wIlh0wX79G02NeNTXvdE",
                  // require('../images/profile_image.jpeg')
                }}
              />
            </View>
            <View
              style={{
                position: "absolute",
                top: 0,
                paddingLeft: 20,
                height: "180%",
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
                  color: Colors.white,
                  borderRadius: 10,
                }}
              >
                {profile.name}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: Colors.primary,
              shadowColor: Colors.black,
              shadowOffset: { height: 2 },
              shadowOpacity: 0.3,
              borderRadius: 10,
              width: Dimensions.get("window").width * 0.9,
              height: 80,
              marginTop: "2%",
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
          {/* <View
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
          </View> */}
          <View
            style={{
              width: Dimensions.get("window").width * 0.9,
              marginTop: 20,
            }}
          >
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
          {profile.age == null || profile.age >= 50 ? (
            <View style={{ width: Dimensions.get("window").width * 0.9 }}>
              <TouchableOpacity
                style={{
                  width: "100%",
                  borderTopWidth: 1,
                  borderColor: "#E0E0E0",
                }}
                onPress={() => this.props.navigation.navigate("PastSessions")}
              >
                <View>
                  <Text style={styles.optionList}>Check Past Sessions</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
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
          {profile.age == null || profile.age >= 50 ? (
            <View style={{ width: Dimensions.get("window").width * 0.9 }}>
              <TouchableOpacity
                style={{
                  width: "100%",
                  borderTopWidth: 1,
                  borderColor: "#E0E0E0",
                }}
                onPress={() => Linking.openURL(this.state.whatsappLink)}
              >
                <View>
                  <Text style={styles.optionList}>Join Whatsapp Group</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={{ width: Dimensions.get("window").width * 0.9 }}>
            <TouchableOpacity
              style={{
                width: "100%",
                borderTopWidth: 1,
                borderColor: "#E0E0E0",
                borderBottomWidth: 1,
              }}
              onPress={() => this.setState({ logoutPopup: true })}
            >
              <View>
                <Text style={styles.optionList}>Logout</Text>
              </View>
            </TouchableOpacity>
            {this.state.logoutPopup && (
              <AwesomeAlert
                show={this.state.logoutPopup}
                showProgress={false}
                title="Confirm"
                message={"Are you sure you want to logout?"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showCancelButton={true}
                showConfirmButton={true}
                confirmText="Cancel" //confirm action is for cancelling to swap positions of the two
                confirmButtonColor={Colors.primary}
                cancelButtonColor={Colors.grey.grey}
                cancelText="Logout"
                onConfirmPressed={() => {
                  this.setState({ logoutPopup: false });
                }}
                onCancelPressed={() => {
                  this.setState({ logoutPopup: false });
                  this._signout();
                }}
              />
            )}
          </View>
          {/* <View >
							<View>
								<Text >GoHappy Club from GoIndependent.in</Text>
								<Text >All rights reserved</Text>
							</View>
					</View> */}
        </ScrollView>
        {profile.age == null || profile.age >= 50 ? (
          <FAB
            style={styles.fab}
            icon={({ size, color }) => (
              <FontAwesomeIcon
                icon={faComment}
                color={Colors.white}
                size={25}
              />
            )}
            onPress={() => Linking.openURL(this.state.whatsappLink)}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: Colors.materialIndicatorColor,
  },
  coverContainer: {
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: "130%",
  },
  cardText: {
    textAlign: "center",
    marginTop: 10,
    color: Colors.white,
  },
  optionList: {
    fontSize: 16,
    padding: 10,
    color: Colors.grey.optionList,
  },
  fab: {
    backgroundColor: Colors.primary,
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    marginTop: 18,
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.deepskyblue,
  },
  logoutButton: {
    backgroundColor: Colors.grey.grey,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
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
