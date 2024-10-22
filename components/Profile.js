import React, { useState, useEffect, useCallback } from "react";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { FAB, PaperProvider } from "react-native-paper";

import { Text } from "react-native-elements";

import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { changeCount, setProfile } from "../redux/actions/counts.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { launchImageLibrary } from "react-native-image-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import { Colors } from "../assets/colors/color.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyProfile = ({ navigation }) => {
  const [state, setState] = useState({
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
  });

  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state?.membership?.membership);

  const dispatch = useDispatch();

  const retrieveData = useCallback(async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      const email = await AsyncStorage.getItem("email");
      const profileImage = await AsyncStorage.getItem("profileImage");
      setState((prevState) => ({
        ...prevState,
        name,
        email,
        profileImage,
      }));
    } catch (error) {
      // Error retrieving data
    }
  }, []);

  const openWhatsApp = useCallback(async () => {
    var url = SERVER_URL + "/properties/list";
    try {
      const response = await axios.get(url);
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0) {
          const now = new Date();
          const days = Math.ceil(
            (now.getTime() - Number(profile.dateOfJoining)) /
              (1000 * 3600 * 24)
          );
          if (days < 10 || Number(profile.sessionsAttended) < 5) {
            setState(prevState => ({
              ...prevState,
              whatsappLink: properties[0].whatsappGroupLink[0]
            }));
          } else {
            setState(prevState => ({
              ...prevState,
              whatsappLink: properties[0].whatsappGroupLink[1]
            }));
          }
        }
      }
    } catch (error) {
      // Handle error
      console.log("Error in openWhatsApp:", error);;
      
    }
  }, [profile]);

  useEffect(() => {
    retrieveData();
    openWhatsApp();
    const unsubscribe = navigation.addListener("focus", retrieveData);
    return unsubscribe;
  }, [navigation, retrieveData, openWhatsApp]);

  const handleSelectImage = async () => {
    try {
      var options = {
        mediaType: "photo",
        maxHeight: 1024,
        maxWidth: 1024,
        quality: 0.5,
        includeBase64: true,
      };
      launchImageLibrary(options, (response) => {
        if (!response.didCancel && !response.error) {
          const base64Image = `data:${response.type};base64,${response.assets[0].base64}`;
          var url = SERVER_URL + "/user/updateProfileImage";
          axios
            .post(url, {
              phoneNumber: profile.phoneNumber,
              profileImage: base64Image,
            })
            .then(() => {
              dispatch(setProfile({ ...profile, profileImage: base64Image }));
              setState(prevState => ({ ...prevState, image: base64Image }));
              AsyncStorage.setItem("profileImage", base64Image);
            })
            .catch((error) => {
              // Handle error
            });
        }
      });
    } catch (error) {
      console.log("Error in handleSelectImage:", error);
    }
  };

  const signout = async () => {
    try {
      await firebase.auth().signOut();
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const now = new Date();
  const days = Math.ceil(
    (now.getTime() - Number(profile.dateOfJoining)) / (1000 * 3600 * 24)
  );

  const dayString = isNaN(days) || days <= 1 ? "day" : "days";

  if (state.loader) {
    return (
      <MaterialIndicator
        color={Colors.white}
        style={{ backgroundColor: Colors.materialIndicatorColor }}
      />
    );
  }

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: Colors.white, height: "100%" }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.coverContainer}>
            <Image
              style={styles.cover}
              resizeMode="cover"
              source={{
                uri: state.image || profile.profileImage,
              }}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text h3 style={styles.nameText}>
              {profile.name}
            </Text>
          </View>
        </View>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <View style={[styles.statItem, styles.borderRight]}>
            <Text style={styles.cardText}>Sessions Attended</Text>
            <Text style={[styles.cardText, styles.boldText]}>
              {profile.sessionsAttended}
            </Text>
          </View>
          <View style={[styles.statItem, styles.borderRight]}>
            <Text style={styles.cardText}>Membership</Text>
            <Text style={[styles.cardText, styles.boldText]}>
              {membership && membership.membershipType}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.cardText}>Member Since</Text>
            <Text style={[styles.cardText, styles.boldText]}>
              {days} {dayString}
            </Text>
          </View>
        </View>

        {/* Menu options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleSelectImage}>
            <Text style={styles.optionList}>Update Profile Picture</Text>
          </TouchableOpacity>

          {(profile.age == null || profile.age > 50) && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("PastSessions")}
              >
                <Text style={styles.optionList}>Check Past Sessions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Linking.openURL(state.whatsappLink)}
              >
                <Text style={styles.optionList}>Join Whatsapp Group</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("About GoHappy Club")}
          >
            <Text style={styles.optionList}>About GoHappy Club</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.borderBottom]}
            onPress={() => setState(prevState => ({ ...prevState, logoutPopup: true }))}
          >
            <Text style={styles.optionList}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout confirmation popup */}
      <AwesomeAlert
        show={state.logoutPopup}
        showProgress={false}
        title="Confirm"
        message="Are you sure you want to logout?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Cancel"
        confirmButtonColor={Colors.primary}
        cancelButtonColor={Colors.grey.grey}
        cancelText="Logout"
        onConfirmPressed={() => setState(prevState => ({ ...prevState, logoutPopup: false }))}
        onCancelPressed={() => {
          setState(prevState => ({ ...prevState, logoutPopup: false }));
          signout();
        }}
      />

      {/* WhatsApp FAB */}
      {(profile.age == null || profile.age > 50) && (
        <FAB
          style={styles.fab}
          icon={({ size, color }) => (
            <FontAwesomeIcon
              icon={faComment}
              color={Colors.white}
              size={25}
            />
          )}
          onPress={() => Linking.openURL(state.whatsappLink)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    width: "100%",
    height: Dimensions.get("window").height / 3,
    justifyContent: "center",
  },
  coverContainer: {
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: "130%",
  },
  nameContainer: {
    position: "absolute",
    top: 0,
    paddingLeft: 20,
    height: "180%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  nameText: {
    overflow: "hidden",
    backgroundColor: "rgba(41,191,194,0.9)",
    padding: 4,
    color: Colors.white,
    borderRadius: 10,
  },
  statsCard: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.9,
    height: 80,
    marginTop: "2%",
    flexDirection: "row",
  },
  statItem: {
    width: "33%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardText: {
    textAlign: "center",
    marginTop: 10,
    color: Colors.white,
  },
  boldText: {
    fontWeight: "bold",
  },
  menuContainer: {
    width: Dimensions.get("window").width * 0.9,
    marginTop: 20,
  },
  menuItem: {
    width: "100%",
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
  },
  borderBottom: {
    borderBottomWidth: 1,
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
});

export default MyProfile;
