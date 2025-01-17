import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../assets/colors/color";
import { useTranslation } from "react-i18next";

const BackButton = ({ styles, navigation, back = false, navigateTo = "" }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => {
        if (back) {
          navigation.goBack();
          return;
        }
        navigation.navigate(navigateTo != "" ? navigateTo : "GoHappy Club");
      }}
      underlayColor={Colors.white}
    >
      <Text style={styles.backText}>{t("back")}</Text>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({});
