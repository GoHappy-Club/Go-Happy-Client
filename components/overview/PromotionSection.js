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
        image:
          "https://storage.googleapis.com/gohappy-main-bucket/Assets/refer_banner.jpeg",
        to: "Refer",
      },
      {
        id: 2,
        title: "Contribute Banner",
        image:
          "https://storage.googleapis.com/gohappy-main-bucket/Assets/contribute_banner.jpeg",
        to: "MembershipScreen",
      },
    ];
    return (
      <View>
        <View style={styles.line} />
        <View style={styles.cardsContainer}>
          {data.map((item) => {
            return (
              <Card style={styles.card} id={item.id}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate(item.to);
                  }}
                >
                  <Card.Cover
                    borderRadius={8}
                    resizeMode="stretch"
                    source={{
                      uri: item.image,
                    }}
                  />
                </TouchableOpacity>
              </Card>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardsContainer: {
    flex: 1,
    flexDirection: "row",
    margin: "2%",
    borderRadius: 8,
  },
  card: {
    width: "48%",
    margin: "1%",
    borderRadius: 8,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,

    borderTopRightRadius: 0,

    borderBottomRightRadius: 0,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "grey",
    margin: 10,
    color: "grey",
  },
});
