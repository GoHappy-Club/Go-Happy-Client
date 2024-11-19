import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
  useWindowDimensions,
  Image,
} from "react-native";
import Video from "react-native-video";
import { setProfile, setMembership } from "./redux/actions/counts.js";
import {
  NavigationContainer,
  usePreventRemoveContext,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/loginScreen/LoginScreen";
import BottomNavigator from "./components/navigators/BottomNavigator";
import HomeDetailsScreen from "./screens/homeScreen/HomeDetailsScreen";
import MembershipScreen from "./screens/myProfileScreen/MembershipScreen";
import AdditionalDetails from "./components/AdditionalDetails";
// import NoInternet from "./components/NoInternet";
import About from "./components/About";
// import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as configData from "./config/local/config.json";
import Icon from "react-native-vector-icons/Ionicons";
// import PushNotification from "react-native-push-notification";
import DeviceInfo from "react-native-device-info";
import firebase from "@react-native-firebase/app";
import { useSelector, useDispatch } from "react-redux";
import ErrorScreen from "./components/NoInternet";
import { WhatsNewMessage } from "./config/CONSTANTS";
import AwesomeAlert from "react-native-awesome-alerts";
import RenderHtml from "react-native-render-html";
import crashlytics from "@react-native-firebase/crashlytics";
import messaging from "@react-native-firebase/messaging";
import TripsScreen from "./screens/Trips/TripsScreen";
import TripDetailsScreen from "./screens/Trips/TripDetailsScreen";
import MySessionsScreen from "./screens/mySessionsScreen/MySessionsScreen";
import Intro from "./screens/loginScreen/Intro";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { useCopilot } from "react-native-copilot";
import axios from "./config/CustomAxios.js";
import { JWT_TOKEN } from "@env";
import { Colors } from "./assets/colors/color.js";
import Header from "./components/HeaderComponent.js";
import MyProfile from "./components/Profile.js";
import SubscriptionScreen from "./screens/subscriptionScreen/SubscriptionScreen.js";
import { ChevronLeft } from "lucide-react-native";
import { hp, wp } from "./helpers/common.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import WalletScreen from "./screens/subscriptionScreen/WalletScreen.js";
import TopUpScreen from "./screens/subscriptionScreen/TopUpScreen.js";
import PaymentFailed from "./components/PaymentFailed.js";
import PaymentSuccessful from "./components/PaymentSuccessful.js";
import AllTransactions from "./screens/AllTransactions/AllTransactions.js";
import RewardsScreen from "./screens/subscriptionScreen/RewardsScreen.js";
import VoucherDetails from "./components/VoucherDetails.js";

global.axios = axios;
global.AsyncStorage = AsyncStorage;
global.SERVER_URL = configData.BACKEND.SERVER_URL;
global.crashlytics = crashlytics;
global.Icon = Icon;
Icon.loadFont();

const Stack = createNativeStackNavigator();

// PushNotification.createChannel(
//   {
//     channelId: "events", // (required)
//     channelName: "My channel", // (required)
//     channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
//     playSound: true, // (optional) default: true
//     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
//     importance: 4, // (optional) default: 4. Int value of the Android notification importance
//     vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
//   },
//   (created) => crashlytics().log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
// );

const requestNotificationPermission = async () => {
  if (Platform.OS === "android") {
    try {
      PermissionsAndroid.check("android.permission.POST_NOTIFICATIONS")
        .then((response) => {
          if (!response) {
            PermissionsAndroid.request("android.permission.POST_NOTIFICATIONS");
          }
        })
        .catch((err) => {
          console.log("Notification Error=====>", err);
        });
    } catch (err) {
      console.log(err);
    }
  }
};

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.pink.pink }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 25,
        fontWeight: "800",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};

export default function App() {
  // requestNotificationPermission();
  const navigationRef = React.createRef();
  // set up parameters for what's new function
  var [justUpdated, setJustUpdated] = useState(false);
  const [notify, setNotify] = useState(null);
  var [productionAppVersion, setProductionAppVersion] = useState("");
  const [showWhatsNewMessage, setShowWhatsNewMessage] = useState(
    WhatsNewMessage().show
  );
  const [updateRequired, setUpdateRequired] = useState(false);
  const width = Dimensions.get("window").width;
  const contentWidth = useWindowDimensions();

  // AsyncStorage.getItem("token").then((out) => {
  //   token = out;
  // });
  const [isConnected, setIsConnected] = useState(true);
  const [token, setToken] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();

  const { copilotEvents } = useCopilot();

  useEffect(() => {
    // logic to revoke user's membership if his membershipEndDate has arrived
    const currentDate = new Date().getTime();
    const membershipEndDate = membership?.membershipEndDate;

    if (membershipEndDate && currentDate > membershipEndDate) {
      const url = `${SERVER_URL}/membership/expire?phoneNumber=${profile.phoneNumber}`;
      axios
        .get(url)
        .then((res) => {
          if (res.data) {
            setNewMembership({
              membershipType: response.data.membershipType,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [membership]);

  const setNewMembership = ({
    membershipType,
    id,
    membershipStartDate,
    membershipEndDate,
    coins,
  }) => {
    const newMembership = {
      membershipType: membershipType,
      id: id,
      membershipStartDate: membershipStartDate,
      membershipEndDate: membershipEndDate,
      coins: coins,
    };
    dispatch(setMembership({ ...newMembership }));
  };

  const setNewProfile = (
    name,
    email,
    phoneNumber,
    profileImage,
    token,
    sessionsAttended,
    // dob,
    dateOfJoining,
    selfInviteCode,
    city,
    emergencyContact,
    age
  ) => {
    const new_profile = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      profileImage: profileImage,
      token: token,
      sessionsAttended: sessionsAttended,
      // dob: dob,
      dateOfJoining: dateOfJoining,
      selfInviteCode: selfInviteCode,
      city: city,
      emergencyContact: emergencyContact,
      age: age,
    };
    dispatch(setProfile(new_profile));
  };

  useEffect(() => {
    recheck();
    // checkVersion();
    const fetchData = async () => {
      try {
        // Retrieve data from AsyncStorage
        const token_temp = await AsyncStorage.getItem("token");
        if (token_temp) setToken(true);
        else setToken(null);
        if (profile == "") {
          const phoneNumber = await AsyncStorage.getItem("phoneNumber");
          const name = await AsyncStorage.getItem("name");
          const email = await AsyncStorage.getItem("email");
          const emergencyContact = await AsyncStorage.getItem(
            "emergencyContact"
          );
          const city = await AsyncStorage.getItem("city");
          const profileImage = await AsyncStorage.getItem("profileImage");
          const sessionsAttended = await AsyncStorage.getItem(
            "sessionsAttended"
          );
          const dateOfJoining = await AsyncStorage.getItem("dateOfJoining");
          const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
          const age = await AsyncStorage.getItem("age");

          // now retrieve membership specific data
          const membershipType = await AsyncStorage.getItem("membershipType");
          const id = await AsyncStorage.getItem("membershipId");
          const membershipStartDate = await AsyncStorage.getItem(
            "membershipStartDate"
          );
          const membershipEndDate = await AsyncStorage.getItem(
            "membershipEndDate"
          );
          const coins = await AsyncStorage.getItem("coins");

          setNewProfile(
            name,
            email,
            phoneNumber,
            profileImage,
            token_temp,
            sessionsAttended,
            dateOfJoining,
            selfInviteCode,
            city,
            emergencyContact,
            age
          );

          setNewMembership({
            membershipType: membershipType,
            id: id,
            membershipStartDate: membershipStartDate,
            membershipEndDate: membershipEndDate,
            coins: coins,
          });
        }
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };
    setToken(true);
    fetchData();
    firebase.messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage == null) {
        return;
      }
      try {
        const incomingDeepLink = remoteMessage.data?.deepLink;
        const type = remoteMessage.data?.type;
        if (type && type == "highPriorityReminder") {
          setNotify(remoteMessage);
        } else {
          if (incomingDeepLink) {
            Linking.openURL(incomingDeepLink);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
    firebase
      .messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log("Initial Message: ", remoteMessage);
        if (remoteMessage == null) {
          return;
        }
        try {
          const incomingDeepLink = remoteMessage.data?.deepLink;
          const type = remoteMessage.data?.type;
          if (type && type == "highPriorityReminder") {
            setNotify(remoteMessage);
          } else {
            if (incomingDeepLink) {
              Linking.openURL(incomingDeepLink);
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
    const unsubscribe = firebase
      .messaging()
      .onMessage(async (remoteMessage) => {
        const incomingDeepLink = remoteMessage.data?.deepLink;
        const type = remoteMessage.data?.type;
        if (type && type == "subscriptionUpdate") {
          const userMembership = JSON.parse(remoteMessage.data.userMembership);
          updateUser({
            membershipType: userMembership.membershipType,
            id: userMembership.id,
            membershipStartDate: userMembership.membershipStartDate,
            membershipEndDate: userMembership.membershipEndDate,
            coins: userMembership.coins,
          });
          return;
        }
        if (type && type == "highPriorityReminder") setNotify(remoteMessage);
        else {
          Toast.show({
            config: { toastConfig },
            text1: remoteMessage.notification.title,
            text2: remoteMessage.notification.body,
            autoHide: true,
            visibilityTime: 10000,
            onPress: () => {
              Linking.openURL(incomingDeepLink);
            },
          });
        }
      });
    return unsubscribe;
  }, []);

  const updateUser = ({
    membershipType,
    id,
    membershipStartDate,
    membershipEndDate,
    coins,
  }) => {
    //store membership in AsyncStorage
    AsyncStorage.setItem("membershipType", membershipType);
    AsyncStorage.setItem("membershipId", id);
    AsyncStorage.setItem("membershipStartDate", membershipStartDate);
    AsyncStorage.setItem("membershipEndDate", membershipEndDate);
    AsyncStorage.setItem("coins", coins.toString());
    //set membership in redux
    setNewMembership({
      membershipType: membershipType,
      id: id,
      membershipStartDate: membershipStartDate,
      membershipEndDate: membershipEndDate,
      coins: coins,
    });
  };

  const recheck = async () => {
    try {
      const response = await axios.get(SERVER_URL);
      if (response.status == 200) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  const checkVersionHelper = async () => {
    var buildNumber = DeviceInfo.getBuildNumber();
    var url = SERVER_URL + "/properties/list";
    try {
      const response = await axios.get(url);
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0) {
          setProductionAppVersion(properties[0].buildNumber);
          if (properties[0].buildNumber > buildNumber) {
            return true;
          } else {
            return false;
          }
        }
      }
    } catch (error) {
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  };

  const checkVersion = async () => {
    var needUpdate = await checkVersionHelper();
    setUpdateRequired(needUpdate);
  };

  const linking = {
    prefixes: ["https://www.gohappyclub.in"],
    config: {
      screens: {
        "GoHappy Club": {
          screens: {
            HomeScreen: "free_sessions",
            Refer: "refer",
            MyProfile: "profile",
          },
        },
        "Session Details": "session_details/:deepId",
        "Membership Details": "contribute",
        "About GoHappy Club": "about",
        Trips: "trips",
        TripDetails: "trip_details",
        PastSessions: "past_sessions",
      },
    },
  };

  const NotificationContainer = ({
    imageUrl,
    maxHeight = 200,
    maxWidth = 300,
  }) => {
    // Use aspect ratio to maintain image proportions
    const aspectRatio = maxWidth / maxHeight;
    const containerWidth = width * 0.6; // Adjust container width as needed
    const imageHeight = containerWidth / aspectRatio;

    return (
      <View style={{ width: containerWidth, overflow: "hidden" }}>
        <RenderHtml
          contentWidth={containerWidth}
          source={{
            html: `<img src="${imageUrl}" height="${imageHeight}" width="${containerWidth}" />`,
          }}
        />
      </View>
    );
  };

  return (
    <>
      {justUpdated && (
        <AwesomeAlert
          show={showWhatsNewMessage}
          showProgress={false}
          title="What's New!"
          message={
            <View style={{ width: width * 0.6 }}>
              <RenderHtml source={{ html: WhatsNewMessage().message }} />
            </View>
          }
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Close"
          confirmButtonColor={Colors.deepskyblue}
          onConfirmPressed={() => {
            setJustUpdated((justUpdated = false));
            setShowWhatsNewMessage((showWhatsNewMessage = false));
          }}
        />
      )}

      {updateRequired && (
        <AwesomeAlert
          show={true}
          showProgress={false}
          title="Update Required"
          message={
            <View style={{ width: width * 0.6 }}>
              <RenderHtml
                source={{
                  html: "To continue using the app, please install the latest version available. <br/><br/>This update ensures you have access to the newest features and improvements. Thank you for staying up to date!",
                }}
              />
            </View>
          }
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Update Now"
          confirmButtonColor={Colors.primary}
          onConfirmPressed={() => {
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.gohappyclient"
            );
            // setShowWhatsNewMessage((showWhatsNewMessage = false));
          }}
        />
      )}

      {isConnected == true && token != false ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <NavigationContainer
              linking={token == true && linking}
              ref={navigationRef}
            >
              <Stack.Navigator>
                <>
                  <Stack.Screen
                    name="Login"
                    children={(props) => (
                      <LoginScreen {...props} propProfile={profile} />
                    )}
                    options={{
                      headerLeft: () => <View />,
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="GoHappy Club"
                    children={(props) => (
                      <BottomNavigator {...props} propProfile={profile} />
                    )}
                    options={{
                      header: (props) => <Header {...props} />,
                      elevation: 0,
                      shadowOpacity: 0,
                      headerShadowVisible: true,
                    }}
                  />
                  <Stack.Screen
                    name="Session Details"
                    children={(props) => (
                      <HomeDetailsScreen
                        {...props}
                        propProfile={profile}
                        copilotEvents={copilotEvents}
                      />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("GoHappy Club")}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="Membership Details"
                    // component={MembershipScreen}
                    children={(props) => (
                      <MembershipScreen {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("GoHappy Club")}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="Additional Details"
                    // component={AdditionalDetails}
                    children={(props) => (
                      <AdditionalDetails {...props} propProfile={profile} />
                    )}
                    options={{
                      headerLeft: () => <View />,
                      headerTransparent: true,
                      title: null,
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="About GoHappy Club"
                    // component={About}
                    children={(props) => (
                      <About {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("MyProfile")}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="PastSessions"
                    // component={About}
                    children={(props) => (
                      <MySessionsScreen {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("MyProfile")}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="Trips"
                    // component={HomeDetailsScreen}
                    children={(props) => (
                      <TripsScreen {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("OverviewScreen")}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="TripDetails"
                    // component={HomeDetailsScreen}
                    children={(props) => (
                      <TripDetailsScreen {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("Trips")}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="MyProfile"
                    children={(props) => (
                      <MyProfile {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("GoHappy Club")}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="SubscriptionPlans"
                    children={(props) => <SubscriptionScreen />}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        // <TouchableOpacity
                        //   style={styles.newBackButton}
                        //   onPress={() =>
                        //     navigation.canGoBack()
                        //       ? navigation.goBack()
                        //       : navigation.navigate("GoHappy Club")
                        //   }
                        // >
                        //   <ChevronLeft size={wp(10)} color={Colors.black} />
                        //   <Text style={styles.newBackText}>Back</Text>
                        // </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() =>
                            navigation.canGoBack()
                              ? navigation.goBack()
                              : navigation.navigate("GoHappy Club")
                          }
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                      presentation: "modal",
                      animation: "fade_from_bottom",
                    })}
                  />
                  <Stack.Screen
                    name="WalletScreen"
                    children={(props) => <WalletScreen />}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        // <TouchableOpacity
                        //   style={styles.newBackButton}
                        //   onPress={() => navigation.navigate("GoHappy Club")}
                        // >
                        //   <ChevronLeft size={wp(10)} color={Colors.black} />
                        //   <Text style={styles.newBackText}>Back</Text>
                        // </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.navigate("GoHappy Club")}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="TopUpScreen"
                    children={(props) => <TopUpScreen />}
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerStyle: {
                        backgroundColor: Colors.grey.f0,
                      },
                      headerLeft: () => (
                        // <TouchableOpacity
                        //   style={styles.newBackButton}
                        //   onPress={() => navigation.goBack()}
                        // >
                        //   <ChevronLeft size={wp(10)} color={Colors.black} />
                        //   <Text style={styles.newBackText}>Back</Text>
                        // </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.goBack()}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="PaymentFailed"
                    children={(props) => <PaymentFailed />}
                    options={({ navigation }) => ({
                      headerShown: false,
                      animation: "slide_from_right",
                    })}
                  />
                  <Stack.Screen
                    name="PaymentSuccessful"
                    children={(props) => <PaymentSuccessful />}
                    options={({ navigation }) => ({
                      headerShown: false,
                      animation: "slide_from_right",
                    })}
                  />
                  <Stack.Screen
                    name="AllTransactions"
                    children={(props) => <AllTransactions />}
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerStyle: {
                        backgroundColor: "#FFF5D7",
                      },
                      headerLeft: () => (
                        // <TouchableOpacity
                        //   style={styles.newBackButton}
                        //   onPress={() => navigation.goBack()}
                        // >
                        //   <ChevronLeft size={wp(10)} color={Colors.black} />
                        //   <Text style={styles.newBackText}>Back</Text>
                        // </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.goBack()}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="Rewards"
                    children={(props) => <RewardsScreen />}
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerTransparent: true,
                      headerLeft: () => (
                        // <TouchableOpacity
                        //   style={styles.newBackButton}
                        //   onPress={() => navigation.goBack()}
                        // >
                        //   <ChevronLeft size={wp(10)} color={Colors.black} />
                        //   <Text style={styles.newBackText}>Back</Text>
                        // </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.goBack()}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="VoucherDetails"
                    children={(props) => <VoucherDetails />}
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerTransparent: true,
                      headerLeft: () => (
                        // <TouchableOpacity
                        //   style={styles.newBackButton}
                        //   onPress={() => navigation.goBack()}
                        // >
                        //   <ChevronLeft size={wp(10)} color={Colors.black} />
                        //   <Text style={styles.newBackText}>Back</Text>
                        // </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.goBack()}
                          underlayColor={Colors.white}
                        >
                          <Text style={styles.backText}>back</Text>
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                      // presentation: "modal",
                      // animation: "fade_from_bottom",
                    })}
                  />
                </>
              </Stack.Navigator>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      ) : (
        <Video
          source={require("./images/logo_splash.mp4")}
          style={{
            position: "absolute",
            top: 0,
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 1,
          }}
          muted={true}
          repeat={true}
          resizeMode="cover"
        />
      )}
      {isConnected == false && <ErrorScreen recheck={recheck} />}
      <Toast />
      {notify && (
        <AwesomeAlert
          confirmButtonStyle={{
            backgroundColor: Colors.primary,
            color: Colors.white,
            borderRadius: 5,
            // padding: 15,
          }}
          contentStyle={{
            padding: 0,
            margin: 0,
            // backgroundColor: "blue",
            borderWidth: 0,
          }}
          titleStyle={{
            fontWeight: 600,
          }}
          show={true}
          showProgress={false}
          title={notify.notification.title}
          customView={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "blue",
                margin: 0,
                padding: 0,
                shadowColor: Colors.grey.c,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                borderWidth: 0,
              }}
            >
              {/* {notify?.notification?.android?.imageUrl && (
                <Image
                  style={{
                    width: 300,
                    // height: 150,
                    borderRadius: 5,
                    aspectRatio: 1,
                    // marginBottom: 10,
                  }}
                  source={{ uri: notify?.notification?.android?.imageUrl }}
                />
              )} */}
              <Text
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 16,
                  color: Colors.black,
                  lineHeight: 24,
                  // textAlign: "left",
                }}
              >
                {notify.notification.body}
              </Text>
            </View>
          }
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          confirmText={notify?.data?.confirmText}
          confirmButtonColor={Colors.primary}
          onDismiss={() => {
            setNotify(null);
          }}
          onConfirmPressed={() => {
            Linking.openURL(notify.data.deepLink);
            setNotify(null);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
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
  newBackButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: -10,
  },
  newBackText: {
    color: Colors.black,
    textAlign: "center",
    fontSize: 18,
  },
  backText: {
    color: Colors.black,
    textAlign: "center",
  },
});
