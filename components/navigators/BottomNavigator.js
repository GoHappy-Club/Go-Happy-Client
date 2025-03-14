import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "../../screens/homeScreen/HomeScreen";
import MySessionsScreen from "../../screens/mySessionsScreen/MySessionsScreen";
import MyProfileScreen from "../../screens/myProfileScreen/MyProfileScreen";
import ReferScreen from "../../screens/ReferScreen/ReferScreen";
import React, { Component, useEffect } from "react";
import {
  faCalendar,
  faChild,
  faClipboardList,
  faHandshake,
  faHistory,
  faHome,
  faHouse,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MembershipScreen from "../../screens/myProfileScreen/MembershipScreen";
import { useSelector } from "react-redux";
import OverviewScreen from "../../screens/overview/OverviewScreen";
import { useCopilot } from "react-native-copilot";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../assets/colors/color";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  HandHeart,
  HouseIcon,
  HousePlug,
  Plane,
  Trophy,
} from "lucide-react-native";
import TripsScreen from "../../screens/Trips/TripsScreen";
import { View } from "react-native";
import {
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const profile = useSelector((state) => state.profile);
  const navigation = useNavigation();
  const { start } = useCopilot();
  const { t } = useTranslation();

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
        backgroundColor: Colors.bottomNavigation,
        padding: 10,
        zIndex: 10000,
      }}
      style={{
        backgroundColor: Colors.background,
      }}
      shifting={false}
    >
      <Tab.Screen
        name="OverviewScreen"
        children={(props) => (
          <OverviewScreen propProfile={profile} {...props} start={start} />
        )}
        options={{
          tabBarLabel: t("home"),
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ focused, color }) => (
            <>
              {!focused && (
                <MaterialCommunityIcons
                  name="home-outline"
                  size={28}
                  color={Colors.grey.grey}
                />
              )}
              {focused && <MaterialIcons name="home" size={28} color="black" />}
            </>
          ),
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: Colors.grey.grey,
        }}
      />
      <Tab.Screen
        name="HomeScreen"
        children={(props) => <HomeScreen propProfile={profile} {...props} />}
        options={{
          tabBarLabel: t("sessions"),
          tabBarIcon: ({ focused, color }) => (
            <>
              {!focused && (
                <FontAwesome6
                  name="calendar"
                  size={24}
                  color={Colors.grey.grey}
                />
              )}
              {focused && (
                <FontAwesome6
                  name="calendar-day"
                  size={24}
                  color="black"
                />
              )}
            </>
          ),
        }}
      />
      {/* <Tab.Screen
        name="MembershipScreen"
        children={(props) => (
          <MembershipScreen propProfile={profile} {...props} />
        )}
        options={{
          tabBarLabel: t("contribute"),
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ focused, color }) => (
            <HandHeart
              size={25}
              color={focused ? Colors.black : Colors.grey.grey}
            />
          ),
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: Colors.grey.grey,
        }}
      /> */}
      <Tab.Screen
        name="TripBottom"
        children={(props) => <TripsScreen {...props} propProfile={profile} />}
        options={{
          tabBarLabel: t("trips"),
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ focused, color }) => (
            <>
              {!focused && (
                <Ionicons
                  name="airplane-outline"
                  size={24}
                  color={Colors.grey.grey}
                />
              )}
              {focused && (
                <Ionicons name="airplane" size={24} color={Colors.black} />
              )}
            </>
          ),
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: Colors.grey.grey,
        }}
      />
      {profile.profile.age == null || profile.profile.age >= 50 ? (
        <Tab.Screen
          name="Refer"
          children={(props) => <ReferScreen propProfile={profile} {...props} />}
          options={{
            tabBarLabel: t("refer"),
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0,
            tabBarIcon: ({ focused, color }) => (
              <>
                {!focused && (
                  <Ionicons
                    name="trophy-outline"
                    size={24}
                    color={Colors.grey.grey}
                  />
                )}
                {focused && (
                  <Ionicons name="trophy" size={24} color={Colors.black} />
                )}
              </>
            ),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
}
