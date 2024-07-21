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
  Image,
} from "react-native";
import Video from "react-native-video";
import { setProfile } from "./redux/actions/counts.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/loginScreen/LoginScreen";
import BottomNavigator from "./components/navigators/BottomNavigator";
import HomeDetailsScreen from "./screens/homeScreen/HomeDetailsScreen";
import MembershipScreen from "./screens/myProfileScreen/MembershipScreen";
import AdditionalDetails from "./components/AdditionalDetails";
// import NoInternet from "./components/NoInternet";
import About from "./components/About";
// //import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as configData from "./config/cloud-dev/config.json";
import Icon from "react-native-vector-icons/Ionicons";
import PushNotification from "react-native-push-notification";
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
import axios from "./config/CustomAxios.js";

global.axios = axios;
global.AsyncStorage = AsyncStorage;
global.SERVER_URL = configData.BACKEND.SERVER_URL;
global.crashlytics = crashlytics;
global.Icon = Icon;
Icon.loadFont();

const Stack = createNativeStackNavigator();

PushNotification.createChannel(
  {
    channelId: "events", // (required)
    channelName: "My channel", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => crashlytics().log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
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
      style={{ borderLeftColor: "pink" }}
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
  const profile = useSelector((state) => state.profile.profile); // Replace 'data' with your actual state slice name
  const dispatch = useDispatch();

  const setNewProfile = (
    name,
    email,
    phoneNumber,
    profileImage,
    token,
    plan,
    sessionsAttended,
    // dob,
    dateOfJoining,
    selfInviteCode,
    city,
    emergencyContact
  ) => {
    const new_profile = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      profileImage: profileImage,
      token: token,
      membership: plan,
      sessionsAttended: sessionsAttended,
      // dob: dob,
      dateOfJoining: dateOfJoining,
      selfInviteCode: selfInviteCode,
      city: city,
      emergencyContact: emergencyContact,
    };
    dispatch(setProfile(new_profile));
  };
  useEffect(() => {
    recheck();
    checkVersion();
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
          const membership = await AsyncStorage.getItem("membership");
          const sessionsAttended = await AsyncStorage.getItem(
            "sessionsAttended"
          );
          const dateOfJoining = await AsyncStorage.getItem("dateOfJoining");
          const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
          setNewProfile(
            name,
            email,
            phoneNumber,
            profileImage,
            token_temp,
            membership,
            sessionsAttended,
            dateOfJoining,
            selfInviteCode,
            city,
            emergencyContact
          );
        }
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };
    setToken(true);
    fetchData();
    firebase.messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("onNotificationOpened ", remoteMessage);
      if (remoteMessage == null) {
        return;
      }
      try {
        const incomingDeepLink = remoteMessage.data.deepLink;
        const priority = remoteMessage.data.priority;
        if (priority && priority == "HIGH") {
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
          const incomingDeepLink = remoteMessage.data.deepLink;
          const priority = remoteMessage.data.priority;
          if (priority && priority == "HIGH") {
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
        const incomingDeepLink = remoteMessage.data.deepLink;
        const priority = remoteMessage.data.priority;
        console.log("bla", remoteMessage);
        if (priority && priority == "HIGH") {
          setNotify(remoteMessage);
        } else {
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

  const recheck = async () => {
    try {
      const response = await axios.get(SERVER_URL);
      if (response.status==200) {
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
          confirmButtonColor="deepskyblue"
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
          confirmButtonColor="#29BFC2"
          onConfirmPressed={() => {
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.gohappyclient"
            );
            // setShowWhatsNewMessage((showWhatsNewMessage = false));
          }}
        />
      )}

      {isConnected == true && token != false ? (
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
                name="Intro"
                children={(props) => <Intro {...props} />}
                options={{
                  headerLeft: () => <View />,
                  headerTransparent: true,
                  title: null,
                  elevation: 0,
                  shadowOpacity: 0,
                  headerShadowVisible: false,
                  // headerStyle: {
                  //   backgroundColor: 'white'
                  // },
                }}
              />
              <Stack.Screen
                name="GoHappy Club"
                children={(props) => (
                  <BottomNavigator {...props} propProfile={profile} />
                )}
                options={{
                  headerLeft: () => <View />,
                  headerTransparent: true,
                  title: null,
                  elevation: 0,
                  shadowOpacity: 0,
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="Session Details"
                children={(props) => (
                  <HomeDetailsScreen {...props} propProfile={profile} />
                )}
                options={({ navigation }) => ({
                  headerTransparent: true,
                  title: null,
                  headerBackTitle: "back",
                  headerLeft: () => (
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.navigate("GoHappy Club")}
                      underlayColor="#fff"
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
                      underlayColor="#fff"
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
                children={(props) => <About {...props} propProfile={profile} />}
                options={({ navigation }) => ({
                  headerTransparent: true,
                  title: null,
                  headerBackTitle: "back",
                  headerLeft: () => (
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.navigate("GoHappy Club")}
                      underlayColor="#fff"
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
                      onPress={() => navigation.navigate("GoHappy Club")}
                      underlayColor="#fff"
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
                      underlayColor="#fff"
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
                      underlayColor="#fff"
                    >
                      <Text style={styles.backText}>back</Text>
                    </TouchableOpacity>
                  ),
                  headerShadowVisible: false,
                })}
              />
            </>
          </Stack.Navigator>
        </NavigationContainer>
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
            backgroundColor: "#29BFC2",
            color: "white",
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
                shadowColor: "#ccc",
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
                  color: "black",
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
          confirmButtonColor="#29BFC2"
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
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "black",
    elevation: 10,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
  },
  backText: {
    color: "#000",
    textAlign: "center",
  },
});
