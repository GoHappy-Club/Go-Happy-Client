import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";

import axios from "axios";
import AwesomeAlert from "react-native-awesome-alerts";
import { connect } from "react-redux";
import { setProfile } from "../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { Button } from "react-native-elements";

class AdditionalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.route.params.email,
      name: props.route.params.name,
      state: props.route.params.state,
      city: props.route.params.city,
      phoneNumber: props.route.params.phoneNumber,
      loadingButton: false,
      date: new Date(),
      open: false,
      uiDate: "",
      showAlert: false,
      alertMessage: "",
      dob: props.route.params.dob,
    };
    console.log("ffsefsdds", props.route.params);
    if (this.pending() == false) {
      this.props.route.params.navigation.replace("GoHappy Club");
    }
    // this.pending();
  }
  pending() {
    console.log("state in pending", this.state);
    if (
      this.state.phoneNumber == null ||
      this.state.phoneNumber.length == 0 ||
      this.state.name == null ||
      this.state.name.length == 0
    )
      return true;
    return false;
  }
  componentDidMount() {
    // this.getCurrentUserInfo();
  }
  setProfile(name, profileImage, plan, sessionsAttended, selfInviteCode) {
    let { profile, actions } = this.props;
    console.log("this is oplf profile", profile);
    profile = {
      selfInviteCode: selfInviteCode,
      dob: profile.dob,
      dateOfJoining: profile.dateOfJoining,
      name: name,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      token: profile.token,
      profileImage: profileImage,
      membership: plan,
      sessionsAttended: sessionsAttended,
    };

    actions.setProfile(profile);
  }
  getAge() {
    var today = new Date();
    var birthDate = new Date(this.state.date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log(age);
    return age;
  }

  updateDetails() {
    //  || this.state.uiDate=='' || this.state.uiDate==null
    if (this.state.name == null || this.state.name == "") {
      this.setState({
        showAlert: true.valueOf,
        alertMessage: "Mandatory details are missing",
      });
      console.log(this.state);
      return;
    }
    // if(this.getAge() < 50){
    // 	this.setState({showAlert:true,alertMessage:'Your age is less than 50 years. You are not eligible to login. Thank you'});
    // 	return;
    // }
    this.setState({ loadingButton: true });
    var url = SERVER_URL + "/user/update";
    axios
      .post(url, {
        email: this.state.email,
        name: this.state.name,
        state: this.state.state,
        city: this.state.city,
        phone: this.state.phoneNumber,
        dob: this.state.date,
      })
      .then((response) => {
        console.log("here", response);
        if (response.data && response.data != "ERROR") {
          // this.setState({fullName: userInfo.fullName});
          if (response.data.phoneNumber != null)
            AsyncStorage.setItem("phoneNumber", response.data.phoneNumber);
          // AsyncStorage.setItem('fullName',response.data.fullName);
          if (response.data.name != null)
            AsyncStorage.setItem("name", response.data.name);
          if (response.data.email != null)
            AsyncStorage.setItem("email", response.data.email);
          if (response.data.profileImage != null)
            AsyncStorage.setItem("profileImage", response.data.profileImage);
          AsyncStorage.setItem("token", response.data.token);
          // this.state.navigation.navigate('DrawerNavigator');
          this.setProfile(
            response.data.name,
            response.data.profileImage,
            response.data.membership,
            response.data.sessionsAttended,
            response.data.selfInviteCode
          );
          this.setState({ loader: true });
          console.log("naviii", this.props.route.params);
          this.props.route.params.navigation.replace("GoHappy Club");
          this.setState({ loader: false });
        } else if (response.data == "ERROR") {
          this.setState({ showAlert: true, loader: false });
        }
        this.setState({ loadingButton: false });
      })
      .catch((error) => {
        console.log("Error while logging in", error);
        this.setState({ loadingButton: false });
      });
  }
  setDate() {
    console.log("in set date");
  }

  render() {
    var open = this.state.open;
    return (
      <View style={styles.container1}>
        <Text style={styles.title}>Add Information</Text>
        <View style={styles.inputs}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Name *"
            placeholderTextColor="#000"
            autoCapitalize="none"
            value={this.state.name}
            onChangeText={(text) => this.setState({ name: text })}
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Email"
            placeholderTextColor="#000"
            autoCapitalize="none"
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
          />
          <Text
            style={{
              fontSize: 14,
              color: "black",
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
							console.log(this.state);
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
          buttonStyle={{ backgroundColor: "white", width: "100%" }}
          titleStyle={{ color: "black" }}
          onPress={this.updateDetails.bind(this)}
        ></Button>
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
          confirmButtonColor="#DD6B55"
          onConfirmPressed={() => {
            this.setState({ showAlert: false });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginTop: "15%",
    alignSelf: "center",
  },
  container1: {
    flex: 1,
    backgroundColor: "#fffaf1",
  },
  input: {
    fontSize: 20,
    color: "black",
    marginTop: "5%",
    alignSelf: "center",
    backgroundColor: "white",
    paddingLeft: 15,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    width: "70%",
  },
  inputs: {
    marginTop: "15%",
    flex: 1,
    flexDirection: "column",
  },
  dateInput: {
    fontSize: 20,
    marginTop: "5%",
    alignSelf: "center",
    backgroundColor: "white",
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
    color: "black",
    fontWeight: "700",
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    color: "white",
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
    color: "white",
    paddingHorizontal: 10,
  },
  container2: {
    flex: 1,
    backgroundColor: "#aaa",
  },
  title2: {
    color: "black",
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
    color: "#fff",
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
    color: "#fff",
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
