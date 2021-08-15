import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../../screens/homeScreen/HomeScreen';
import MySessionsScreen from '../../screens/mySessionsScreen/MySessionsScreen';
import MyProfileScreen from '../../screens/myProfileScreen/MyProfileScreen';

import React, {Component} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home"
  >
      <Tab.Screen name="Home" component={HomeScreen} 
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }}/>
      <Tab.Screen name="MySessions" component={MySessionsScreen}
      options={{
        tabBarLabel: 'My Sessions',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bell" color={color} size={26} />
        ),
      }} />
      <Tab.Screen name="MyProfile" component={MyProfileScreen}
      options={{
        tabBarLabel: 'My Profile',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bell" color={color} size={26} />
        ),
      }} />
    </Tab.Navigator>
  );
}