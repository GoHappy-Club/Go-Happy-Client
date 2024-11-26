import React, { Component } from "react";

import { Image, ScrollView, View } from "react-native";

import { Text } from "react-native-elements";
import { hp, wp } from "../helpers/common";
import { Colors } from "../assets/colors/color";

export default class About extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#f6f9ff",
          alignItems: "center",
          justifyContent: "center",
        }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            marginTop: "10%",
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
              About Us
            </Text>
            <FastImage
              source={require("../images/about.jpeg")}
              width={300}
              height={300}
              style={{
                width: wp(95),
                height: 300,
                resizeMode: "contain",
              }}
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
            GoHappy Club is an initiative with a vision to make the happiest
            community of senior citizens.
          </Text>
          <Text
            style={{
              fontSize: wp(4),
              width: wp(90),
              marginVertical: 5,
            }}
          >
            Our mission is to make senior citizens productive and engaged in
            their second innings of the lives. We empower them through Live
            Sessions in three different categories:
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
              <Text style={{ fontWeight: "bold" }}>1. Fun:</Text> Tambola,
              Antakshari, Quizzes
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
              <Text style={{ fontWeight: "bold" }}>2. Learning:</Text> Mobile
              Learning, Singing, Health, Art & Craft.
            </Text>
            <Text
              style={{
                fontSize: 18,
                paddingLeft: "5%",
                width: wp(90),
                paddingRight: "5%",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>3. Fitness:</Text> Diet,
              Yoga, Dance, Mental Health and many more to help them find joy and
              happiness in this modern & technological era.
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
              India Ka Sabse Khush Parivar
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
