import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../../screens/homeScreen/HomeScreen';
import MySessionsScreen from '../../screens/mySessionsScreen/MySessionsScreen';
import MyProfileScreen from '../../screens/myProfileScreen/MyProfileScreen';
import ReferScreen from '../../screens/ReferScreen/ReferScreen';
import React, {Component} from 'react';
import { faHome,faHistory,faChild,faClipboardList,faProjectDiagram,faHandshake} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import MembershipScreen from '../../screens/myProfileScreen/MembershipScreen'

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" barStyle={{backgroundColor:'#38434D'}} shifting={false}
  >
      <Tab.Screen name="Home" component={HomeScreen} 
      options={{
        tabBarLabel: 'Home',
        elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
        tabBarIcon: ({ color }) => (
          <FontAwesomeIcon icon={ faHome } color={ 'white' } size={25} />
        ),
        tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
      }}/>
      <Tab.Screen name="MySessions" component={MySessionsScreen}
      options={{
        tabBarLabel: 'My Sessions',
        tabBarIcon: ({ color }) => (
          <FontAwesomeIcon icon={ faClipboardList } color={ 'white' } size={25} />
       ),
      }} />
      {/* <Tab.Screen name="ReferScreen" component={ReferScreen}
      options={{
        tabBarLabel: 'Refer & Earn',
        tabBarIcon: ({ color }) => (
          <FontAwesomeIcon icon={ faProjectDiagram } color={ 'white' } size={25} />
       ),
      }} /> */}
       <Tab.Screen name="MembershipScreen" component={MembershipScreen} 
      options={{
        tabBarLabel: 'Support Us',
        elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
        tabBarIcon: ({ color }) => (
          <FontAwesomeIcon icon={ faHandshake } color={ 'white' } size={25} />
        ),
        tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
      }}/>
      <Tab.Screen name="Refer" component={ReferScreen}
      options={{
        tabBarLabel: 'Refer and Earn',
        elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
        tabBarIcon: ({ color }) => (
          <FontAwesomeIcon icon={ faChild } color={ 'white' } size={25} />       ),
      }} />
      <Tab.Screen name="MyProfile" component={MyProfileScreen}
      options={{
        tabBarLabel: 'My Profile',
        elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
        tabBarIcon: ({ color }) => (
          <FontAwesomeIcon icon={ faChild } color={ 'white' } size={25} />       ),
      }} />
    </Tab.Navigator>
  );
}