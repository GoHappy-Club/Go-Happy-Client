import React, { Component } from "react";
import { Card, Divider } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Linking } from "react-native";

export default class Sections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformedData: [],
      dataIndex: 0,
      whatsappLink: "",
    };
  }

  data1 = [
    {
      title: "Book Sessions",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/sessions_section_pill.jpg",
      link: "HomeScreen",
    },
    // {
    //   title: "Trips",
    //   imgUrl:
    //     "https://storage.googleapis.com/gohappy-main-bucket/Assets/trips_section_pill.png",
    //   link: "Trips",
    // },
    {
      title: "Contribute",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/contribute_section_pill.png",
      link: "MembershipScreen",
    },
    {
      title: "Refer",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/refer_section_pill.jpg",
      link: "Refer",
    },
    {
      title: "Get Help",
      imgUrl:
        "https://storage.googleapis.com/gohappy-main-bucket/Assets/help_section_pill.jpeg",
      link: this.props.helpUrl,
      type: "external",
    },
  ];
  data2 = [];
  componentDidMount() {
    let helpUrl = this.handleHelp();
  }

  async handleHelp() {
    console.log("url is d", url);
    var url = SERVER_URL + "/properties/list";
    try {
      const response = await axios.get(url);
      console.log(JSON.stringify(response.data.properties));
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0) {
          this.setState({ whatsappLink: properties[0].whatsappLink });
        }
      }
    } catch (error) {
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <View style={styles.line} />
          <Text style={styles.headingText}>Explore</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.sectionsContainer}>
          {this.data1.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.type && item.type == "external") {
                    Linking.openURL(this.state.whatsappLink);
                    return;
                  }
                  return this.props.navigation.navigate(item.link);
                }}
              >
                <View style={styles.container}>
                  <Image source={{ uri: item.imgUrl }} style={styles.image} />
                  {/* <View style={styles.subContainer}> */}
                  <Text style={styles.text}>{item.title}</Text>
                  {/* </View> */}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ ...styles.sectionsContainer, marginTop: "3%" }}>
          {this.data2.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.type && item.type == "external") {
                    console.log("this", this.state.whatsappLink);
                    Linking.openURL(this.state.whatsappLink);
                    return;
                  }
                  //console.log(JSON.stringify(item), JSON.stringify(this.props));
                  return this.props.navigation.navigate(item.link);
                }}
              >
                <View style={styles.container}>
                  <Image source={{ uri: item.imgUrl }} style={styles.image} />
                  {/* <View style={styles.subContainer}> */}
                  <Text style={styles.text}>{item.title}</Text>
                  {/* </View> */}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
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
    // marginVertical: 10,
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
    // flexDirection: "row",
    // alignItems: "center",
    // borderRadius: 8,
    // borderColor: "grey",
    // borderWidth: 0.2,
    margin: 0,
    width: 100,
  },
  sectionsContainer: {
    flexDirection: "row",
    // margin: "5%",
    // marginTop: "0%",
    // marginBottom: "0%",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 80,
    resizeMode: "cover",
    alignSelf: "center",
  },

  text: {
    // marginHorizontal: 10,
    textAlign: "center",
    fontSize: 12,
    // fontWeight: "bold",
  },
  subText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
});
