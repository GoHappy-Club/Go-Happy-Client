import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { Colors } from "../../assets/colors/color";
import { hp, wp } from "../../helpers/common";
import { useDispatch, useSelector } from "react-redux";
import {
  Award,
  Calendar,
  Camera,
  CircleHelp,
  Clock,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from "react-native-image-crop-picker";
import { setProfile } from "../../redux/actions/counts";
import { TouchableOpacity } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Button } from "react-native-elements";
import AutocompleteCityInput from "../Autocomplete";
import AwesomeAlert from "react-native-awesome-alerts";
import UserDetailsForm from "../../commonComponents/UserDetailsForm";

const AdditionalDetails = ({ route }) => {
  const parseDate = (date) => {
    const splittedDate = date?.split("-");
    const day = splittedDate[0];
    const month = splittedDate[1];
    const year = splittedDate[2];
    const d = new Date(year, month - 1, day);
    const finalDate = dayjs(d);
    return finalDate;
  };

  const getFormattedDate = (dayjsObject) => {
    const finalDate = `${dayjsObject.get("date")}-${
      dayjsObject.get("month") + 1
    }-${dayjsObject.get("year")}`;
    return finalDate;
  };

  const profile = useSelector((state) => state.profile.profile);

  const [state, setState] = useState({
    name: route.params?.name,
    email: route.params?.email,
    emergencyContact: route.params?.emergencyContact,
    dob: route.params?.dob ? route.params?.dob : getFormattedDate(dayjs()),
    city: route.params?.city,
    age: route.params?.age,
    showAlert: false,
    alertMessage: "",
    phoneNumber: route.params?.phoneNumber,
    selectedFromDropdown: false,
  });

  const [updated, setUpdated] = useState(false);
  const [open, setOpen] = useState(false);
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const pending = () => {
    if (
      state.phoneNumber == null ||
      state.phoneNumber.length == 0 ||
      state.name == null ||
      state.name.length == 0
    ) {
      return true;
    }
    return false;
  };

  useLayoutEffect(() => {
    if (!pending() && route.params?.isNewUser !== true) {
      navigation.replace("GoHappy Club");
    }
    setInitialCheckDone(true);
  }, []);

  const handleSelectImage = async () => {
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
              phoneNumber: profile.phoneNumber,
              profileImage: base64Image,
            })
            .then(() => {
              dispatch(setProfile({ ...profile, profileImage: base64Image }));
              setState((prevState) => ({ ...prevState, image: base64Image }));
              AsyncStorage.setItem("profileImage", base64Image);
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    } catch (error) {
      console.log("Error in handleSelectImage:", error);
    }
  };

  const validateMail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(state.email);
  };

  const validateEmergencyContact = () => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(state.emergencyContact);
  };

  const validateDate = () => {
    const dateSplitted = state?.dob?.split("-");
    const day = dateSplitted[0];
    const month = dateSplitted[1];
    const year = dateSplitted[2];
    const dayjsDay = dayjs().get("date");
    const dayjsMonth = dayjs().get("month") + 1;
    const dayjsYear = dayjs().get("year");
    if (day == dayjsDay && month == dayjsMonth && year == dayjsYear) {
      return false;
    }
    return true;
  };

  const updateUser = async () => {
    if (
      state.name == null ||
      state.name == "" ||
      state.city == null ||
      state.city == ""
    ) {
      setState((prev) => ({
        ...prev,
        showAlert: true,
        alertMessage: "Mandatory details are missing",
      }));

      return;
    }
    if (state.age < 16) {
      setState((prev) => ({
        ...prev,
        showAlert: true,
        alertMessage: "Sorry, you must be atleast 16 years old to log in.",
      }));
      return;
    }
    if (!validateMail()) {
      setState((prevState) => ({
        ...prevState,
        alertTitle: "Invalid Email",
        alertMessage: "Please enter a valid email address\n eg:-name@gmail.com",
        showAlert: true,
      }));
      return;
    }
    if (!validateEmergencyContact()) {
      setState((prevState) => ({
        ...prevState,
        alertTitle: "Invalid emergency contact",
        alertMessage: "Please enter a valid emergency contact number.",
        showAlert: true,
      }));
      return;
    }
    if (!validateDate()) {
      setState((prevState) => ({
        ...prevState,
        alertTitle: "Invalid Date of Birth",
        alertMessage: "Please enter a Valid DOB.",
        showAlert: true,
      }));
      return;
    }
    if (!state.selectedFromDropdown) {
      setState((prevState) => ({
        ...prevState,
        alertTitle: "Invalid city",
        alertMessage: "Please select a city from the dropdown only.",
        showAlert: true,
      }));
      return;
    }
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await axios.post(`${SERVER_URL}/user/update`, {
        name: state.name,
        email: state.email,
        emergencyContact: state.emergencyContact,
        phone: profile.phoneNumber,
        city: state.city,
        dob: state.dob,
        age: state.age,
      });
      dispatch(
        setProfile({
          ...profile,
          name: state.name,
          email: state.email,
          emergencyContact: state.emergencyContact,
          city: state.city,
          dob: state.dob,
          age: state.age,
        })
      );
      AsyncStorage.setItem("phoneNumber", response.data.phone);
      AsyncStorage.setItem("name", state.name);
      AsyncStorage.setItem("email", state.email);
      AsyncStorage.setItem("emergencyContact", state.emergencyContact);
      AsyncStorage.setItem("city", state.city);
      AsyncStorage.setItem("dob", state.dob);
      AsyncStorage.setItem("age", JSON.stringify(state.age));
      setState((prevState) => ({ ...prevState, loading: false }));
      AsyncStorage.setItem("showTour", "true");
      navigation.replace("GoHappy Club");
      await analytics().logEvent("signup_click", {
        phoneNumber: response.data.phone,
        email: response.data.email,
        age: response.data.age,
        name: response.data.name,
      });
    } catch (error) {
      setState((prevState) => ({ ...prevState, loading: false }));
      console.log("Error in updateUser:", error);
      crashlytics().log(`Error in updateUser AdditionalDetails ${error}`);
    }
  };

  if (!initialCheckDone) {
    return null;
  }

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
                )}-${String(date.get("month") + 1).padStart(2, "0")}-${date.get(
                  "year"
                )}`;
                const d = parseDate(finalDate).toDate();
                const millis = new Date().getTime() - d.getTime();
                const age = Math.floor(millis / (1000 * 60 * 60 * 24 * 365));
                setState((prev) => ({ ...prev, dob: finalDate, age: age }));
                setOpen(false);
              }}
              maxDate={dayjs().subtract(5, "year")}
              selectedItemColor={Colors.primary}
            />
          </View>
        </Pressable>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "position"}
          style={{ flex: 1 }}
        >
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
            <UserDetailsForm
              state={state}
              setState={setState}
              setOpen={setOpen}
              setUpdated={setUpdated}
              styles={styles}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <Button
          outline
          title={"Save"}
          loading={state.loading}
          buttonStyle={styles.button}
          onPress={updateUser}
          disabled={state.loading}
          loadingProps={{ color: Colors.black }}
        />
      </SafeAreaView>
      {state.showAlert && (
        <AwesomeAlert
          show={state.showAlert}
          showProgress={false}
          title="Error!"
          message={state.alertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          confirmText="Try Again"
          confirmButtonColor={Colors.deepskyblue}
          onConfirmPressed={() => {
            setState((prev) => ({
              ...prev,
              showAlert: false,
              alertMessage: "",
            }));
          }}
        />
      )}
    </>
  );
};

export default AdditionalDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    justifyContent: "flex-start",
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
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
