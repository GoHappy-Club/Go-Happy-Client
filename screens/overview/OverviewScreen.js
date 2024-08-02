import React, { Component } from "react";
// import axios from "../../config/CustomAxios.js";
import HomeDashboard from "../../components/HomeDashboard.js";
import WhatsAppFAB from "../../commonComponents/whatsappHelpButton.js";
// var tambola = require('tambola-generator');
import tambola from "tambola";
import Video from "react-native-video";
import { EventReminderNotification } from "../../services/LocalPushController.js";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { Banner, Divider } from "react-native-paper";
import { Image, View } from "react-native";
import TopBanner from "../../components/overview/TopBanner.js";
import TrendingSessions from "../../components/overview/TrendingSessions";
import PromotionSection from "../../components/overview/PromotionSection.js";
import { ScrollView } from "react-native-gesture-handler";
import UpcomingWorkshops from "../../components/overview/UpcomingWorkshops.js";
import LottieView from "lottie-react-native";
import Sections from "../../components/overview/Sections.js";
import { Text } from "react-native";
import { CopilotStep, walkthroughable } from "react-native-copilot";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Walkthroughable = walkthroughable(View);

class OverviewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      childLoader: false,
      events: [],
      error: true,
      whatsappLink: "https://chat.whatsapp.com/GXcaodDZLKLGrCMdK8FpUi",
      bannerVisible: true,
      trendingSessions: null,
      upcomingWorkshops: null,
      posters: [],
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    this.walkthroughStarted = React.createRef();
    this.timer = null;
    // alert(JSON.stringify(props));
  }

  async componentDidMount() {
    const showTour = await AsyncStorage.getItem("showTour");
    if (showTour && showTour == "true" && !this.walkthroughStarted.current) {
      this.timer = setTimeout(() => {
        this.props.start(false, this.scrollView);
        this.walkthroughStarted.current = true;
      }, 3000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  async getOverviewData() {
    var url = SERVER_URL + "/home/overview";
    try {
      const response = await axios.get(url);
      if (response.data) {
        //console.log(response.data.trendingSessions);
        this.setState({
          trendingSessions: response.data.trendingSessions,
          upcomingWorkshops: response.data.upcomingWorkshops,
          posters: response.data.posters,
        });
      }
    } catch (error) {
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }

  async getProperties() {
    var url = SERVER_URL + "/properties/list";
    const redux_profile = this.props.profile;
    try {
      const response = await axios.get(url);
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0 && redux_profile) {
          redux_profile.properties = properties[0];
          actions.setProfile(redux_profile);
          this.setState({ whatsappLink: properties[0].whatsappLink });
        }
      }
    } catch (error) {
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }

  componentWillMount() {
    this.getOverviewData();
  }
  render() {
    if (this.state.error == true) {
      return (
        <>
          <ScrollView ref={(ref) => (this.scrollView = ref)}>
            <TopBanner
              navigation={this.props.navigation}
              posters={this.state.posters}
            />

            <Sections
              navigation={this.props.navigation}
              helpUrl={
                this.props.profile.properties
                  ? this.props.profile.properties.whatsappLink
                  : this.state.whatsappLink
              }
            />
            <UpcomingWorkshops
              navigation={this.props.navigation}
              upcomingWorkshops={this.state.upcomingWorkshops}
              reloadOverview={this.getOverviewData.bind(this)}
            />
            <TrendingSessions
              navigation={this.props.navigation}
              trendingSessions={this.state.trendingSessions}
              reloadOverview={this.getOverviewData.bind(this)}
            />
            <PromotionSection navigation={this.props.navigation} />
          </ScrollView>
          <WhatsAppFAB url={this.state.whatsappLink} />
        </>
      );
    } else {
      // return (<MaterialIndicator color='black' style={{backgroundColor:"#00afb9"}}/>)
      return (
        // <ScrollView style={{ backgroundColor: "white" }}>
        <Video
          source={require("../../images/logo_splash.mp4")}
          style={{
            position: "absolute",
            top: 0,
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 1,
          }}
          muted={true}
          repeat={true}
          resizeMode="cover"
        />
        // </ScrollView>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  count: state.count.count,
  profile: state.profile.profile,
});
const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);
