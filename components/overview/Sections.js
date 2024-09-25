import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Linking } from "react-native";
//import axios from "axios";
import { useCopilot, walkthroughable, CopilotStep } from "react-native-copilot";
import { Colors } from "../../assets/colors/color";
import { useZoom } from "@zoom/meetingsdk-react-native";
const Walkthroughable = walkthroughable(View);

export default function Sections(props) {
  const [whatsappLink, setWhatsappLink] = useState("");
  const { start, copilotEvents } = useCopilot();
  const walktroughStarted = useRef(false);
  const zoom = useZoom();
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
  ];

  // useEffect(() => {
  //   if (!walktroughStarted.current) {
  //     const timer = setTimeout(() => {
  //       start();
  //       walktroughStarted.current = true;
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [start]);

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

  
  const joinMeeting = async () => {
    try {
      if (!zoom.isInitialized()) {
        Alert.alert("Zoom not initialized");
      }
      await zoom.joinMeeting({
        meetingNumber: " 83707946835",
        userName: "John Doe",
        password: "xcEdj5",
      });
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Button title="Start tutorial" onPress={() => start()} /> */}
      <View style={styles.headingContainer}>
        <View style={styles.line} />
        <Text style={styles.headingText}>Explore</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity onPress={joinMeeting}>
        <Text>Start</Text>
      </TouchableOpacity>

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
                  <Image
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
    backgroundColor: Colors.grey.grey,
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
