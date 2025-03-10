import React, { Component } from "react";
import WhatsAppFAB from "../../commonComponents/whatsappHelpButton.js";
import Video from "react-native-video";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { Platform, StatusBar, View } from "react-native";
import { bindActionCreators } from "redux";
import TopBanner from "../../components/overview/TopBanner.js";
import TrendingSessions from "../../components/overview/TrendingSessions";
import PromotionSection from "../../components/overview/PromotionSection.js";
import { ScrollView } from "react-native-gesture-handler";
import UpcomingWorkshops from "../../components/overview/UpcomingWorkshops.js";
import Sections from "../../components/overview/Sections.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GOHLoader from "../../commonComponents/GOHLoader.js";
import { Colors } from "../../assets/colors/color.js";
import Feed from "../../components/Reels/Feed.js";

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
      videos: [],
      timer: null,
      isInteractionBlocked: true,
      isBlocking: false,
    };
    crashlytics().log(JSON.stringify(props.propProfile));
    this.scrollViewRef = React.createRef();
    this.walkthroughStarted = React.createRef();
    // this.timer = null;
    // alert(JSON.stringify(props));
    // let timer;
  }

  async componentDidMount() {
    this.getOverviewData();
    this.setupTimer();
    this._unsubscribeFocus = this.props.navigation.addListener(
      "focus",
      this.onFocus
    );
    this._unsubscribeBlur = this.props.navigation.addListener(
      "blur",
      this.onBlur
    );
  }

  componentWillUnmount() {
    this.cleanupTimer();
    if (this._unsubscribeFocus) this._unsubscribeFocus();
    if (this._unsubscribeBlur) this._unsubscribeBlur();
  }
  scrollDown() {
    setTimeout(() => {
      if (this.scrollViewRef.current) {
        this.scrollViewRef.current.scrollTo({ y: 200, animated: true });

        setTimeout(() => {
          if (this.scrollViewRef.current) {
            this.scrollViewRef.current.scrollTo({ y: 0, animated: true });
          }
        }, 250);
      }
    }, 150);
  }

  onFocus = () => {
    this.setupTimer();
  };

  onBlur = () => {
    this.cleanupTimer();
  };

  setupTimer = async () => {
    const showTour = await AsyncStorage.getItem("showTour");
    if (showTour && showTour == "true" && !this.walkthroughStarted.current) {
      this.setState({ isBlocking: true });
      if (this.state.trendingSessions != null) {
        this.props.start(false, this.scrollViewRef.current);
        this.walkthroughStarted.current = true;
        this.setState({ isBlocking: false });
      }
    }
  };

  cleanupTimer = () => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: null });
    }
  };

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
          videos: response.data.videos,
        });
        this.scrollDown();
        this.setupTimer();
      }
    } catch (error) {
      this.error = true;
      crashlytics().log(`Error in getOverviewData OverviewScreen ${error}`);
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
          this.props.actions.setProfile(redux_profile);
          this.setState({ whatsappLink: properties[0].whatsappHelpLink });
        }
      }
    } catch (error) {
      this.error = true;
      // throw new Error("Error getting order ID");
    }
  }

  componentWillMount() {
    this.getProperties();
  }
  render() {
    if (this.state.error == true) {
      return (
        <>
          <StatusBar
            barStyle={"dark-content"}
            backgroundColor={Colors.background}
          />
          <View
            pointerEvents={this.state.isBlocking ? "none" : "auto"}
            style={{ backgroundColor: Colors.background }}
          >
            <ScrollView
              ref={this.scrollViewRef}
              showsVerticalScrollIndicator={false}
            >
              <TopBanner
                navigation={this.props.navigation}
                posters={this.state.posters}
              />

              <Sections
                navigation={this.props.navigation}
                helpUrl={
                  this.props.profile.properties
                    ? this.props.profile.properties.whatsappHelpLink
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
              <Feed videos={this.state.videos} />
              {Platform.OS == "android" && (
                <PromotionSection navigation={this.props.navigation} />
              )}
            </ScrollView>
          </View>
        </>
      );
    } else {
      // return (<MaterialIndicator color='black' style={{backgroundColor:"#00afb9"}}/>)
      return (
        // <ScrollView style={{ backgroundColor: Colors.white }}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
          }}
        >
          <GOHLoader />
        </View>
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
