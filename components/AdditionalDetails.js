import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";

// import axios from "../config/CustomAxios.js";
import AwesomeAlert from "react-native-awesome-alerts";
import { connect } from "react-redux";
import { setProfile } from "../redux/actions/counts.js";
import { bindActionCreators } from "redux";
import { Button } from "react-native-elements";
import analytics from "@react-native-firebase/analytics";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AutocompleteCityInput from "./Autocomplete.js";
import { Colors } from "../assets/colors/color.js";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import ImagePicker from "react-native-image-crop-picker";
import { hp, wp } from "../helpers/common.js";
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
      sessionsAttended: sessionsAttended,
      city: city,
      emergencyContact: emergencyContact,
    };

    actions.setProfile(profile);
  }

  handleSelectImage = async () => {
    try {
      const options = {
        width: 350,
        height: 400,
        cropping: true,
        includeBase64: true,
        freeStyleCropEnabled: true,
      };
      ImagePicker.openPicker(options)
        .then((image) => {
          const base64Image = `data:${image.mime};base64,${image.data}`;
          var url = SERVER_URL + "/user/updateProfileImage";
          axios
            .post(url, {
              phoneNumber: this.props.profile.phoneNumber,
              profileImage: base64Image,
            })
            .then(() => {
              let { profile, actions } = this.props;
              const newProfile = { ...profile, profileImage: base64Image };
              actions.setProfile(newProfile);
              this.setState({ ...prevState, image: base64Image });
              AsyncStorage.setItem("profileImage", base64Image);
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    } catch (error) {
      console.log("Error in handleSelectImage:", error);
    }
  };

  updateDetails() {
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
    if (this.state.age < 16) {
      this.setState({
        showAlert: true,
        alertMessage: "Sorry, you must be atleast 16 years old to log in.",
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
          if (response.data.phone != null) {
            AsyncStorage.setItem("phoneNumber", response.data.phone);
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
          if (response.data.token != null) {
            AsyncStorage.setItem("token", response.data.token);
          }
          // this.state.navigation.navigate('DrawerNavigator');
          this.setProfile(
            response.data.name,
            response.data.age,
            response.data.profileImage,
            response.data.sessionsAttended,
            response.data.selfInviteCode,
            response.data.city,
            response.data.emergencyContact
          );
          this.setState({ loader: true });

          // this.props.route.params.navigation.replace("Intro");
          AsyncStorage.setItem("showTour", "true");
          this.props.navigation.navigate("GoHappy Club");
          this.setState({ loader: false });
          await analytics().logEvent("signup_click", {
            phoneNumber: response.data.user.phoneNumber,
            email: response.data.user.email,
            age: response.data.user.age,
            name: response.data.user.name,
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

  render() {
    var open = this.state.open;
    return (
      <>
        <SafeAreaView style={styles.mainContainer}>
          <Pressable
            style={{
              display: open ? "flex" : "none",
              position: "absolute",
              backgroundColor: "#000000a0",
              height: hp(100),
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000000,
              width: wp(100),
            }}
            onPress={() => setOpen(false)}
          >
            <View
              style={{
                backgroundColor: "white",
                zIndex: 10000,
                width: wp(90),
                borderRadius: 10,
                padding: 20,
              }}
            >
              <DateTimePicker
                timePicker={false}
                date={parseDate(state.dob)}
                onChange={({ date }) => {
                  const finalDate = `${String(date.get("date")).padStart(
                    2,
                    "0"
                  )}-${String(date.get("month") + 1).padStart(
                    2,
                    "0"
                  )}-${date.get("year")}`;

                  setState((prev) => ({ ...prev, dob: finalDate }));
                }}
                maxDate={dayjs().subtract(49, "year")}
              />
            </View>
          </Pressable>
          <StatusBar barStyle="dark-content" />
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
          >
            <View style={styles.basicDetailsContainer}>
              <View style={styles.coverContainer}>
                <FastImage
                  style={styles.cover}
                  resizeMode="cover"
                  source={{
                    uri: profile.profileImage,
                  }}
                />
                <Pressable
                  style={styles.cameraContainer}
                  onPress={handleSelectImage}
                >
                  <View
                    style={{
                      backgroundColor: "#00000080",
                      padding: 8,
                      borderRadius: 300,
                    }}
                  >
                    <Camera size={24} color={"#666"} fill={"white"} />
                  </View>
                </Pressable>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name : </Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={this.state.name}
                onChangeText={(text) => this.setState({ name: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age : </Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                value={this.state.age}
                onChangeText={(text) => this.setState({ age: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email : </Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={this.state.email}
                onChangeText={(text) => this.setState({ email: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Emergency Contact : </Text>
              <TextInput
                style={styles.input}
                value={this.state.emergencyContact}
                placeholder="Emergency Contact"
                maxLength={10}
                keyboardType="phone-pad"
                onChangeText={(text) =>
                  this.setState({ emergencyContact: text })
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of Birth : </Text>
              <Pressable
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  borderBottomWidth: 2,
                  borderBottomColor: "#ccc",
                }}
                onPress={() => this.setState({ open: true })}
              >
                <Text style={[styles.input, { borderBottomWidth: 0 }]}>
                  {this.state.dob}
                </Text>
                <Calendar size={24} color={"black"} />
              </Pressable>
            </View>
            <AutocompleteCityInput
              label={"City : "}
              input={this.state.city}
              setInput={(city) => setState({ city: city })}
            />
          </ScrollView>
          <Button
            outline
            title={"Save"}
            loading={state.loading}
            buttonStyle={styles.button}
            onPress={this.updateDetails.bind(this)}
            disabled={state.loading}
          />
        </SafeAreaView>
        {this.state.showAlert && (
          <AwesomeAlert
            show={this.state.showAlert}
            showProgress={false}
            title="Error!"
            message={this.state.alertMessage}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showConfirmButton={true}
            confirmText="Try Again"
            confirmButtonColor={Colors.deepskyblue}
            onConfirmPressed={() => {
              this.setState({
                showAlert: false,
                alertMessage: "",
              });
            }}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.beige,
  },
  container: {
    justifyContent: "flex-start",
    paddingHorizontal: wp(5),
    paddingTop: hp(7),
  },
  cover: {
    width: wp(50),
    aspectRatio: 1,
    borderRadius: wp(30),
  },
  coverContainer: {
    aspectRatio: 1,
    borderWidth: 4,
    borderColor: "black",
    borderRadius: wp(30),
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cameraContainer: {
    position: "absolute",
    bottom: -20,
    alignSelf: "center",
    backgroundColor: Colors.beige,
    padding: 4,
    borderRadius: wp(10),
  },
  basicDetailsContainer: {
    width: "100%",
    paddingHorizontal: wp(10),
    flexDirection: "column",
    alignItems: "center",
    gap: wp(8),
  },
  profileName: {
    fontSize: wp(7),
    fontFamily: "Montserrat-SemiBold",
  },
  phoneNumber: {
    fontSize: wp(4),
    fontFamily: "Montserrat-SemiBold",
    letterSpacing: 0.8,
  },
  profileInfo: {
    alignItems: "center",
    marginVertical: hp(2),
  },
  inputContainer: {
    marginBottom: 20,
    width: wp(90),
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    fontSize: wp(5.5),
    fontFamily: "Montserrat-SemiBold",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    color: "#000",
  },
  autocompleteContainer: {
    borderWidth: 0,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 100,
    backgroundColor: Colors.primary,
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
