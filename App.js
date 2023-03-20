import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen/LoginScreen';
import BottomNavigator from './components/navigators/BottomNavigator';
import HomeDetailsScreen from './screens/homeScreen/HomeDetailsScreen';
import MembershipScreen from './screens/myProfileScreen/MembershipScreen';
import AdditionalDetails from './components/AdditionalDetails';
// import NoInternet from "./components/NoInternet";
import About from './components/About';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as configData from './config/cloud-dev/config.json';
import Icon from 'react-native-vector-icons/Ionicons';
import PushNotification from 'react-native-push-notification';
import VersionCheck from 'react-native-version-check';
import firebase from '@react-native-firebase/app';
import { useSelector } from 'react-redux';
import ErrorScreen from './components/NoInternet';
import { WhatsNewMessage } from './config/CONSTANTS';
import AwesomeAlert from 'react-native-awesome-alerts';
import RenderHtml from 'react-native-render-html';
import crashlytics from '@react-native-firebase/crashlytics';

global.axios = axios;
global.AsyncStorage = AsyncStorage;
global.SERVER_URL = configData.BACKEND.SERVER_URL;
global.crashlytics = crashlytics;
global.Icon = Icon;
Icon.loadFont();

const Stack = createNativeStackNavigator();
var token = '';

PushNotification.createChannel(
  {
    channelId: 'events', // (required)
    channelName: 'My channel', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => crashlytics().log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

export default function App() {
  // set up parameters for what's new function
  var [justUpdated, setJustUpdated] = useState(false);
  var [showWhatsNewMessage, setShowWhatsNewMessage] = useState(
    WhatsNewMessage().show
  );
  const width = Dimensions.get('window').width;

  AsyncStorage.getItem('token').then((out) => {
    token = out;
  });
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    recheck();
    checkVersion();
  }, []);
  const profile = useSelector((state) => state.profile);

  const recheck = async () => {
    try {
      const response = await fetch('https://www.google.com/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };
  const checkVersion = async () => {
    try {
      // showing updating content if this is newly update but not newly install
      // it will only show once
      const asyncJustUpdated = await AsyncStorage.getItem(
        '@MyApp:isJustUpdated'
      );
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'Please Update',
          'You will have to update your app to the latest version to continue using.',
          [
            {
              text: 'Update',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          { cancelable: false }
        );
        // after updating, save status
        await AsyncStorage.setItem('@MyApp:isJustUpdated', 'true');
      } else {
        if (asyncJustUpdated == 'true') {
          setJustUpdated(true);
          // after showing message once, reset status
          await AsyncStorage.setItem('@MyApp:isJustUpdated', 'false');
        }
      }
    } catch (error) {
      crashlytics().log(JSON.stringify(error));
    }
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

      {isConnected == true ? (
        <NavigationContainer>
          <Stack.Navigator>
            <>
              <Stack.Screen
                name="Login"
                // component={LoginScreen}
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
                // component={BottomNavigator}

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
                  // headerStyle: {
                  //   backgroundColor: 'white'
                  // },
                }}
              />
              <Stack.Screen
                name="Session Details"
                // component={HomeDetailsScreen}
                children={(props) => (
                  <HomeDetailsScreen {...props} propProfile={profile} />
                )}
                options={({ navigation }) => ({
                  headerTransparent: true,
                  title: null,
                  headerBackTitle: 'back',
                  headerLeft: () => (
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.navigate('GoHappy Club')}
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
                  headerBackTitle: 'back',
                  headerLeft: () => (
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.navigate('GoHappy Club')}
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
                  headerBackTitle: 'back',
                  headerLeft: () => (
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => navigation.navigate('GoHappy Club')}
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
        <ErrorScreen recheck={recheck} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: 'black',
    elevation: 10,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
  },
  backText: {
    color: '#000',
    textAlign: 'center',
  },
});
