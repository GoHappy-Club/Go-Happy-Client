import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen/LoginScreen'
import BottomNavigator from './components/navigators/BottomNavigator'
import HomeDetailsScreen from './screens/homeScreen/HomeDetailsScreen'
import MembershipScreen from './screens/myProfileScreen/MembershipScreen'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as configData from "./config/dev/config.json";
import Icon from 'react-native-vector-icons/Ionicons';

global.axios = axios;
global.AsyncStorage = AsyncStorage;
global.SERVER_URL = configData.BACKEND.SERVER_URL;
global.Icon = Icon;
Icon.loadFont();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="GoHappy Club" component={BottomNavigator} />
      <Stack.Screen name="Session Details" component={HomeDetailsScreen} />
      <Stack.Screen name="Membership Details" component={MembershipScreen} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
