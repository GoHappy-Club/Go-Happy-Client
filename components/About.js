import React, { Component } from "react";

import { Image, SafeAreaView, ScrollView, View } from "react-native";

import { Text } from "react-native-elements";
import { hp, wp } from "../helpers/common";
import { Colors } from "../assets/colors/color";
import { useTranslation, withTranslation } from "react-i18next";

class About extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              // marginTop: "3%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: wp(100),
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: wp(3),
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  textAlign: "center",
                  marginBottom: "8%",
                  fontWeight: "bold",
                }}
              >
                {t("about_us")}
              </Text>
              <FastImage
                source={require("../images/about.jpeg")}
                style={{
                  width: wp(95),
                  height: 300,
                }}
                resizeMode="contain"
              />
            </View>
            <Text
              style={{
                fontSize: wp(5),
                fontWeight: "bold",
                color: Colors.pink.aboutText,
                width: wp(90),
              }}
            >
              {t("about_us_text")}
            </Text>
            <Text
              style={{
                fontSize: wp(4),
                width: wp(90),
                marginVertical: 5,
              }}
            >
              {t("about_mission")}
            </Text>
            <View
              style={{
                justifyContent: "center",
                width: wp(100),
                paddingLeft: wp(5),
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  marginBottom: 5,
                  width: wp(90),
                }}
              >
                <Text style={{ fontWeight: "bold" }}>1. {t("fun")}:</Text>{" "}
                {t("fun_text")}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  marginBottom: 5,
                  width: wp(90),
                }}
              >
                <Text style={{ fontWeight: "bold" }}>2. {t("learning")}:</Text>{" "}
                {t("learning_text")}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  paddingLeft: "5%",
                  width: wp(90),
                  paddingRight: "5%",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>3. {t("fitness")}:</Text>{" "}
                {t("fitness_text")}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center", //Centered horizontally
                alignItems: "center", //Centered vertically
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-Light",
                  fontSize: 24,
                  paddingLeft: "5%",
                  paddingRight: "5%",
                  justifyContent: "center",
                  fontWeight: "bold",
                  alignSelf: "center",
                  color: Colors.pink.aboutText,
                }}
              >
                {t("khush_parivar")}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(About);
