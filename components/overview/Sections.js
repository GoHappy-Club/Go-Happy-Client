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
import { useCopilot, walkthroughable, CopilotStep } from "react-native-copilot";
import { Colors } from "../../assets/colors/color";
import { wp } from "../../helpers/common";
import FastImage from "react-native-fast-image";
const Walkthroughable = walkthroughable(View);

export default function Sections(props) {
  const [whatsappLink, setWhatsappLink] = useState("");
  const { start, copilotEvents } = useCopilot();
  const walktroughStarted = useRef(false);
  const data1 = [
    {
      title: "Free Sessions",
      imgUrl: require("../../images/sessions.png"),
      link: "HomeScreen",
      text: "Click here to explore and book free sessions tailored just for you!",
    },
    {
      title: "Contribute",
      imgUrl: require("../../images/contribute.png"),
      link: "MembershipScreen",
      text: "Help us make a difference! Click here to learn how you can contribute.",
    },
    {
      title: "Trips",
      imgUrl: require("../../images/trips.png"),
      link: "Trips",
      text: "Discover exciting trips and adventures! Click here to see our upcoming trips.",
    },
    {
      title: "Get Help",
      imgUrl: require("../../images/help.png"),
      link: "props.helpUrl",
      type: "external",
      text: "Need assistance? Click here to get help and find the support you need.",
    },
    {
      title: "Rewards",
      imgUrl: require("../../images/rewards.png"),
      link: "Rewards",
      text: "See your earned rewards here.",
    },
    {
      title: "Quotes",
      imgUrl: require("../../images/quotes.png"),
      link: "QuotesPage",
      text: "Get Daily Positive Quotes here.",
    },
    {
      title: "Reels",
      imgUrl: require("../../images/rewards.png"),
      link: "ReelsPage",
      text: "See videos especially tailored for you.",
    },
  ];

  useEffect(() => {
    async function handleHelp() {
      const url = `${SERVER_URL}/properties/list`;
      try {
        const response = await axios.get(url);
        if (response.data) {
          const properties = response.data.properties;
          if (properties && properties.length > 0) {
            setWhatsappLink(properties[0].whatsappHelpLink);
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
      <View style={styles.headingContainer}>
        <View style={styles.line} />
        <Text style={styles.headingText}>Explore</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.outerSectionsContainer}>
        <View style={styles.sectionsContainer}>
          {data1.map((item, index) => (
            <CopilotStep
              key={index}
              text={item.text}
              order={index + 1}
              name={`step_${index + 1}`}
            >
              <Walkthroughable>
                <TouchableOpacity
                  onPress={() => {
                    if (item.type && item.type === "external") {
                      Linking.openURL(whatsappLink);
                    } else {
                      props.navigation.navigate(item.link);
                    }
                  }}
                >
                  <View style={styles.container}>
                    <FastImage
                      source={item.imgUrl}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <Text style={styles.text}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              </Walkthroughable>
            </CopilotStep>
          ))}
        </View>
      </View>
    </View>
  );
}

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {},
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: "5%",
    marginBottom: "2%",
  },
  headingText: {
    color: Colors.primaryText,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grey.grey,
  },
  container: {
    width: wp(20),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
  },
  outerSectionsContainer: {
    width: wp(100),
    alignItems: "center",
    justifyContent: "center",
  },
  sectionsContainer: {
    width: wp(95),
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    paddingVertical: wp(1),
  },
  image: {
    // borderRadius: 80,
    alignSelf: "center",
    width: 60,
    height: 60,
  },
  text: { color: Colors.primaryText, textAlign: "center", fontSize: 12 },
  subText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
  startButton: {
    color: Colors.primary,
    textAlign: "center",
    margin: 10,
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
  walkthroughableView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
