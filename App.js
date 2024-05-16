import React, { useEffect, useState, useRef } from "react";
// import NetInfo from "@react-native-community/network-info";
import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  // NetInfo,
} from "react-native";
import Video from "react-native-video";
import { setProfile } from "./redux/actions/counts.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/loginScreen/LoginScreen";
import BottomNavigator from "./components/navigators/BottomNavigator";
import HomeDetailsScreen from "./screens/homeScreen/HomeDetailsScreen";
import HomeScreen from "./screens/homeScreen/HomeScreen";
import MembershipScreen from "./screens/myProfileScreen/MembershipScreen";
import AdditionalDetails from "./components/AdditionalDetails";
// import NoInternet from "./components/NoInternet";
import About from "./components/About";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as configData from "./config/cloud-dev/config.json";
import Icon from "react-native-vector-icons/Ionicons";
import PushNotification from "react-native-push-notification";
import DeviceInfo from 'react-native-device-info';
import firebase from "@react-native-firebase/app";
import { useSelector, useDispatch } from "react-redux";
import ErrorScreen from "./components/NoInternet";
import { WhatsNewMessage } from "./config/CONSTANTS";
import AwesomeAlert from "react-native-awesome-alerts";
import RenderHtml from "react-native-render-html";
import crashlytics from "@react-native-firebase/crashlytics";
import TripsScreen from "./screens/Trips/TripsScreen";
import TripDetailsScreen from "./screens/Trips/TripDetailsScreen";
import MySessionsScreen from "./screens/mySessionsScreen/MySessionsScreen";
import Intro from "./screens/loginScreen/Intro";

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
    playSound: false, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => crashlytics().log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

export default function App() {
  // set up parameters for what's new function
  var [justUpdated, setJustUpdated] = useState(false);
  var [productionAppVersion,setProductionAppVersion] = useState("")
  const [showWhatsNewMessage, setShowWhatsNewMessage] = useState(
    WhatsNewMessage().show
  );
  const [updateRequired,setUpdateRequired] = useState(false)
  const width = Dimensions.get("window").width;

  // AsyncStorage.getItem("token").then((out) => {
  //   token = out;
  // });
  const [isConnected, setIsConnected] = useState(true);
  const [token, setToken] = useState(false)
  const profile = useSelector(state => state.profile.profile); // Replace 'data' with your actual state slice name
  const dispatch = useDispatch();

  const setNewProfile = 
    (name,
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
    emergencyContact) =>
   {
    
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
  }
  useEffect(() => {
    recheck();
    checkVersion();
    const fetchData = async () => {
      try {
        // Retrieve data from AsyncStorage
        const token_temp = await AsyncStorage.getItem("token");
        if(token_temp)
          setToken(true)
        else
          setToken(null)
        if(profile==""){
          const phoneNumber = await AsyncStorage.getItem("phoneNumber")
          const name = await AsyncStorage.getItem("name")
          const email = await AsyncStorage.getItem("email")
          const emergencyContact = await AsyncStorage.getItem("emergencyContact")
          const city = await AsyncStorage.getItem("city")
          const profileImage = await AsyncStorage.getItem("profileImage")
          const membership = await AsyncStorage.getItem("membership")
          const sessionsAttended = await AsyncStorage.getItem("sessionsAttended")
          const dateOfJoining = await AsyncStorage.getItem("dateOfJoining")
          const selfInviteCode = await AsyncStorage.getItem("selfInviteCode")
          console.log(name,
            email,
            phoneNumber,
            // profileImage,
            token_temp,
            membership,
            sessionsAttended,
            dateOfJoining,
            selfInviteCode,
            city,
            emergencyContact)
            setNewProfile(name,
                      email,
                      phoneNumber,
                      profileImage,
                      token_temp,
                      membership,
                      sessionsAttended,
                      dateOfJoining,
                      selfInviteCode,
                      city,
                      emergencyContact,
                    )
        }
        
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };
    fetchData(); 
  }, []);
  
  
  const recheck = async () => {
    try {
      const response = await fetch("https://go-happy-322816.nw.r.appspot.com");
      // //console.log("this is response", JSON.stringify(response)); 
      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      setIsConnected(false);
    }
  };

  const checkVersionHelper = async () => {
    const appVersion = DeviceInfo.getBuildNumber();
    var url = SERVER_URL + "/properties/list";
    try {
      const response = await axios.get(url);
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0 ) {
          setProductionAppVersion(properties[0].appVersion)
          //console.log('fsd',properties[0].appVersion,'fsdfs',appVersion)
          if(properties[0].appVersion>appVersion){
            return true
          }
          else{
            return false
          }
        }
      }
    } catch (error) {
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }


  const checkVersion = async () => {
    var needUpdate = await checkVersionHelper()
    // //console.log('update12',needUpdate)
    setUpdateRequired(needUpdate)
  };


  const linking = {
    prefixes: ['https://www.gohappyclub.in'],
    config: {
      screens: {
        'GoHappy Club': {
          screens:{
            'HomeScreen':'free_sessions',
            'Refer':'refer',
            'MyProfile':'profile'
          }
        },
        'Session Details': 'session_details/:deepId',
        'Membership Details': 'contribute',
        'About GoHappy Club': 'about',
        'Trips': 'trips',
        'TripDetails': 'trip_details',
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
              <RenderHtml source={{ html: 'To continue using the app, please install the latest version available. <br/><br/>This update ensures you have access to the newest features and improvements. Thank you for staying up to date!' }} />
            </View>
          }
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Update Now"
          confirmButtonColor="#29BFC2"
          onConfirmPressed={() => {
            Linking.openURL("https://play.google.com/store/apps/details?id=com.gohappyclient");
            // setShowWhatsNewMessage((showWhatsNewMessage = false));
          }}
        />
      )}

      {isConnected == true && token!=false ? (
        <NavigationContainer linking={token==true && linking}>
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
      ):(
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
        )
      }
      {isConnected==false && (
        <ErrorScreen recheck={recheck} />
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
