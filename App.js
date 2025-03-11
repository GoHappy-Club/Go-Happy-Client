import "./i18n.js";
import "@react-native-firebase/messaging";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "@react-native-firebase/app";
import crashlytics from "@react-native-firebase/crashlytics";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Updates from "expo-updates";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { useCopilot } from "react-native-copilot";
import FastImage from "react-native-fast-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PushNotification from "react-native-push-notification";
import RenderHtml from "react-native-render-html";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

import { Colors } from "./assets/colors/color.js";
import BackButton from "./commonComponents/BackButton.js";
import GOHLoader from "./commonComponents/GOHLoader.js";
import ErrorScreen from "./commonComponents/NoInternet";
import PaytringView from "./commonComponents/PaytringView.js";
import About from "./components/About";
import AdditionalDetails from "./components/AdditionalDetails/AdditionalDetails.js";
import Language from "./components/ChangeLanguage/Language.js";
import FestiveWish from "./components/Festivals/FestiveWish.js";
import Header from "./components/HeaderComponent.js";
import BottomNavigator from "./components/navigators/BottomNavigator";
import PaymentFailed from "./components/PaymentPages/PaymentFailed.js";
import PaymentProcessing from "./components/PaymentPages/PaymentProcessing.js";
import PaymentSuccessful from "./components/PaymentPages/PaymentSuccessful.js";
import EditProfile from "./components/Profile/EditProfile.js";
import Profile from "./components/Profile/Profile.js";
import Quotes from "./components/Quotes/Quotes.js";
import Reels from "./components/Reels/Reels.js";
import VoucherDetails from "./components/Rewards/VoucherDetails.js";
import VoucherScratch from "./components/Rewards/VoucherScratch.js";
import * as configData from "./config/cloud/config.json";
import { WhatsNewMessage } from "./config/CONSTANTS";
import axios from "./config/CustomAxios.js";
import { setMembership, setProfile } from "./redux/actions/counts.js";
import AllTransactions from "./screens/AllTransactions/AllTransactions.js";
import HomeDetailsScreen from "./screens/homeScreen/HomeDetailsScreen";
import LoginScreen from "./screens/loginScreen/LoginScreen";
import MembershipDetails from "./screens/MembershipDetails/MembershipDetails.js";
import MembershipScreen from "./screens/myProfileScreen/MembershipScreen";
import MySessionsScreen from "./screens/mySessionsScreen/MySessionsScreen";
import RewardsScreen from "./screens/RewardsScreen/RewardsScreen.js";
import SubscriptionScreen from "./screens/subscriptionScreen/SubscriptionScreen.js";
import TripDetailsScreen from "./screens/Trips/TripDetailsScreen";
import TripsScreen from "./screens/Trips/TripsScreen";
import TopUpScreen from "./screens/WalletScreens/TopUpScreen.js";
import WalletScreen from "./screens/WalletScreens/WalletScreen.js";

const navigationRef = createNavigationContainerRef();

globalThis.axios = axios;
globalThis.AsyncStorage = AsyncStorage;
globalThis.SERVER_URL = configData.BACKEND.SERVER_URL;
globalThis.crashlytics = crashlytics;
globalThis.Icon = Icon;
globalThis.FastImage = FastImage;

Icon.loadFont();

const Stack = createNativeStackNavigator();

let pendingNavigation = null;

export const handleNotification = (notification) => {
  if (notification?.data?.screen) {
    if (navigationRef.isReady()) {
      navigationRef.navigate("QuotesPage", notification.data?.params || {});
    } else {
      pendingNavigation = notification;
    }
  }
};

navigationRef.addListener("state", () => {
  if (navigationRef.isReady() && pendingNavigation) {
    const { params } = pendingNavigation.data;
    navigationRef.navigate("QuotesPage", params || {});
    pendingNavigation = null;
  }
});

PushNotification.configure({
  onNotification: function (notification) {
    handleNotification(notification);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});
PushNotification.createChannel(
  {
    channelId: "Quote",
    channelName: "Quote channel",
    channelDescription: "Categorise Quote notifications",
    playSound: true,
    soundName: "default",
    importance: 4,
    vibrate: true,
  },
  (created) => crashlytics().log(`createChannel returned '${created}'`),
);
PushNotification.createChannel(
  {
    channelId: "Water Reminders",
    channelName: "Water Reminders Channel",
    channelDescription: "Categorise Water reminder notifications",
    playSound: true,
    soundName: "default",
    importance: 4,
    vibrate: true,
  },
  (created) => crashlytics().log(`createChannel returned '${created}'`),
);
PushNotification.createChannel(
  {
    channelId: "Medicine Reminders",
    channelName: "Medicine Reminders Channel",
    channelDescription: "Categorise medicine reminder notifications",
    playSound: true,
    soundName: "default",
    importance: 4,
    vibrate: true,
  },
  (created) => crashlytics().log(`createChannel returned '${created}'`),
);

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
  requestNotificationPermission();
  try {
    Updates.setLogLevel(Updates.LogLevel.DEBUG);
  } catch (error) {
    console.log(error);
  }
  // const navigationRef = React.createRef();
  // set up parameters for what's new function
  var [justUpdated, setJustUpdated] = useState(false);
  const [notify, setNotify] = useState(null);
  const [showWhatsNewMessage, setShowWhatsNewMessage] = useState(false);
  const width = Dimensions.get("window").width;

  const [isConnected, setIsConnected] = useState(true);
  const [token, setToken] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();

  const { copilotEvents } = useCopilot();

  const checkForUpdates = async () => {
    try {
      console.log("Checking for updates...");
      const update = await Updates.checkForUpdateAsync();
      console.log("Update check result:", update);

      if (update.isAvailable) {
        console.log("Fetching update...");
        await Updates.fetchUpdateAsync();
        console.log("Update fetched. Reloading...");
        await Updates.reloadAsync(); // This reloads the app with the new update
      } else {
        console.log("No update available.");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  };
  useEffect(() => {
    // logic to revoke user's membership if his membershipEndDate has arrived
    const currentDate = new Date().getTime();
    const membershipEndDate = membership?.membershipEndDate;

    if (membershipEndDate && currentDate > membershipEndDate) {
      const url = `${globalThis.SERVER_URL}/membership/expire?phoneNumber=${profile.phoneNumber}`;
      axios
        .get(url)
        .then((res) => {
          if (res.data) {
            setNewMembership({
              membershipType: res.data.membershipType,
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
    age,
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
    checkForUpdates();
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
          const emergencyContact =
            await AsyncStorage.getItem("emergencyContact");
          const city = await AsyncStorage.getItem("city");
          const profileImage = await AsyncStorage.getItem("profileImage");
          const sessionsAttended =
            await AsyncStorage.getItem("sessionsAttended");
          const dateOfJoining = await AsyncStorage.getItem("dateOfJoining");
          const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
          const age = await AsyncStorage.getItem("age");

          // now retrieve membership specific data
          const membershipType = await AsyncStorage.getItem("membershipType");
          const id = await AsyncStorage.getItem("membershipId");
          const membershipStartDate = await AsyncStorage.getItem(
            "membershipStartDate",
          );
          const membershipEndDate =
            await AsyncStorage.getItem("membershipEndDate");
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
            age,
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
      const response = await axios.get(globalThis.SERVER_URL);
      if (response.status == 200) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      crashlytics().log(`Error in recheck App.js`, error);
      setIsConnected(false);
    }
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
        "Contribution Details": "contribute",
        "About GoHappy Club": "about",
        Trips: "trips",
        TripDetails: "trip_details",
        PastSessions: "past_sessions",
        ReelsPage: "videos",
        QuotesPage: "quotes",
      },
    },
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
            setShowWhatsNewMessage(false);
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
                    options={{
                      headerLeft: () => <View />,
                      headerShown: false,
                    }}
                  >
                    {(props) => (
                      <LoginScreen {...props} propProfile={profile} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="GoHappy Club"
                    options={{
                      header: (props) => <Header {...props} />,
                      elevation: 0,
                      shadowOpacity: 0,
                      headerShadowVisible: true,
                    }}
                  >
                    {(props) => (
                      <BottomNavigator {...props} propProfile={profile} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="Session Details"
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      // headerBackground: Colors.background,
                      headerLeft: () => (
                        <BackButton styles={styles} navigation={navigation} />
                      ),
                      // headerShadowVisible: true,
                    })}
                  >
                    {(props) => (
                      <HomeDetailsScreen
                        {...props}
                        propProfile={profile}
                        copilotEvents={copilotEvents}
                      />
                    )}
                  </Stack.Screen>
                  {Platform.OS == "android" && (
                    <Stack.Screen
                      name="Contribution Details"
                      options={({ navigation }) => ({
                        headerTransparent: true,
                        title: null,
                        headerBackTitle: "back",
                        headerLeft: () => (
                          <BackButton styles={styles} navigation={navigation} />
                        ),
                        headerShadowVisible: false,
                      })}
                    >
                      {(props) => (
                        <MembershipScreen {...props} propProfile={profile} />
                      )}
                    </Stack.Screen>
                  )}
                  <Stack.Screen
                    name="Additional Details"
                    options={{
                      headerLeft: () => <View />,
                      headerTransparent: true,
                      title: null,
                      headerShadowVisible: false,
                    }}
                  >
                    {(props) => (
                      <AdditionalDetails {...props} propProfile={profile} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="About GoHappy Club"
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          navigateTo={"MyProfile"}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {(props) => <About {...props} propProfile={profile} />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="PastSessions"
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          navigateTo={"MyProfile"}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {(props) => (
                      <MySessionsScreen {...props} propProfile={profile} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="Trips"
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          navigateTo={"OverviewScreen"}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {(props) => (
                      <TripsScreen {...props} propProfile={profile} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="TripDetails"
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <BackButton styles={styles} navigation={navigation} />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {(props) => (
                      <TripDetailsScreen {...props} propProfile={profile} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="MyProfile"
                    options={() => ({
                      headerShown: false,
                    })}
                  >
                    {(props) => <Profile {...props} propProfile={profile} />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="EditProfile"
                    options={() => ({
                      headerShown: false,
                    })}
                  >
                    {(props) => (
                      <EditProfile {...props} propProfile={profile} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="SubscriptionPlans"
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <BackButton styles={styles} navigation={navigation} />
                      ),
                      headerShadowVisible: false,
                      animation: "fade_from_bottom",
                    })}
                  >
                    {() => <SubscriptionScreen />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="WalletScreen"
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerLeft: () => (
                        <BackButton styles={styles} navigation={navigation} />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {() => <WalletScreen />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="TopUpScreen"
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerTransparent: true,
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          back={true}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {() => <TopUpScreen />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="PaymentProcessing"
                    options={() => ({
                      headerShown: false,
                      animation: "slide_from_right",
                      gestureEnabled: false,
                    })}
                  >
                    {() => <PaymentProcessing />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="PaymentFailed"
                    options={() => ({
                      headerShown: false,
                      animation: "slide_from_right",
                      gestureEnabled: false,
                    })}
                  >
                    {() => <PaymentFailed />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="PaymentSuccessful"
                    options={() => ({
                      headerShown: false,
                      animation: "slide_from_right",
                      gestureEnabled: false,
                    })}
                  >
                    {() => <PaymentSuccessful />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="AllTransactions"
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerStyle: {
                        backgroundColor: Colors.background,
                      },
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          back={true}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {() => <AllTransactions />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="Rewards"
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerTransparent: true,
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          back={true}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {() => <RewardsScreen />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="VoucherDetails"
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerTransparent: true,
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          back={true}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  >
                    {() => <VoucherDetails />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="VoucherScratch"
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerTransparent: true,
                      headerRight: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.goBack()}
                          underlayColor={Colors.white}
                        >
                          <X color="#000" size={24} />
                        </TouchableOpacity>
                      ),
                      headerLeft: () => <View />,
                      headerShadowVisible: false,
                      presentation: "transparentModal",
                      animation: "fade",
                    })}
                  >
                    {() => <VoucherScratch />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="FestiveWish"
                    options={({ navigation }) => ({
                      title: null,
                      headerTransparent: true,
                      headerRight: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.goBack()}
                          underlayColor={Colors.white}
                        >
                          <X color="#000" size={24} />
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                      presentation: "transparentModal",
                      animation: "fade",
                      headerLeft: () => <View />,
                    })}
                  >
                    {() => <FestiveWish />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="QuotesPage"
                    options={({ navigation }) => ({
                      title: null,
                      headerTransparent: true,
                      headerRight: () => (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => navigation.goBack()}
                          underlayColor={Colors.white}
                        >
                          <X color="#000" size={24} />
                        </TouchableOpacity>
                      ),
                      headerShadowVisible: false,
                      animation: "fade",
                      headerLeft: () => <View />,
                    })}
                  >
                    {() => <Quotes />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="ReelsPage"
                    options={() => ({
                      title: null,
                      headerTransparent: true,
                      headerShown: false,
                      headerShadowVisible: false,
                      animation: "slide_from_right",
                    })}
                  >
                    {() => <Reels />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="Languages"
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerStyle: {
                        backgroundColor: Colors.background,
                      },
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          back={true}
                        />
                      ),
                      headerShadowVisible: false,
                      animation: "ios_from_right",
                    })}
                  >
                    {() => <Language />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="MembershipDetails"
                    options={({ navigation }) => ({
                      title: null,
                      headerBackTitle: "back",
                      headerStyle: {
                        backgroundColor: Colors.background,
                      },
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          back={true}
                        />
                      ),
                      headerShadowVisible: false,
                      animation: "ios_from_right",
                    })}
                  >
                    {() => <MembershipDetails />}
                  </Stack.Screen>
                  <Stack.Screen
                    name="PaytringView"
                    options={() => ({
                      title: null,
                      headerTransparent: true,
                      headerShadowVisible: false,
                      animation: "slide_from_bottom",
                      headerBackVisible: false,
                      gestureEnabled: false,
                      headerShown: false,
                    })}
                  >
                    {() => <PaytringView />}
                  </Stack.Screen>
                </>
              </Stack.Navigator>
            </NavigationContainer>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      ) : (
        <View
          style={{
            backgroundColor: Colors.background,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.background,
            }}
          >
            <GOHLoader />
          </View>
        </View>
      )}
      {isConnected == false && <ErrorScreen recheck={recheck} />}
      <Toast />
      {notify && (
        <AwesomeAlert
          confirmButtonStyle={{
            backgroundColor: Colors.primary,
            color: Colors.primaryText,
            borderRadius: 5,
          }}
          contentStyle={{
            padding: 0,
            margin: 0,
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
                margin: 0,
                padding: 0,
                shadowColor: Colors.grey.c,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                borderWidth: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 16,
                  color: Colors.black,
                  lineHeight: 24,
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
