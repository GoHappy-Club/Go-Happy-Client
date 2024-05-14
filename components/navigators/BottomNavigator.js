import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../../screens/homeScreen/HomeScreen";
import MySessionsScreen from "../../screens/mySessionsScreen/MySessionsScreen";
import MyProfileScreen from "../../screens/myProfileScreen/MyProfileScreen";
import ReferScreen from "../../screens/ReferScreen/ReferScreen";
import React, { Component } from "react";
import {
  faChild,
  faClipboardList,
  faHandshake,
  faHistory,
  faHome,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MembershipScreen from "../../screens/myProfileScreen/MembershipScreen";
import { useSelector } from "react-redux";
import OverviewScreen from "../../screens/overview/OverviewScreen";

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const profile = useSelector((state) => state.profile);
  // alert(JSON.stringify(profile));
  return (
    <Tab.Navigator
      initialRouteName="OverviewScreen"
      barStyle={{
        shadowOffset: {
          width: 0,
          height: 100,
        },
        shadowOpacity: 100,
        shadowRadius: 100.0,
        elevation: 64,
        borderTopLeftRadius: 21,
        borderTopRightRadius: 21,
        backgroundColor: "#fff",
        padding: 10,
        zIndex: 10000,
      }}
      shifting={false}
    >
      <Tab.Screen
        name="OverviewScreen"
        children={(props) => (
          <OverviewScreen propProfile={profile} {...props} />
        )}
        options={{
          tabBarLabel: "Home",
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} color={"#2f2f31"} size={25} />
          ),
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        }}
      />
      <Tab.Screen
        name="HomeScreen"
        // component={HomeScreen}
        // children={(props) => (
        //   <MySessionsScreen propProfile={profile} {...props} />
        //
        children={(props) => <HomeScreen propProfile={profile} {...props} />}
        options={{
          tabBarLabel: "Sessions",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faClipboardList}
              color={"#2f2f31"}
              size={25}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="MySessions"
        children={(props) => (
          <MySessionsScreen propProfile={profile} {...props} />
        )}
        options={{
          tabBarLabel: "Sessions",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon
              icon={faClipboardList}
              color={"#2f2f31"}
              size={25}
            />
          ),
        }}
      /> */}
      {/* <Tab.Screen name="ReferScreen" component={ReferScreen}
      options={{
        tabBarLabel: 'Refer & Earn',
        tabBarIcon: ({ color }) => (
          <FontAwesomeIcon icon={ faProjectDiagram } color={ '#2f2f31' } size={25} />
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
            <FontAwesomeIcon icon={faHandshake} color={"#2f2f31"} size={25} />
          ),
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        }}
      />
      <Tab.Screen
        name="Refer"
        children={(props) => <ReferScreen propProfile={profile} {...props} />}
        options={{
          tabBarLabel: "Refer",
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faTrophy} color={"#2f2f31"} size={25} />
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
            <FontAwesomeIcon icon={faChild} color={"#2f2f31"} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
