import React, { Component } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import phonepe_payments from "./PhonePe/Payments.js";

import { Text } from "react-native-elements";

import Video from "react-native-video";

import { connect } from "react-redux";
import { setProfile } from "../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { Linking } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import toUnicodeVariant from "./toUnicodeVariant.js";

class Membership extends Component {
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
      backgroundColor: "white",
      textColor: "black",
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
            textColor: "black",
            backgroundColor: "white",
            selected: false,
            name: "Basic",
          },
          {
            amount: 249,
            duration: "3 months",
            textColor: "black",
            backgroundColor: "white",
            selected: false,
            name: "Silver",
          },
          {
            amount: 549,
            duration: "6 months",
            textColor: "black",
            backgroundColor: "white",
            selected: false,
            name: "Gold",
          },
          {
            amount: 1099,
            duration: "1 year",
            textColor: "black",
            backgroundColor: "white",
            selected: false,
            name: "Premium",
          },
        ],
      },
    };
    this._retrieveData();
  }
  async phonePeWrapper(type) {
    var _this = this;
    const _callback = (id) => {
      _this.setState({ success: true });
      _this.props.setPaymentData(
        id,
        _this.props.profile.phoneNumber,
        _this.state.amount,
        () => {
          _this.props.navigation.navigate("GoHappy Club");
        }
      );
    };
    const _errorHandler = () => {
      // //console.log("reached in error handler", error);
      this.setState({
        paymentAlertMessage: phonepe_payments.PaymentError(),
        paymentAlertTitle: "Oops!",
        amount: "",
      });
      this.setState({ showPaymentAlert: true });
    };
    //console.log('propro',this.props.profile)
    if (type == "share") {
      phonepe_payments
        .phonePeShare(
          this.props.profile.phoneNumber,
          this.state.amount,
          _callback,
          _errorHandler,
          "contribution"
        )
        .then((link) => {
          //prettier-ignore
          const message = `Hello from GoHappy Club Family, ${toUnicodeVariant(this.props.profile.name,"italic")} is requesting a payment of ₹${toUnicodeVariant(this.state.amount,"bold")} for Contribution to Go Happy Club Family.
Please pay on the below link:
${link}`;
          Share.share({
            message: message,
          })
            .then((result) => {
              // console.log(result);
            })
            .catch((errorMsg) => {
              console.log("error in sharing", errorMsg);
            });
        });
    } else {
      phonepe_payments.phonePe(
        this.props.profile.phoneNumber,
        this.state.amount,
        _callback,
        _errorHandler,
        "contribution"
      );
    }
  }

  planSelected(plan, index) {
    var allPlans = this.state.plans;
    plan.backgroundColor = "blue";
    plan.textColor = "white";
    allPlans.planDetails[index] = plan;
    allPlans.selectedItem = index;
    for (var i = 0; i < allPlans.planDetails.length; i++) {
      if (i == index) {
        continue;
      }
      allPlans.planDetails[i].backgroundColor = "white";
      allPlans.planDetails[i].textColor = "black";
    }
    this.setState({ plans: allPlans });
  }
  _retrieveData = async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      const email = await AsyncStorage.getItem("email");
      const profileImage = await AsyncStorage.getItem("profileImage");
      const membership = await AsyncStorage.getItem("membership");
      this.setState({ name: name });
      this.setState({ email: email });
      this.setState({ profileImage: profileImage });
      this.setState({ membership: membership });
    } catch (error) {
      // Error retrieving data
    }
  };

  renderPlans(plan, key) {
    return (
      <View style={{ width: "50%" }}>
        <TouchableOpacity
          style={{
            backgroundColor: plan.backgroundColor,
            shadowColor: "black",
            elevation: 10,
            shadowOffset: { height: 2 },
            shadowOpacity: 0.3,
            borderRadius: 10,
            height: 100,
            margin: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={this.planSelected.bind(this, plan, key)}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 30, color: plan.textColor }}>
              ₹{plan.amount}
            </Text>
            <Text style={{ color: plan.textColor }}>{plan.duration}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
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
  render() {
    if (this.state.loader == true) {
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: "#0A1045" }}
        />
      );
    }
    const navigation = this.props.navigation;
    const title = "Login";
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        {/*--------------------------------------OLD UI------------------------------------------------ */}

        {/* <ScrollView style = {{
					backgroundColor: 'white',height:'100%'
				}}
				contentContainerStyle={{justifyContent: 'center',
				alignItems: 'center'}}
				>

					<Text h1 style={{fontWeight:'bold',marginTop:'25%'}}>Choose your plan</Text>
					<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
						{
						this.state.plans.planDetails.map((item, key) =>
							(
								this.renderPlans(item,key)
							))
					}</View>

					<View style={{marginTop:20,width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity  disabled={this.state.plans.selectedItem===''}
						 style={this.state.plans.selectedItem==='' && styles.checkoutButtonDisabled || styles.checkoutButtonEnabled}
						 onPress={this.phonePe.bind(this)}>
							<View>
								<Text style={styles.optionList}>Proceed to Checkout</Text>
							</View>
						</TouchableOpacity>
					</View>



				</ScrollView> */}

        {/* ------------------------------------------------------------------------------------ */}
        <ScrollView
          style={{
            backgroundColor: "white",
            height: "100%",
          }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text h3 style={{ fontWeight: "bold", marginTop: "10%" }}>
            Contribute & Support Us
          </Text>
          <View style={{ flex: 1, flexDirection: "row", marginTop: "5%" }}>
            <Image
              style={{ height: 40, width: 40 }}
              source={require("../images/secured.png")}
            />
            <Text
              style={{
                alignSelf: "center",
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Secured Payments
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
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 18,
                width: Dimensions.get("window").width * 0.9,
              }}
            >
              Yeh Shagun GoHappy Family ke Naam
            </Text>
            <Text
              style={{
                borderWidth: 1,
                padding: 10,
                borderColor: "rgba(0,0,0,0.2)",
                borderRadius: 10,
                marginTop: "5%",
                color: "black",
                width: Dimensions.get("window").width * 0.9,
                textAlign: "justify",
                lineHeight: 22,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Why contribute?</Text>
              <Text>
                {"\n"}
                It will help us make your life more vibrant and make you Go more
                Happy, as contributions from GoHappy Club members is the only
                source of revenue to fund experts, interns & infrastructure.{" "}
              </Text>
              {/* <Text style={{fontWeight:'bold'}}>{'\n'}How? </Text> */}
              {/* <Text>{'\n'}By funding experts, interns & infrastructure and let your contagious smile reach more  senior citizens. </Text> */}
              <Text style={{ fontWeight: "bold" }}>
                {"\n"}How much to contribute?
              </Text>
              <Text>
                {"\n"}Financial support of any size help fund our mission.
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
              onPress={() => {this.setState({ clickPopup: true })}}
            >
              <View>
                <Text style={styles.optionList}>Click To Pay</Text>
              </View>
            </TouchableOpacity>
            {this.state.clickPopup && (
              <AwesomeAlert
                show={this.state.clickPopup}
                showProgress={false}
                title="Payment Confirmation"
                message="Do you want to pay this yourself or share it with your family member"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                cancelText="Pay Now"
                confirmButtonColor="gray"
                cancelButtonColor="#29BFC2"
                onCancelPressed={() => {
                  this.phonePeWrapper("self");
                  this.setState({
                    clickPopup: false,
                  });
                }}
                confirmText="Share"
                showCancelButton={true}
                onConfirmPressed={() => {
                  this.phonePeWrapper("share");
                }}
              />
            )}
          </View>

          {this.state.success && (
            <Video
              source={require("../images/success_anim.mp4")}
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
              resizeMode="cover"
            />
          )}
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
              confirmButtonColor="#DD6B55"
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#0A1045",
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
    color: "white",
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
    alignItems: "center",
    backgroundColor: "#29BFC2",
    padding: 10,
  },
  checkoutButtonEnabled: {
    alignItems: "center",
    backgroundColor: "#29BFC2",
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
    borderColor: "#d6d7da",
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
    borderColor: "#d6d7da",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 14,
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
export default connect(mapStateToProps, mapDispatchToProps)(Membership);
