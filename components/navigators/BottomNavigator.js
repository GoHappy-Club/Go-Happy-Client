import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../../screens/homeScreen/HomeScreen";
import MySessionsScreen from "../../screens/mySessionsScreen/MySessionsScreen";
import MyProfileScreen from "../../screens/myProfileScreen/MyProfileScreen";
import ReferScreen from "../../screens/ReferScreen/ReferScreen";
import React, { Component } from "react";
import {
  faHome,
  faHistory,
  faChild,
  faClipboardList,
  faTrophy,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MembershipScreen from "../../screens/myProfileScreen/MembershipScreen";
import { useSelector } from "react-redux";

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const profile = useSelector((state) => state.profile);
  // alert(JSON.stringify(profile));
  return (
    <Tab.Navigator
      initialRouteName="Home"
      barStyle={{ backgroundColor: "#38434D" }}
      shifting={false}
    >
      <Tab.Screen
        name="Home"
        // component={HomeScreen}
        children={(props) => <HomeScreen propProfile={profile} {...props} />}
        // children={() => <HomeScreen propProfile={profile} {...props} />}
        options={{
          tabBarLabel: "Home",
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} color={"white"} size={25} />
          ),
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        }}
      />
      <Tab.Screen
        name="MySessions"
        children={(props) => (
          <MySessionsScreen propProfile={profile} {...props} />
        )}
        options={{
          tabBarLabel: "Sessions",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faClipboardList} color={"white"} size={25} />
          ),
        }}
      />
      {/* <Tab.Screen name="ReferScreen" component={ReferScreen}
      options={{
        tabBarLabel: 'Refer & Earn',
        tabBarIcon: ({ color }) => (
          <FontAwesomeIcon icon={ faProjectDiagram } color={ 'white' } size={25} />
       ),
      }} /> */}
      <Tab.Screen
        name="MembershipScreen"
        children={(props) => (
          <MembershipScreen propProfile={profile} {...props} />
        )}
        options={{
          tabBarLabel: "Support",
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHandshake} color={"white"} size={25} />
          ),
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        }}
      />
      <Tab.Screen
        name="Refer"
        children={(props) => <ReferScreen propProfile={profile} {...props} />}
        options={{
          tabBarLabel: "Refer & Win",
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faTrophy} color={"white"} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="MyProfile"
        children={(props) => (
          <MyProfileScreen propProfile={profile} {...props} />
        )}
        options={{
          tabBarLabel: "Profile",
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faChild} color={"white"} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
