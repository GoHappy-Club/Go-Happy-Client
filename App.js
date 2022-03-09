import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen/LoginScreen'
import BottomNavigator from './components/navigators/BottomNavigator'
import HomeDetailsScreen from './screens/homeScreen/HomeDetailsScreen'
import MembershipScreen from './screens/myProfileScreen/MembershipScreen'
import AdditionalDetails from './components/AdditionalDetails'
import About from './components/About'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as configData from "./config/cloud-dev/config.json";
import Icon from 'react-native-vector-icons/Ionicons';
import PushNotification from 'react-native-push-notification'

global.axios = axios;
global.AsyncStorage = AsyncStorage;
global.SERVER_URL = configData.BACKEND.SERVER_URL;
global.Icon = Icon;
Icon.loadFont();

const Stack = createNativeStackNavigator();
var token='';


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
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

export default function App() {
  AsyncStorage.getItem("token").then((out)=>{token=out});
  return (
    <NavigationContainer>  
    <Stack.Navigator>
      
      <>
        <Stack.Screen name="Login" component={LoginScreen} options={{
          headerLeft: ()=> <View></View>,
          headerShown: false
        }}/>
        <Stack.Screen name="GoHappy Club" component={BottomNavigator} options={{
          headerLeft: ()=> <View></View>,
          headerTransparent: true,title:null,elevation: 0, 
          shadowOpacity: 0,headerShadowVisible: false,
          // headerStyle: {
          //   backgroundColor: '#f2f2f4'
          // },
        }}/>
        <Stack.Screen name="Session Details" component={HomeDetailsScreen} options = {({ navigation }) => ({
          headerTransparent: true,title:null,headerBackTitle:'back',
          headerLeft: ()=>(
            <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate('GoHappy Club')}
                  underlayColor='#fff'>
                  <Text style={styles.backText}>back</Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        })}
        />
        <Stack.Screen name="Membership Details" component={MembershipScreen} options = {({ navigation }) => ({
          headerTransparent: true,title:null,headerBackTitle:'back',
          headerLeft: ()=>(
            <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate('GoHappy Club')}
                  underlayColor='#fff'>
                  <Text style={styles.backText}>back</Text>
            </TouchableOpacity>
          ),headerShadowVisible: false,})}/>
        <Stack.Screen name="Additional Details" component={AdditionalDetails} options = {{
          headerLeft: ()=> <View></View>,
          headerTransparent: true,title:null,headerShadowVisible: false,}}/>
        <Stack.Screen name="About GoHappy Club" component={About} options = {({ navigation }) => ({
          headerTransparent: true,title:null,headerBackTitle:'back',
          headerLeft: ()=>(
            <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate('GoHappy Club')}
                  underlayColor='#fff'>
                  <Text style={styles.backText}>back</Text>
            </TouchableOpacity>
          ),headerShadowVisible: false,})}/>
        </>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backButton:{
    padding:4,
    backgroundColor:'white',
    borderRadius:4,
    borderWidth: 1,
    borderColor: '#fff',shadowColor: "black",elevation: 10,
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.3,
  },
  backText:{
      color:'#000',
      textAlign:'center',
  }
});
