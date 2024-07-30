import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";

import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import { connect } from "react-redux";
import { setProfile } from "../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { Button } from "react-native-elements";
import analytics from "@react-native-firebase/analytics";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../constants/Colors.js";
class AdditionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.route.params.email,
      name: props.route.params.name,
      state: props.route.params.state,
      city: props.route.params.city,
      phoneNumber: props.route.params.phoneNumber,
      emergencyContact: props.route.params.emergencyContact,
      loadingButton: false,
      date: new Date(),
      open: false,
      uiDate: "",
      showAlert: false,
      alertMessage: "",
      // dob: props.route.params.dob,
      age: props.route.params.age,
    };

    if (this.pending() == false) {
      this.props.route.params.navigation.replace("GoHappy Club");
    }
    // this.pending();
  }
  pending() {
    if (
      this.state.phoneNumber == null ||
      this.state.phoneNumber.length == 0 ||
      this.state.name == null ||
      this.state.name.length == 0
    ) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    // this.getCurrentUserInfo();
  }
  setProfile(
    name,
    age,
    profileImage,
    plan,
    sessionsAttended,
    selfInviteCode,
    city,
    emergencyContact
  ) {
    let { profile, actions } = this.props;

    profile = {
      selfInviteCode: selfInviteCode,
      // dob: profile.dob,
      dateOfJoining: profile.dateOfJoining,
      age: age,
      name: name,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      token: profile.token,
      profileImage: profileImage,
      membership: plan,
      sessionsAttended: sessionsAttended,
      city: city,
      emergencyContact: emergencyContact,
    };

    actions.setProfile(profile);
  }

  updateDetails() {
    //  || this.state.uiDate=='' || this.state.uiDate==null
    if (
      this.state.name == null ||
      this.state.name == "" ||
      this.state.age == null ||
      this.state.age == ""
    ) {
      this.setState({
        showAlert: true.valueOf,
        alertMessage: "Mandatory details are missing",
      });

      return;
    }
    if (this.state.age < 50) {
      this.setState({
        showAlert: true,
        alertMessage:
          "GoHappy Club is an initiative exclusively for aged 50 years and above.",
      });
      return;
    }
    this.setState({ loadingButton: true });
    var url = SERVER_URL + "/user/update";
    axios
      .post(url, {
        email: this.state.email,
        name: this.state.name,
        state: this.state.state,
        city: this.state.city,
        phone: this.state.phoneNumber,
        emergencyContact: this.state.emergencyContact,
        // dob: this.state.date,
        age: this.state.age,
      })
      .then(async (response) => {
        if (response.data && response.data != "ERROR") {
          // this.setState({fullName: userInfo.fullName});
          if (response.data.phoneNumber != null) {
            AsyncStorage.setItem("phoneNumber", response.data.phoneNumber);
          }
          // AsyncStorage.setItem('fullName',response.data.fullName);
          if (response.data.name != null) {
            AsyncStorage.setItem("name", response.data.name);
          }
          if (response.data.email != null) {
            AsyncStorage.setItem("email", response.data.email);
          }
          if (response.data.profileImage != null) {
            AsyncStorage.setItem("profileImage", response.data.profileImage);
          }
          if (response.data.age != null) {
            AsyncStorage.setItem("age", response.data.age);
          }
          AsyncStorage.setItem("token", response.data.token);
          // this.state.navigation.navigate('DrawerNavigator');
          this.setProfile(
            response.data.name,
            response.data.age,
            response.data.profileImage,
            response.data.membership,
            response.data.sessionsAttended,
            response.data.selfInviteCode,
            response.data.city,
            response.data.emergencyContact
          );
          this.setState({ loader: true });

          this.props.route.params.navigation.replace("Intro");
          this.setState({ loader: false });
          await analytics().logEvent("signup_click", {
            phoneNumber: response.data.phoneNumber,
            email: response.data.email,
            age: response.data.age,
            name: response.data.name,
          });
        } else if (response.data == "ERROR") {
          this.setState({ showAlert: true, loader: false });
        }
        this.setState({ loadingButton: false });
      })
      .catch((error) => {
        this.setState({ loadingButton: false });
      });
  }
  setDate() {}

  render() {
    var open = this.state.open;
    return (
      <ScrollView style={styles.container1}>
        <Text style={styles.title}>Add Information</Text>

        <View style={styles.inputs}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Name *"
            placeholderTextColor={Colors.black}
            autoCapitalize="none"
            value={this.state.name}
            onChangeText={(text) => this.setState({ name: text })}
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            placeholder="Age *"
            placeholderTextColor={Colors.black}
            autoCapitalize="none"
            value={this.state.age}
            onChangeText={(text) => this.setState({ age: text })}
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Email"
            placeholderTextColor={Colors.black}
            autoCapitalize="none"
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
          />

          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="City"
            placeholderTextColor={Colors.black}
            value={this.state.city}
            onChangeText={(text) => this.setState({ city: text })}
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Emergency Contact Number"
            placeholderTextColor={Colors.black}
            value={this.state.emergencyContact}
            keyboardType="phone-pad"
            onChangeText={(text) => this.setState({ emergencyContact: text })}
          />
          <Text
            style={{
              fontSize: 14,
              color: Colors.black,
              marginTop: "5%",
              alignSelf: "center",
              alignContent: "center",
              textAlign: "center",
              paddingLeft: 15,
            }}
          >
            GoHappy Club: An Initiative exclusively for aged 50 years and above.
          </Text>
          {/* <Pressable onPress={() => this.setState({open:true})} >
						<View pointerEvents="none">
							<TextInput style = {styles.input}
								underlineColorAndroid = "transparent"
								placeholder = "Date Of Birth *"
								editable={false}
								placeholderTextColor = "#000"
								autoCapitalize = "none"
								value={this.state.date}

								// onPress={() => this.setState({open:true})}
							/>
						</View>
					</Pressable> */}
          {/* <DateTimePickerModal
						isVisible={open}
						mode="date"
						onConfirm={(date) => {
							this.setState({open:false})
							//this.setState({date:date})

							var uiDate = JSON.stringify(date).substring(1,JSON.stringify(date).indexOf('T'));
							this.setState({date:uiDate})
							this.setState({uiDate:uiDate})}}
						onCancel={() => this.setState({open:false})}
					/> */}
        </View>
        <Button
          outline
          title="Save"
          loading={this.state.loadingButton}
          buttonStyle={{ width: "50%", alignSelf: "center", marginTop: "5%" }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: Colors.linearGradient,
            start: { x: 0, y: 0.25 },
            end: { x: 0.5, y: 1 },
            locations: [0, 0.5, 0.6],
          }}
          onPress={this.updateDetails.bind(this)}
        />
        {/* <Button  buttonStyle = {styles.dateInput}
					// buttonStyle={{backgroundColor:'white'}}
					titleStyle={{color:'#29BFC2'}}
					title="Set Date of Birth"
					onPress={() => this.setState({open:true})} /> */}

        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Error"
          message={this.state.alertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Try Again"
          confirmButtonColor={Colors.errorButton}
          onConfirmPressed={() => {
            this.setState({ showAlert: false });
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.black,
    marginTop: "15%",
    alignSelf: "center",
  },
  container1: {
    flex: 1,
    backgroundColor: Colors.grey.f,
  },
  input: {
    fontSize: 18,
    color: Colors.black,
    marginTop: "5%",
    alignSelf: "center",
    backgroundColor: Colors.white,
    paddingLeft: 15,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 5,
    width: "70%",
  },
  inputs: {
    marginTop: "1%",
    flex: 1,
    flexDirection: "column",
  },
  dateInput: {
    fontSize: 20,
    marginTop: "5%",
    alignSelf: "center",
    backgroundColor: Colors.white,
    width: "40%",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  userBtn: {
    backgroundColor: "#f0ad4e",
    paddingVertical: 15,
    height: 60,
  },
  btnTxt: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.black,
    fontWeight: "700",
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    color: Colors.white,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: Colors.white,
  },
  logo: {
    width: 250,
    height: 250,
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },

  newinput: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
    color: Colors.white,
    paddingHorizontal: 10,
  },
  container2: {
    flex: 1,
    backgroundColor: "#aaa",
  },
  title2: {
    color: Colors.black,
    marginTop: "30%",
    marginBottom: 10,
    opacity: 0.9,
    textAlign: "center",
    fontSize: 30,
  },
  page: {
    marginTop: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: "90%",
    height: 40,
    borderColor: "#555",
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    color: Colors.white,
    fontSize: 16,
  },
  themeButton: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 5,
  },
  themeButtonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
  },
  verificationView: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
});
const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

const ActionCreators = Object.assign({}, { setProfile });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdditionalDetails);
