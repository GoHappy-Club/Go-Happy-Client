import React, { Component } from "react";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import phonepe_payments from "../PhonePe/Payments.js";
import { Button, Text } from "react-native-elements";
import Video, { ResizeMode } from "expo-av";
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import AwesomeAlert from "react-native-awesome-alerts";
import toUnicodeVariant from "../toUnicodeVariant.js";
import { Colors } from "../../assets/colors/color.js";
import { withTranslation } from "react-i18next";
import { wp } from "../../helpers/common.js";

class Contribution extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      phoneNumber: "",
      password: "",
      showAlert: false,
      loader: false,
      profileImage:
        "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg",
      name: "",
      email: "",
      membership: "",
      city: "Pune",
      state: "Maharashtra",
      backgroundColor: Colors.white,
      textColor: Colors.black,
      amount: "",
      success: false,
      payType: "o",
      showPaymentAlert: false,
      paymentAlertMessage: "Your Payment is Successful!",
      paymentAlertTitle: "Success",
      shareLink: "",
      clickPopup: false,
      plans: {
        selectedItem: "",
        planDetails: [
          {
            amount: 99,
            duration: "1 month",
            textColor: Colors.black,
            backgroundColor: Colors.white,
            selected: false,
            name: "Basic",
          },
          {
            amount: 249,
            duration: "3 months",
            textColor: Colors.black,
            backgroundColor: Colors.white,
            selected: false,
            name: "Silver",
          },
          {
            amount: 549,
            duration: "6 months",
            textColor: Colors.black,
            backgroundColor: Colors.white,
            selected: false,
            name: "Gold",
          },
          {
            amount: 1099,
            duration: "1 year",
            textColor: Colors.black,
            backgroundColor: Colors.white,
            selected: false,
            name: "Premium",
          },
        ],
      },
      payButtonLoading: false,
      shareButtonLoading: false,
    };
    this._retrieveData();
  }

  planSelected(plan, index) {
    var allPlans = this.state.plans;
    plan.backgroundColor = Colors.blue.blue;
    plan.textColor = Colors.white;
    allPlans.planDetails[index] = plan;
    allPlans.selectedItem = index;
    for (var i = 0; i < allPlans.planDetails.length; i++) {
      if (i == index) {
        continue;
      }
      allPlans.planDetails[i].backgroundColor = Colors.white;
      allPlans.planDetails[i].textColor = Colors.black;
    }
    this.setState({ plans: allPlans });
  }
  _retrieveData = async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      const email = await AsyncStorage.getItem("email");
      const profileImage = await AsyncStorage.getItem("profileImage");
      // const membership = await AsyncStorage.getItem("membership");
      this.setState({ name: name });
      this.setState({ email: email });
      this.setState({ profileImage: profileImage });
      this.setState({ membership: membership });
    } catch (error) {
      // Error retrieving data
    }
  };

  changeSuccess() {
    this.setState({ success: false });
  }

  checkValidAmount(text) {
    this.setState({ amount: text });
  }
  handlePress(amount) {
    this.setState({ amount: amount.toString() });
    //console.log(this.props.profile);
    // Do something with the selected amount
  }

  paytringWrapper = async (share = false) => {
    const data = {
      phone: this.props.profile.phoneNumber,
      amount: this.state.amount,
      email:
        this.props.profile.email != null || this.props.profile.email != ""
          ? this.props.profile.email
          : "void@paytring.com",
      cname: this.props.profile.name,
      type: "contribution",
    };
    this.setState({
      payButtonLoading: share ? false : true,
      shareButtonLoading: share ? true : false,
    });
    try {
      const response = await axios.post(
        `${SERVER_URL}/paytring/createOrder`,
        data
      );
      const orderData = response.data;
      this.setState({
        payButtonLoading: false,
        shareButtonLoading: false,
        clickPopup: false,
      });
      if (share) {
        this.handlePaymentShare(orderData);
      } else {
        this.props.navigation.navigate("PaytringView", {
          callback: () => {
            this.props.navigation.navigate("PaymentSuccessful", {
              type: "normal",
              navigateTo: "Contribution Details",
            });
          },
          error_handler: () => {
            this.props.navigation.navigate("PaymentFailed", {
              type: "normal",
              navigateTo: "Contribution Details",
            });
          },
          order_id: orderData?.order_id,
        });
      }
    } catch (error) {
      this.setState({ payButtonLoading: false, clickPopup: false });
      console.log("Error in fetching order id : ", error);
      crashlytics().log(`Error in paytringWrapper Contribution.js ${error}`);
    }
  };

  handlePaymentShare = async (orderData) => {
    try {
      Share.share({
        title: "GoHappy Payment Link",
        message: `Hey, ${this.props.profile.name} has requested an amount of ₹${this.state.amount} for contribution in GoHappyClub Family. Click on the link to pay. \nhttps://api.paytring.com/pay/token/${orderData?.order_id}`,
      });
    } catch (error) {
      console.log("Error in sharing payment link : ", error);
      crashlytics().log(`Error in handlePaymentShare Contribution.js ${error}`);
    }
  };

  render() {
    const { t } = this.props;
    if (this.state.loader == true) {
      return (
        <MaterialIndicator
          color={Colors.white}
          style={{ backgroundColor: Colors.materialIndicatorColor }}
        />
      );
    }
    return (
      <SafeAreaView
        style={{
          backgroundColor: Colors.background,
          flex: 1,
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight * 0.5 : wp(2),
        }}
      >
        <ScrollView
          style={{
            backgroundColor: Colors.background,
            height: "100%",
          }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text h3 style={{ fontWeight: "bold", marginTop: "10%" }}>
            {t("contribute_support")}
          </Text>
          <View style={{ flex: 1, flexDirection: "row", marginTop: "5%" }}>
            <FastImage
              style={{ height: 40, width: 40 }}
              source={require("../../images/secured.png")}
            />
            <Text
              style={{
                alignSelf: "center",
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {t("secured_payments")}
            </Text>
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={{ flexDirection: "column", marginTop: "5%" }}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.inputRef.current.focus();
                  }}
                  style={{
                    ...styles.paymentContainer,
                    // width:
                    //   this.state.amount.length > 1
                    //     ? (this.state.amount.length + 1) * 30
                    //     : "30%",
                  }}
                >
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    ref={this.inputRef}
                    style={styles.paymentInput}
                    value={this.state.amount.toString()}
                    onChangeText={(text) => this.checkValidAmount(text)}
                    placeholder="0"
                    keyboardType="numeric"
                    // autoFocus={true}
                  />
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.handlePress(501)}
                  >
                    <Text style={styles.buttonText}>₹501</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.handlePress(1100)}
                  >
                    <Text style={styles.buttonText}>₹1100</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.handlePress(2100)}
                  >
                    <Text style={styles.buttonText}>₹2100</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.handlePress(5100)}
                  >
                    <Text style={styles.buttonText}>₹5100</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text
              style={{
                color: Colors.black,
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 18,
                width: Dimensions.get("window").width * 0.9,
              }}
            >
              {t("shagun")}
            </Text>
            <Text
              style={{
                borderWidth: 1,
                padding: 10,
                borderColor: "rgba(0,0,0,0.2)",
                borderRadius: 10,
                marginTop: "5%",
                color: Colors.black,
                width: Dimensions.get("window").width * 0.9,
                textAlign: "justify",
                lineHeight: 22,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{t("why_contribute")}</Text>
              <Text>
                {"\n"}
                {t("contribution_text")}
              </Text>
              {/* <Text style={{fontWeight:'bold'}}>{'\n'}How? </Text> */}
              {/* <Text>{'\n'}By funding experts, interns & infrastructure and let your contagious smile reach more  senior citizens. </Text> */}
              <Text style={{ fontWeight: "bold" }}>
                {"\n"}
                {t("how_much_contribute")}
              </Text>
              <Text>
                {"\n"}
                {t("how_much_contribute_text")}
              </Text>
              {/* <Text style={{ fontWeight: "bold" }}>
                {"\n"}Compulsary to contribute?
              </Text>
              <Text>
                {"\n"}Not at all!! It's your Choice You will be still the
                precious member of our GoHappy Family.
              </Text> */}
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              width: Dimensions.get("window").width * 0.9,
            }}
          >
            <TouchableOpacity
              disabled={this.state.amount < 1}
              style={
                (this.state.amount < 1 && styles.checkoutButtonDisabled) ||
                styles.checkoutButtonEnabled
              }
              onPress={() => {
                this.setState({ clickPopup: true });
              }}
            >
              <View>
                <Text style={styles.optionList}>{t("click_to_pay")}</Text>
              </View>
            </TouchableOpacity>
            {this.state.clickPopup && (
              <AwesomeAlert
                show={this.state.clickPopup}
                showProgress={false}
                closeOnTouchOutside={
                  this.state.payButtonLoading || this.state.shareButtonLoading
                    ? false
                    : true
                }
                closeOnHardwareBackPress={
                  this.state.payButtonLoading || this.state.shareButtonLoading
                    ? false
                    : true
                }
                customView={
                  <View style={styles.AAcontainer}>
                    <Text style={styles.AAtitle}>Payment Confirmation</Text>
                    <Text style={styles.AAmessage}>Click below to pay.</Text>
                    <View style={styles.AAbuttonContainer}>
                      <Button
                        outline
                        title={"Pay Now"}
                        loading={this.state.payButtonLoading}
                        buttonStyle={[styles.AApayButton, styles.AAbutton]}
                        onPress={() => {
                          this.paytringWrapper(false);
                        }}
                        disabled={this.state.payButtonLoading}
                        titleStyle={{
                          color: Colors.primaryText,
                        }}
                      />
                      <Button
                        outline
                        title={"Share"}
                        loading={this.state.shareButtonLoading}
                        buttonStyle={[styles.AAshareButton, styles.AAbutton]}
                        onPress={() => {
                          this.paytringWrapper(true);
                        }}
                        disabled={this.state.shareButtonLoading}
                      />
                    </View>
                  </View>
                }
                onDismiss={() => this.setState({ clickPopup: false })}
              />
            )}
          </View>

          {/* {this.state.success && (
            <Video
              source={require("../../images/success_anim.mp4")}
              shouldPlay={true}
              style={{
                position: "absolute",
                // top: 0,
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                // left: 0,
                // right: 0,
                // bottom: 0,
                width: 100,
                height: 100,
              }}
              onEnd={() => setTimeout(this.changeSuccess.bind(this), 3000)}
              muted={true}
              // repeat={true}
              resizeMode={ResizeMode.COVER}
            />
          )} */}
          {this.state.showPaymentAlert && (
            <AwesomeAlert
              show={this.state.showPaymentAlert}
              showProgress={false}
              title={this.state.paymentAlertTitle}
              message={this.state.paymentAlertMessage}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showConfirmButton={true}
              confirmText="OK"
              confirmButtonColor={Colors.errorButton}
              onConfirmPressed={() => {
                this.setState({
                  showPaymentAlert: false,
                  paymentAlertMessage: "Your Payment is Successful!",
                  paymentAlertTitle: "Success",
                });
              }}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: Colors.materialIndicatorColor,
  },
  cover: {
    flex: 1,
    justifyContent: "center",
  },
  cardText: {
    textAlign: "center",
    marginTop: 10,
  },
  optionList: {
    fontSize: 16,
    padding: 10,
    color: Colors.primaryText,
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
  },
  checkoutButtonEnabled: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
  },
  input: {
    height: "10%",
    fontSize: 20,
    // marginTop:-,
    // borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    // marginTop:'20%',
    width: "auto",
    alignItems: "center",
  },
  paymentContainer: {
    // width: "auto",
    // minWidth: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.grey.d,
    padding: 5,
    margin: "5%",
  },
  currencySymbol: {
    fontSize: 36,
    // marginRight: 10,
    fontWeight: "700",
  },
  paymentInput: {
    textAlign: "center",
    // width: "auto",
    // flex: 1,
    color: Colors.black,
    fontSize: 36,
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    // marginTop: "5%",
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.grey.d,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  AAcontainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  AAtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.grey.grey,
  },
  AAmessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.grey.grey,
  },
  AAbuttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  AAbutton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 100,
  },
  AApayButton: {
    backgroundColor: Colors.primary,
  },
  AAshareButton: {
    backgroundColor: Colors.grey.grey,
  },
  AAbuttonText: {
    color: Colors.primaryText,
    textAlign: "center",
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
  mapDispatchToProps
)(withTranslation()(Contribution));
