import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import MyProfile from "../../components/Profile/Profile";
import { Colors } from "../../assets/colors/color";
import Profile from "../../components/Profile/Profile";

const MyProfileScreen = () => {
  const [loader, setLoader] = useState(false);

  if (loader) {
    return (
      <MaterialIndicator
        color={Colors.white}
        style={{ backgroundColor: Colors.materialIndicatorColor }}
      />
    );
  }

  return <Profile />;
};

export default MyProfileScreen;

const styles = StyleSheet.create({});