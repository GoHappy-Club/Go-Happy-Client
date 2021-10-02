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
var token='';




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
          headerTransparent: true,title:null
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
          )})}
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
          )})}/>
          <Stack.Screen name="Additional Details" component={AdditionalDetails} options = {{
            headerLeft: ()=> <View></View>,
            headerTransparent: true,title:null}}/>
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
    borderColor: '#fff'
  },
  backText:{
      color:'#000',
      textAlign:'center',
  }
});
