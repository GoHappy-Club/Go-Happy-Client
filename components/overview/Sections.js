import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Linking } from "react-native";
//import axios from "axios";

export default function Sections(props) {
  const [whatsappLink, setWhatsappLink] = useState("");
  const data1 = [
    {
      title: "Free Sessions",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/session_section_pills.png",
      link: "HomeScreen",
    },
    {
      title: "Contribute",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/contribute_section_pill.jpeg",
      link: "MembershipScreen",
    },
    {
      title: "Trips",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/trips_section_pill.png",
      link: "Trips",
    },
    {
      title: "Get Help",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/help_sections_pill.png",
      link: props.helpUrl,
      type: "external",
    },
  ];

  const data2 = [];

  useEffect(() => {
    async function handleHelp() {
      const url = `${SERVER_URL}/properties/list`;
      try {
        const response = await axios.get(url);
        if (response.data) {
          const properties = response.data.properties;
          if (properties && properties.length > 0) {
            setWhatsappLink(properties[0].whatsappLink);
          }
        }
      } catch (error) {
        // Handle the error
      }
    }

    handleHelp();
  }, []);
  return (
    <View style={styles.mainContainer}>
      {/* <Button title="Start tutorial" onPress={() => start()} /> */}
      <View style={styles.headingContainer}>
        <View style={styles.line} />
        <Text style={styles.headingText}>Explore</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.sectionsContainer}>
        {data1.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (item.type && item.type === "external") {
                  Linking.openURL(whatsappLink);
                } else {
                  props.navigation.navigate(item.link);
                }
              }}
              key={item.title}
            >
              <View style={styles.container}>
                <Image
                  source={{ uri: item.imgUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />

                <Text style={styles.text}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {data2.length > 0 && (
        <View style={{ ...styles.sectionsContainer, marginTop: "3%" }}>
          {data2.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.type && item.type === "external") {
                    Linking.openURL(whatsappLink);
                  } else {
                    props.navigation.navigate(item.link);
                  }
                }}
                key={item.title}
              >
                <View style={styles.container}>
                  <Image source={{ uri: item.imgUrl }} style={styles.image} />
                  <Text style={styles.text}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 0,
  },
  scrollContainer: {},
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: "5%",
    marginBottom: "2%",
  },
  headingText: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "grey",
  },
  container: {
    margin: 0,
    flex: 1,
    height: "100%",
  },
  sectionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: "4%",
    marginRight: "4%",
  },
  image: {
    borderRadius: 80,
    alignSelf: "center",
    width: 60,
    height: 60,
  },
  text: {
    textAlign: "center",
    fontSize: 12,
  },
  subText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
});
