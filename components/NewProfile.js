import {
  Image,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { Colors } from "../assets/colors/color";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { hp, wp } from "../helpers/common";
import { useDispatch, useSelector } from "react-redux";
import {
  Award,
  Calendar,
  CircleHelp,
  Clock,
  Pen,
  Pencil,
  PenIcon,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHistory,
  faInfoCircle,
  faSignOutAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import AwesomeAlert from "react-native-awesome-alerts";
import { firebase } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";

const NewProfile = () => {
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
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
            (now.getTime() - Number(profile.dateOfJoining)) / (1000 * 3600 * 24)
          );
          if (days < 10 || Number(profile.sessionsAttended) < 5) {
            setState((prevState) => ({
              ...prevState,
              whatsappLink: properties[0].whatsappGroupLink[0],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              whatsappLink: properties[0].whatsappGroupLink[1],
            }));
          }
        }
      }
    } catch (error) {
      // Handle error
      console.log("Error in openWhatsApp:", error);
    }
  }, [profile]);

  useEffect(() => {
    retrieveData();
    openWhatsApp();
    const unsubscribe = navigation.addListener("focus", retrieveData);
    return unsubscribe;
  }, [navigation, retrieveData, openWhatsApp]);

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

  const formatName = (name) => {
    const names = name.split(" ");
    const formattedName = names
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return formattedName;
  };

  const formatPhoneNumber = (phoneNumber) => {
    const countryCode = phoneNumber.slice(0, 2);
    const number = phoneNumber.slice(2);
    return `+${countryCode} ${number}`;
  };

  const formatDuration = (dateOfJoining) => {
    const now = new Date();
    const days = Math.ceil(
      (now.getTime() - Number(dateOfJoining)) / (1000 * 3600 * 24)
    );

    const dayString = isNaN(days) || days <= 1 ? "day" : "days";
    return `${days} ${dayString}`;
  };

  const data = [
    {
      key: "Sessions Attended",
      value: profile.sessionsAttended,
      icon: <Calendar size={32} color={"#FFC107"} />,
    },
    {
      key: "Membership",
      value: membership.membershipType,
      icon: <Award size={32} color={"#FFC107"} />,
    },
    {
      key: "Member Since",
      value: formatDuration(profile.dateOfJoining),
      icon: <Clock size={32} color={"#FFC107"} />,
    },
  ];

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: hp(2.5),
            }}
          >
            <TouchableOpacity
              style={{
                padding: 4,
                backgroundColor: Colors.white,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: Colors.white,
                shadowColor: Colors.black,
                elevation: 10,
                shadowOffset: { height: 2 },
                shadowOpacity: 0.3,
                position: "relative",
                top: 15,
                left: 15,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text>back</Text>
            </TouchableOpacity>
            {(profile.age == null || profile.age >= 50) && (
              <Pressable
                style={{
                  position: "relative",
                  top: 10,
                  right: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
                onPress={() => Linking.openURL(state.whatsappLink)}
              >
                <CircleHelp size={22} color={"black"} />
                <Text
                  style={{
                    fontFamily: "NunitoSans-Regular",
                    fontSize: wp(4),
                  }}
                >
                  Help
                </Text>
              </Pressable>
            )}
          </View>
          <View style={styles.basicDetailsContainer}>
            <FastImage
              style={styles.cover}
              resizeMode="cover"
              source={{
                uri: profile.profileImage,
              }}
            />
            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={styles.profileName}>{formatName(profile.name)}</Text>
              <Text style={styles.phoneNumber}>
                {formatPhoneNumber(profile.phoneNumber)}
              </Text>
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 10,
                  borderRadius: 5,
                  padding: 6,
                  backgroundColor: Colors.primary,
                  alignSelf: "flex-start",
                }}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Text
                  style={{
                    color: Colors.white,
                  }}
                >
                  Edit
                </Text>
                <Pencil size={18} color={Colors.beige} />
              </Pressable>
            </View>
          </View>
          <View style={styles.dashedBorder} />
          <View style={styles.achievmentsContainer}>
            {data.map((item) => (
              <View style={styles.achievmentItem} key={item.key}>
                <View
                  style={{
                    backgroundColor: "#FFF8E1",
                    padding: 15,
                    borderRadius: 300,
                  }}
                >
                  {item.icon}
                </View>
                <View
                  style={{
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Text style={styles.achievmentValue}>{item.value}</Text>
                  <Text style={styles.achievmentKey}>{item.key}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <BottomSheet
          index={0}
          snapPoints={["48%"]}
          enablePanDownToClose={true}
          enableDismissOnClose={true}
          handleStyle={{ display: "none" }}
          enableContentPanningGesture={false}
          style={{
            overflow: "hidden",
            borderRadius: 40,
            paddingHorizontal: wp(5),
            paddingVertical: wp(5),
          }}
          backgroundStyle={{
            borderRadius: 40,
          }}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            style={{
              borderRadius: 40,
            }}
          >
            {membership.membershipType == "Free" &&
              (profile.age == null || profile.age >= 50) && (
                <View
                  style={{
                    backgroundColor: Colors.beige,
                    width: "100%",
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    borderRadius: 20,
                    elevation: 4,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: wp(5),
                  }}
                >
                  <View>
                    <FastImage
                      style={{
                        width: wp(25),
                        height: wp(12),
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                      source={require("../images/wordLogo.png")}
                    />
                    <Text
                      style={{
                        fontFamily: "NunitoSans-SemiBold",
                        fontSize: wp(3),
                      }}
                    >
                      Join our exclusive membership
                    </Text>
                  </View>
                  <Pressable
                    style={{
                      backgroundColor: Colors.primary,
                      padding: 10,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    onPress={() => navigation.navigate("SubscriptionPlans")}
                  >
                    <Text
                      style={{
                        color: Colors.white,
                        fontFamily: "NunitoSans-SemiBold",
                      }}
                    >
                      Join now
                    </Text>
                  </Pressable>
                </View>
              )}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                console.log("Clicked");
                navigation.navigate("PastSessions");
              }}
            >
              <FontAwesomeIcon icon={faHistory} size={24} color="#666" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Check Past Sessions</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("About GoHappy Club")}
            >
              <FontAwesomeIcon icon={faInfoCircle} size={24} color="#666" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>About GoHappy Club</Text>
              </View>
            </TouchableOpacity>

            {(profile.age == null || profile.age >= 50) && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Linking.openURL(state.whatsappLink)}
              >
                <FontAwesomeIcon icon={faUsers} size={24} color="#666" />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Join WhatsApp Support Group</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                setState((prevState) => ({ ...prevState, logoutPopup: true }))
              }
            >
              <FontAwesomeIcon icon={faSignOutAlt} size={24} color="#666" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Logout</Text>
              </View>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
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
        onConfirmPressed={() =>
          setState((prevState) => ({ ...prevState, logoutPopup: false }))
        }
        onCancelPressed={() => {
          setState((prevState) => ({ ...prevState, logoutPopup: false }));
          signout();
        }}
      />
    </>
  );
};

export default NewProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    // flex: 1,
    height: hp(60),
    backgroundColor: Colors.beige,
    justifyContent: "start",
    alignItems: "center",
  },
  scrollViewContent: {
    paddingBottom: hp(10),
    // marginTop: hp(2),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cover: {
    width: wp(35),
    aspectRatio: 1,
    borderRadius: wp(25),
  },
  basicDetailsContainer: {
    width: "100%",
    paddingHorizontal: wp(10),
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    gap: wp(8),
  },
  profileName: {
    fontSize: wp(6),
    fontFamily: "Montserrat-SemiBold",
  },
  phoneNumber: {
    fontSize: wp(3),
    fontFamily: "Montserrat-SemiBold",
    letterSpacing: 0.8,
  },
  dashedBorder: {
    height: 1,
    width: "90%",
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: wp(8),
  },
  achievmentsContainer: {
    width: "100%",
    flex: 1,
    paddingHorizontal: wp(1),
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  achievmentItem: {
    alignSelf: "flex-start",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    gap: 10,
  },
  achievmentValue: {
    fontSize: wp(5),
    fontFamily: "Montserrat-SemiBold",
    color: "black",
  },
  achievmentKey: {
    fontSize: wp(3),
    fontFamily: "Montserrat-Regular",
    color: "black",
    maxWidth: wp(25),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    width: "100%",
  },
  textContainer: {
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#202124",
  },
});
