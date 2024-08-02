import React, { Component } from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { walkthroughable, CopilotStep } from "react-native-copilot";

const Walkthroughable = walkthroughable(TouchableOpacity);

export default class PromotionSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformedData: [],
      dataIndex: 0,
    };
  }

  render() {
    const data = [
      {
        id: 1,
        title: "Refer Banner",
        image: "https://storage.googleapis.com/gohappy-main-bucket/Assets/refer_banner_new.png",
        to: "Refer",
        text: "Invite friends to join and benefit! Click here to refer and earn rewards."
      },
      {
        id: 2,
        title: "Contribute Banner",
        image: "https://storage.googleapis.com/gohappy-main-bucket/Assets/contribute_banner.png",
        to: "MembershipScreen",
        text: "Support our mission! Click here to learn how you can contribute and make an impact."
      }
    ];
    
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <View style={styles.line} />
          <Text style={styles.headingText}>Help Us Grow</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.cardsContainer}>
          {data.map((item, index) => {
            return (
              <CopilotStep
                name={item.title}
                order={index + 5}
                text={item.text}
                key={index}
              >
                <Walkthroughable
                  style={styles.touchable}
                  onPress={() => {
                    this.props.navigation.navigate(item.to);
                  }}
                >
                  {/* <View style={styles.card}> */}
                  <Image
                    source={{ uri: item.image }}
                    resizeMode="contain"
                    style={styles.image}
                  />
                  {/* </View> */}
                </Walkthroughable>
              </CopilotStep>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
  },
  cardsContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    margin: "2%",
    padding: 0,
    borderRadius: 8,
    height: "100%",
  },
  touchable: {
    width: "50%",
    height: 150,
    borderRadius: 8,
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    // borderTopRightRadius: 0,

    // borderBottomRightRadius: 0,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 10,
    margin: "5%",
    marginBottom: "2%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "grey",
  },
  headingText: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },
});
