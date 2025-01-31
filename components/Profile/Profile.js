import {
  Image,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { Colors } from "../../assets/colors/color";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { hp, wp } from "../../helpers/common";
import { useDispatch, useSelector } from "react-redux";
import {
  Award,
  Calendar,
  CircleHelp,
  Clock,
  Languages,
  Pen,
  Pencil,
  PenIcon,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCrow,
  faCrown,
  faHistory,
  faInfoCircle,
  faLanguage,
  faSignOutAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import AwesomeAlert from "react-native-awesome-alerts";
import { firebase } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import { useTranslation } from "react-i18next";

const Profile = () => {
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
    showBackdrop: false,
    whatsappHelpLink: "",
  });

  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ref = useRef();
  const { t } = useTranslation();

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
          const whatsappHelpLink = properties[0].whatsappHelpLink;
          setState((prevState) => ({
            ...prevState,
            whatsappHelpLink,
          }));
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
      await firebase
        .auth()
        .signOut()
        .then(() => {})
        .catch(() => console.log("It's ok"));
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

  const formatPhoneNumber = (phoneNumber) =>
    `+${phoneNumber.slice(0, -10)} ${phoneNumber.slice(-10)}`;

  const formatDuration = (dateOfJoining) => {
    const now = new Date();
    const days = Math.ceil(
      (now.getTime() - Number(dateOfJoining)) / (1000 * 3600 * 24)
    );

    const dayString = isNaN(days) || days <= 1 ? t("day") : t("days");
    return `${days} ${dayString}`;
  };

  const showRedDot = () => {
    if (
      profile.email == "" ||
      profile.email == null ||
      profile.email == undefined
    ) {
      return true;
    } else if (
      profile.phoneNumber == "" ||
      profile.phoneNumber == null ||
      profile.phoneNumber == undefined
    ) {
      return true;
    } else if (
      profile.profileImage == "" ||
      profile.profileImage == null ||
      profile.profileImage == undefined
    ) {
      return true;
    } else if (
      profile.age == "" ||
      profile.age == null ||
      profile.age == undefined
    ) {
      return true;
    } else if (
      profile.emergencyContact == "" ||
      profile.emergencyContact == null ||
      profile.emergencyContact == undefined
    ) {
      return true;
    } else if (
      profile.city == "" ||
      profile.city == null ||
      profile.city == undefined
    ) {
      return true;
    } else if (
      profile.dob == "" ||
      profile.dob == null ||
      profile.dob == undefined
    ) {
      return true;
    }
    return false;
  };

  const data = [
    {
      key: t("sessions_attended"),
      value: profile.sessionsAttended,
      icon: <Calendar size={32} color={Colors.background} />,
    },
    {
      key: t("membership"),
      value: membership.membershipType,
      icon: <Award size={32} color={Colors.background} />,
    },
    {
      key: t("member_since"),
      value: formatDuration(profile.dateOfJoining),
      icon: <Clock size={32} color={Colors.background} />,
    },
  ];

  const closeModal = () => {
    ref.current?.snapToIndex(0);
    setState((prev) => ({ ...prev, showBackdrop: false }));
  };

  const renderBackdrop = useCallback(
    ({ animatedIndex }) => {
      const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
          animatedIndex.value,
          [0, 1],
          [0, 1],
          Extrapolation.CLAMP
        ),
      }));

      const containerStyle = [StyleSheet.absoluteFill, containerAnimatedStyle];

      if (Platform.OS === "ios") {
        return (
          <Animated.View style={containerStyle}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={closeModal}
              activeOpacity={1}
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurAmount={1}
                blurType="regular"
              />
            </TouchableOpacity>
          </Animated.View>
        );
      }

      return (
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
            containerAnimatedStyle,
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeModal}
            activeOpacity={1}
          />
        </Animated.View>
      );
    },
    [closeModal]
  );

  const snapPoints = React.useMemo(() => ["42%", "70%"], []);

  const handleSheetChanges = useCallback((index) => {
    if (index == 1) setState((prev) => ({ ...prev, showBackdrop: true }));
    if (index == 0) setState((prev) => ({ ...prev, showBackdrop: false }));
  }, []);
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
              <Text>{t("back")}</Text>
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
                onPress={() => Linking.openURL(state.whatsappHelpLink)}
              >
                <CircleHelp size={22} color={"black"} />
                <Text
                  style={{
                    fontFamily: "NunitoSans-Regular",
                    fontSize: wp(4),
                  }}
                >
                  {t("help")}
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
                  {t("edit")}
                </Text>
                <Pencil size={18} color={Colors.beige} />

                {showRedDot() && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      backgroundColor: Colors.red,
                      borderRadius: 10,
                      width: 10,
                      height: 10,
                      zIndex: 1,
                      borderWidth: 1,
                      borderColor: Colors.background,
                    }}
                  />
                )}
              </Pressable>
            </View>
          </View>
          <View style={styles.dashedBorder} />
          <View style={styles.achievmentsContainer}>
            {data.map((item) => (
              <View style={styles.achievmentItem} key={item.key}>
                <View
                  style={{
                    backgroundColor: Colors.primary,
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
          ref={ref}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={false}
          enableDismissOnClose={true}
          handleStyle={{ display: "none" }}
          backdropComponent={renderBackdrop}
          // backdropComponent={state.showBackdrop ? renderBackdrop : null}
          style={{
            overflow: "hidden",
            borderRadius: 40,
            paddingHorizontal: wp(6),
            paddingVertical: hp(3),
          }}
          backgroundStyle={{
            borderRadius: 40,
          }}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.scrollViewContent}
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
                      source={require("../../images/darkWordLogo.png")}
                    />
                    <Text
                      style={{
                        fontFamily: "NunitoSans-SemiBold",
                        fontSize: wp(3),
                      }}
                    >
                      {t("join_our_exclusive_membership")}
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
                      {t("join_now")}
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
              <FontAwesomeIcon
                icon={faHistory}
                size={24}
                color={Colors.primaryText}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{t("check_past_sessions")}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("About GoHappy Club")}
            >
              <FontAwesomeIcon
                icon={faInfoCircle}
                size={24}
                color={Colors.primaryText}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{t("about_goHappy")}</Text>
              </View>
            </TouchableOpacity>

            {(profile.age == null || profile.age >= 50) && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => Linking.openURL(state.whatsappLink)}
              >
                <FontAwesomeIcon
                  icon={faUsers}
                  size={24}
                  color={Colors.primaryText}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{t("join_whatsapp")}</Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Languages")}
            >
              <Languages size={24} color={Colors.primaryText} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{t("change_language")}</Text>
              </View>
            </TouchableOpacity>
            {/* {membership.freeTrialActive != true && membership?.membershipType !="Free" && ( */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("MembershipDetails")}
            >
              <FontAwesomeIcon
                icon={faCrown}
                size={24}
                color={Colors.primaryText}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{t("membership_status")}</Text>
              </View>
            </TouchableOpacity>
            {/* )} */}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                setState((prevState) => ({ ...prevState, logoutPopup: true }))
              }
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                size={24}
                color={Colors.primaryText}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{t("logout")}</Text>
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
        onDismiss={() => {
          setState((prevState) => ({ ...prevState, logoutPopup: false }));
        }}
      />
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    height: hp(65),
    backgroundColor: Colors.beige,
    justifyContent: "start",
    alignItems: "center",
    paddingBottom: hp(5),
  },
  scrollViewContent: {
    paddingBottom: hp(10),
    justifyContent: "center",
    alignItems: "center",
    // overflow: "hidden",
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
    marginTop: hp(4),
    marginBottom: hp(2),
  },
  achievmentsContainer: {
    width: "100%",
    // marginTop: hp(2),
    marginBottom: hp(4),
    paddingHorizontal: wp(1),
    // paddingVertical: hp(2),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  achievmentItem: {
    alignSelf: "flex-start",
    padding: wp(4),
    borderRadius: 20,
    alignItems: "center",
    gap: wp(2),
    minWidth: wp(30),
  },
  achievmentValue: {
    color: Colors.primaryText,
    fontSize: wp(5),
    fontFamily: "Montserrat-SemiBold",
  },
  achievmentKey: {
    fontSize: wp(3),
    fontFamily: "Montserrat-Regular",
    color: Colors.primaryText,
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
    color: Colors.primaryText,
  },
});
