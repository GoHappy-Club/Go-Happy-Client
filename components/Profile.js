import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FAB } from "react-native-paper";

import { Text } from "react-native-elements";

import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { changeCount, setProfile } from "../redux/actions/counts.js";;
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { launchImageLibrary } from "react-native-image-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import { useDispatch } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Profile=(props)=>  {

  console.log("profile props====>",props);

  useEffect(() => {
    _retrieveData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      _retrieveData();
    }, [])
  );
  const [phoneNumber,setPhoneNumber]= useState("");
  const [password,setPassword]= useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loader, setLoader] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [membership, setMembership] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [image, setImage] = useState(null);
  const [logoutPopup, setLogoutPopup] = useState(false);

  const dispatch = useDispatch();


 const  _handleSelectImage = async () => {
    try {
      const redux_profile = props.profile;
      var options = {
        mediaType: "photo",
        maxHeight: 1024,
        maxWidth: 1024,
        quality: 0.5,
        includeBase64: true,
      };
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
        } else if (response.error) {
        } else {
          const base64Image = `data:${response.type};base64,${response.assets[0].base64}`;
          var url = SERVER_URL + "/user/updateProfileImage";
          axios
            .post(url, {
              phoneNumber: redux_profile.phoneNumber,
              profileImage: base64Image,
            })
            .then((response1) => {})
            .catch((error) => {
            });
          redux_profile.profileImage = base64Image;
          // this.setState({ image: base64Image });
          setImage(base64Image)
          AsyncStorage.setItem("profileImage", base64Image);
        }
      });
    } catch (error) {
    }
  };
  const refreshProfile=()=> {
    var url = SERVER_URL + "/auth/login";
    const redux_profile = props.profile;
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
          redux_profile = response.data;
          redux_profile.sessionsAttended = response.data.sessionsAttended;
          // actions.setProfile(redux_profile);
          dispatch(setProfile(redux_profile));
        }
      })
      .catch((error) => {
        // alert(error);
      });
  }

 const decrementCount=()=> {
    let { count } = props;
    count--;
    // actions.changeCount(count);
    dispatch(changeCount(count));

  }
  const incrementCount=()=> {
    let { count } = props;

    count++;
    actions.changeCount(count);
    dispatch(changeCount(count));
  }

  const _signout = async () => {
    try {
      firebase.auth().signOut();
      AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error(error);
    }
  };
 const  _retrieveData = async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      const email = await AsyncStorage.getItem("email");
      const profileImage = await AsyncStorage.getItem("profileImage");
      const membership = await AsyncStorage.getItem("membership");
      setName(name);
      setEmail(email);
      setProfileImage(profileImage);
      setMembership(membership);
    } catch (error) {
      // Error retrieving data
    }
  };
  const openWhatsApp = () => {
    let url = "https://chat.whatsapp.com/FnEL0tDNlRtEOjYUhehZ1F";
    Linking.openURL(url)
      .then((data) => {})
      .catch(() => {
        alert("Make sure WhatsApp installed on your device");
      });
  };
    
    const navigation = useNavigation();
    const title = "Login";
    const { count } = props;
    const { profile } = props;
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

    if (loader == true) {
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: "#0A1045" }}
        />
      );
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
            <View style={styles.coverContainer}>
              <Image
                style={styles.cover}
                resizeMode="cover"
                source={{
                  uri:
                    image && image.length > 0
                      ? image
                      : profile.profileImage,
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
                <Text style={{ ...styles.cardText, fontWeight: "bold" }}>
                  {days} {dayString}
                </Text>
              </View>
            </View>
          </View>
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
              onPress={_handleSelectImage}
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
              onPress={() => navigation.navigate("PastSessions")}
            >
              <View>
                <Text style={styles.optionList}>Check Past Sessions</Text>
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
                navigation.navigate("About GoHappy Club");
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
              onPress={openWhatsApp}
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
              onPress={() => setLogoutPopup(true)}
            >
              <View>
                <Text style={styles.optionList}>Logout</Text>
              </View>
            </TouchableOpacity>
            {logoutPopup && (
              <AwesomeAlert
                show={logoutPopup}
                showProgress={false}
                title="Confirm"
                message={"Are you sure you want to logout?"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showCancelButton={true}
                showConfirmButton={true}
                confirmText="Cancel" //confirm action is for cancelling to swap positions of the two
                confirmButtonColor="#29BFC2"
                cancelButtonColor="gray"
                cancelText="Logout"
                onConfirmPressed={() => {
                  setLogoutPopup(false)
                }}
                onCancelPressed={() => {
                  setLogoutPopup(false)
                  _signout();
                }}
              />
            )}
          </View>
        </ScrollView>

        <FAB
          style={styles.fab}
          icon={({ size, color }) => (
            <FontAwesomeIcon icon={faComment} color={"white"} size={25} />
          )}
          onPress={openWhatsApp}
        />
      </View>
    );
  }

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#0A1045",
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
    backgroundColor: "deepskyblue",
  },
  logoutButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Profile;
