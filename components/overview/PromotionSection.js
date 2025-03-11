import PropTypes from "prop-types";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CopilotStep, walkthroughable } from "react-native-copilot";
import FastImage from "react-native-fast-image";
import { Text } from "react-native-paper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Colors } from "../../assets/colors/color";
import { wp } from "../../helpers/common";
import Contribute from "../../images/promotion_contribute.png";
import PromotionRefer from "../../images/promotion_refer.png";
import { setProfile } from "../../redux/actions/counts";

const Walkthroughable = walkthroughable(TouchableOpacity);

class PromotionSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformedData: [],
      dataIndex: 0,
    };
  }

  render() {
    const { t } = this.props;
    const data = [
      {
        id: 1,
        title: "Refer & Win",
        image: PromotionRefer,
        to:
          this.props.profile.age == null || this.props.profile.age >= 50
            ? "Refer"
            : "OverviewScreen",
        text: "Invite friends to join and benefit! Click here to refer and earn rewards.",
      },
      {
        id: 2,
        title: "Contribute",
        image: Contribute,
        to: "Contribution Details",
        text: "Support our mission! Click here to learn how you can contribute and make an impact.",
      },
    ];

    return (
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <View style={styles.line} />
          <Text style={styles.headingText}>{t("help_us_grow")}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.cardsContainer}>
          {data.map((item, index) => {
            return (
              <CopilotStep
                name={item.title}
                order={index + 7}
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
                  <FastImage
                    source={item.image}
                    resizeMode="contain"
                    style={styles.image}
                  />
                  {/* </View> */}
                  <Text style={styles.itemText}>{item.title}</Text>
                </Walkthroughable>
              </CopilotStep>
            );
          })}
        </View>
      </View>
    );
  }
}

PromotionSection.propTypes = {
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

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
    gap: wp(2),
  },
  touchable: {
    width: "48%",
    height: 150,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.grey.grey,
    borderWidth: 1,
    gap: 10,
    paddingBottom: 10,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  itemText: {
    fontSize: wp(4),
    fontWeight: "bold",
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
    backgroundColor: Colors.grey.grey,
  },
  headingText: {
    color: Colors.primaryText,
    marginHorizontal: 10,
    fontWeight: "bold",
  },
});

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(PromotionSection));
