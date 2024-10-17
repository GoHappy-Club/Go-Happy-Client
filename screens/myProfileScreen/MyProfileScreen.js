import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import MyProfile from "../../components/Profile";
import { Colors } from "../../assets/colors/color";

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

  return <MyProfile />;
};

export default MyProfileScreen;

const styles = StyleSheet.create({});