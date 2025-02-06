import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Linking } from "react-native";
import { useCopilot, walkthroughable, CopilotStep } from "react-native-copilot";
import FastImage from "react-native-fast-image";
import { Colors } from "../../assets/colors/color";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { hp } from "../../helpers/common";

const Walkthroughable = walkthroughable(View);

export default function Sections(props) {
  const { width: windowWidth } = useWindowDimensions();
  const { t } = useTranslation();

  const profile = useSelector((state) => state.profile.profile);
  const spacing = 12;
  const itemWidth = (windowWidth - spacing * 4) / 3; // Ensuring 3 items per row

  const data1 = [
    {
      title: t("free_sessions"),
      imgUrl: require("../../images/sessions.png"),
      link: "HomeScreen",
      text: "Click here to explore and book free sessions tailored just for you!",
    },
    {
      title: t("trips"),
      imgUrl: require("../../images/trips.png"),
      link: "Trips",
      text: "Discover exciting trips and adventures! Click here to see our upcoming trips.",
    },
    {
      title: t("reels"),
      imgUrl: require("../../images/reels.png"),
      link: "ReelsPage",
      text: "See videos especially tailored for you.",
    },
    {
      title: t("quotes"),
      imgUrl: require("../../images/quotes.png"),
      link: "QuotesPage",
      text: "Get Daily Positive Quotes here.",
    },
    {
      title: t("rewards"),
      imgUrl: require("../../images/rewards.png"),
      link: "Rewards",
      text: "See your earned rewards here.",
    },
    {
      title: t("refer_win"),
      imgUrl: require("../../images/refer_win.png"),
      link: "Refer",
      text: "Share the app with your friends and relatives and win rewards.",
    },
    {
      title: t("contribute"),
      imgUrl: require("../../images/contribute.png"),
      link: "MembershipScreen",
      text: "Help us make a difference! Click here to learn how you can contribute.",
    },
    {
      title: t("get_help"),
      imgUrl: require("../../images/help.png"),
      link: "props.helpUrl",
      type: "external",
      text: "Need assistance? Click here to get help and find the support you need.",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <View style={styles.line} />
        <Text style={styles.headingText}>{t("explore")}</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.gridContainer}>
        {data1.map((item, index) => (
          <CopilotStep
            key={index}
            text={item.text}
            order={index + 1}
            name={`step_${index + 1}`}
          >
            <Walkthroughable>
              <TouchableOpacity
                disabled={
                  item.title === "Rewards" && profile.age && profile.age < 50
                }
                onPress={() => {
                  if (item.type === "external") {
                    Linking.openURL(props.helpUrl);
                  } else {
                    props.navigation.navigate(item.link);
                  }
                }}
                style={[
                  styles.gridItem,
                  {
                    width: itemWidth,
                    marginRight: (index + 1) % 3 ? spacing : 0,
                  },
                ]}
              >
                <Text style={styles.text} numberOfLines={2}>
                  {item.title}
                </Text>
                <FastImage
                  source={item.imgUrl}
                  style={[
                    styles.image,
                    {
                      opacity:
                        item.title == "Rewards" &&
                        profile.age &&
                        profile.age < 50
                          ? 0.4
                          : 1,
                    },
                  ]}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
            </Walkthroughable>
          </CopilotStep>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headingText: {
    color: Colors.primaryText,
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grey.grey,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Ensure items start from left
    alignItems: "center", // Align items properly
    paddingHorizontal: 12,
  },
  gridItem: {
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 12,
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
  text: {
    color: Colors.primaryText,
    textAlign: "center",
    fontSize: hp(1.6),
    fontWeight: "500",
    fontFamily: "Montserrat-SemiBold",
    position: "absolute",
    top: 8,
  },
});
