import "./i18n.js";
import React, { useEffect, useState } from "react";
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
} from "react-native";
import * as Updates from "expo-updates";
import FastImage from "react-native-fast-image";
import { setProfile, setMembership } from "./redux/actions/counts.js";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/loginScreen/LoginScreen";
import BottomNavigator from "./components/navigators/BottomNavigator";
import HomeDetailsScreen from "./screens/homeScreen/HomeDetailsScreen";
import MembershipScreen from "./screens/myProfileScreen/MembershipScreen";
import About from "./components/About";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as configData from "./config/local_android/config.json";
import Icon from "react-native-vector-icons/Ionicons";
import DeviceInfo from "react-native-device-info";
import firebase from "@react-native-firebase/app";
import { useSelector, useDispatch } from "react-redux";
import ErrorScreen from "./commonComponents/NoInternet";
import { WhatsNewMessage } from "./config/CONSTANTS";
import AwesomeAlert from "react-native-awesome-alerts";
import RenderHtml from "react-native-render-html";
import crashlytics from "@react-native-firebase/crashlytics";
import messaging from "@react-native-firebase/messaging";
import TripsScreen from "./screens/Trips/TripsScreen";
import TripDetailsScreen from "./screens/Trips/TripDetailsScreen";
import MySessionsScreen from "./screens/mySessionsScreen/MySessionsScreen";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { useCopilot } from "react-native-copilot";
import axios from "./config/CustomAxios.js";
import { Colors } from "./assets/colors/color.js";
import Header from "./components/HeaderComponent.js";
import SubscriptionScreen from "./screens/subscriptionScreen/SubscriptionScreen.js";
import { X } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import WalletScreen from "./screens/WalletScreens/WalletScreen.js";
import TopUpScreen from "./screens/WalletScreens/TopUpScreen.js";
import PaymentFailed from "./components/PaymentPages/PaymentFailed.js";
import PaymentSuccessful from "./components/PaymentPages/PaymentSuccessful.js";
import AllTransactions from "./screens/AllTransactions/AllTransactions.js";
import RewardsScreen from "./screens/RewardsScreen/RewardsScreen.js";
import VoucherDetails from "./components/Rewards/VoucherDetails.js";
import VoucherScratch from "./components/Rewards/VoucherScratch.js";
import FestiveWish from "./components/Festivals/FestiveWish.js";
import Profile from "./components/Profile/Profile.js";
import EditProfile from "./components/Profile/EditProfile.js";
import GOHLoader from "./commonComponents/GOHLoader.js";
import AdditionalDetails from "./components/AdditionalDetails/AdditionalDetails.js";
import Quotes from "./components/Quotes/Quotes.js";
import PushNotification from "react-native-push-notification";
import Reels from "./components/Reels/Reels.js";
import Language from "./components/ChangeLanguage/Language.js";
import MembershipDetails from "./screens/MembershipDetails/MembershipDetails.js";
import BackButton from "./commonComponents/BackButton.js";
import PaytringView from "./commonComponents/PaytringView.js";

const navigationRef = createNavigationContainerRef();

global.axios = axios;
global.AsyncStorage = AsyncStorage;
global.SERVER_URL = configData.BACKEND.SERVER_URL;
global.crashlytics = crashlytics;
global.Icon = Icon;
global.FastImage = FastImage;

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
    const { screen, params } = pendingNavigation.data;
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
  (created) => crashlytics().log(`createChannel returned '${created}'`)
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
  (created) => crashlytics().log(`createChannel returned '${created}'`)
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
  (created) => crashlytics().log(`createChannel returned '${created}'`)
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
            "membershipStartDate"
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
      crashlytics().log(`Error in recheck App.js`, error);
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
      crashlytics().log(`Error in checkVersionHelper : ${error}`);
      // throw new Error("Error getting order ID");
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
                      // headerBackground: Colors.background,
                      headerLeft: () => (
                        <BackButton styles={styles} navigation={navigation} />
                      ),
                      // headerShadowVisible: true,
                    })}
                  />
                  <Stack.Screen
                    name="Contribution Details"
                    // component={MembershipScreen}
                    children={(props) => (
                      <MembershipScreen {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <BackButton styles={styles} navigation={navigation} />
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
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          navigateTo={"MyProfile"}
                        />
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
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          navigateTo={"MyProfile"}
                        />
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
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                          navigateTo={"OverviewScreen"}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="TripDetails"
                    children={(props) => (
                      <TripDetailsScreen {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      headerBackTitle: "back",
                      headerLeft: () => (
                        <BackButton
                          styles={styles}
                          navigation={navigation}
                        />
                      ),
                      headerShadowVisible: false,
                    })}
                  />
                  <Stack.Screen
                    name="MyProfile"
                    children={(props) => (
                      <Profile {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerShown: false,
                    })}
                  />
                  <Stack.Screen
                    name="EditProfile"
                    children={(props) => (
                      <EditProfile {...props} propProfile={profile} />
                    )}
                    options={({ navigation }) => ({
                      headerShown: false,
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
                        <BackButton styles={styles} navigation={navigation} />
                      ),
                      headerShadowVisible: false,
                      animation: "fade_from_bottom",
                    })}
                  />
                  <Stack.Screen
                    name="WalletScreen"
                    children={(props) => <WalletScreen />}
                    options={({ navigation }) => ({
                      headerTransparent: true,
                      title: null,
                      // headerBackTitle: "back",
                      headerLeft: () => (
                        <BackButton styles={styles} navigation={navigation} />
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
                  />
                  <Stack.Screen
                    name="Rewards"
                    children={(props) => <RewardsScreen />}
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
                  />
                  <Stack.Screen
                    name="VoucherDetails"
                    children={(props) => <VoucherDetails />}
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
                  />
                  <Stack.Screen
                    name="VoucherScratch"
                    children={(props) => <VoucherScratch />}
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
                  />
                  <Stack.Screen
                    name="FestiveWish"
                    children={(props) => <FestiveWish />}
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
                  />
                  <Stack.Screen
                    name="QuotesPage"
                    children={(props) => <Quotes />}
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
                  />
                  <Stack.Screen
                    name="ReelsPage"
                    children={(props) => <Reels />}
                    options={({ navigation }) => ({
                      title: null,
                      headerTransparent: true,
                      headerShown:false,
                      headerShadowVisible: false,
                      animation: "slide_from_right",
                    })}
                  />
                  <Stack.Screen
                    name="Languages"
                    children={(props) => <Language />}
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
                  />
                  <Stack.Screen
                    name="MembershipDetails"
                    children={(props) => <MembershipDetails />}
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
                  />
                  <Stack.Screen
                    name="PaytringView"
                    children={(props) => <PaytringView />}
                    options={({ navigation }) => ({
                      title: null,
                      headerTransparent: true,
                      headerShadowVisible: false,
                      animation: "slide_from_bottom",
                      headerBackVisible: false,
                    })}
                  />
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
