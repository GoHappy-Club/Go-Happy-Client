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
const Walkthroughable = walkthroughable(View);

export default function Sections(props) {
  const [whatsappLink, setWhatsappLink] = useState("");
  const { start, copilotEvents } = useCopilot();
  const walktroughStarted = useRef(false);
  const data1 = [
    {
      title: "Free Sessions",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/session_section_pills.png",
      link: "HomeScreen",
      text: "Click here to explore and book free sessions tailored just for you!",
    },
    {
      title: "Contribute",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/contribute_section_pill.jpeg",
      link: "MembershipScreen",
      text: "Help us make a difference! Click here to learn how you can contribute.",
    },
    {
      title: "Trips",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/trips_section_pill.png",
      link: "Trips",
      text: "Discover exciting trips and adventures! Click here to see our upcoming trips.",
    },
    {
      title: "Get Help",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/help_sections_pill.png",
      link: "props.helpUrl",
      type: "external",
      text: "Need assistance? Click here to get help and find the support you need.",
    },
    {
      title: "Rewards",
      imgUrl:
        "https://static.vecteezy.com/system/resources/thumbnails/008/486/043/small_2x/open-gift-box-surprise-earn-point-and-get-rewards-special-offer-concept-3d-rendering-illustration-png.png",
      link: "Rewards",
      text: "See your earned rewards here.",
    },
    {
      title: "Quotes",
      imgUrl:
        "https://static.vecteezy.com/system/resources/thumbnails/008/486/043/small_2x/open-gift-box-surprise-earn-point-and-get-rewards-special-offer-concept-3d-rendering-illustration-png.png",
      link: "QuotesPage",
      text: "Get Daily Positive Quotes here.",
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
      {/* <Button title="Start tutorial" onPress={() => start()} /> */}
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
                      source={{ uri: item.imgUrl }}
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
