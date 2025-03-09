import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";
import { useCopilot } from "react-native-copilot";
import { useSelector } from "react-redux";

import { Colors } from "../../assets/colors/color";
import HomeScreen from "../../screens/homeScreen/HomeScreen";
import OverviewScreen from "../../screens/overview/OverviewScreen";
import ReferScreen from "../../screens/ReferScreen/ReferScreen";
import TripsScreen from "../../screens/Trips/TripsScreen";

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  const profile = useSelector((state) => state.profile);
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
        options={{
          tabBarLabel: t("home"),
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ focused }) => (
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
      >
        {(props) => (
          <OverviewScreen propProfile={profile} {...props} start={start} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="HomeScreen"
        options={{
          tabBarLabel: t("sessions"),
          tabBarIcon: ({ focused }) => (
            <>
              {!focused && (
                <FontAwesome6
                  name="calendar"
                  size={24}
                  color={Colors.grey.grey}
                />
              )}
              {focused && (
                <FontAwesome6 name="calendar-day" size={24} color="black" />
              )}
            </>
          ),
        }}
      >
        {(props) => <HomeScreen propProfile={profile} {...props} />}
      </Tab.Screen>
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
        options={{
          tabBarLabel: t("trips"),
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0,
          tabBarIcon: ({ focused }) => (
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
      >
        {(props) => <TripsScreen {...props} propProfile={profile} />}
      </Tab.Screen>
      {profile.profile.age == null || profile.profile.age >= 50 ? (
        <Tab.Screen
          name="Refer"
          options={{
            tabBarLabel: t("refer"),
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0,
            tabBarIcon: ({ focused }) => (
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
        >
          {(props) => <ReferScreen propProfile={profile} {...props} />}
        </Tab.Screen>
      ) : null}
    </Tab.Navigator>
  );
}
