import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { Colors } from "../../assets/colors/color";
import { hp, wp } from "../../helpers/common";
import { useDispatch, useSelector } from "react-redux";
import { Camera } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from "react-native-image-crop-picker";
import { setProfile } from "../../redux/actions/counts";
import { TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import { Button } from "react-native-elements";
import LottieView from "lottie-react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import UserDetailsForm from "../../commonComponents/UserDetailsForm";
import { useTranslation } from "react-i18next";
import DatePicker from "react-native-date-picker";

const EditProfile = () => {
  const profile = useSelector((state) => state.profile.profile);

  const parseDate = (date) => {
    const splittedDate = date.split("-");
    const day = splittedDate[0];
    const month = splittedDate[1];
    const year = splittedDate[2];
    const finalDate = new Date(year, month - 1, day);
    return finalDate;
  };

  const getFormattedDate = (date) => {
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
  };
  const [state, setState] = useState({
    name: profile.name,
    email: profile.email,
    emergencyContact: profile.emergencyContact,
    whatsappLink: "",
    dob: profile.dob ? parseDate(profile.dob) : dayjs().toDate(),
    city: profile.city,
    showAlert: false,
    alertMessage: "",
    alertTitle: "",
    selectedFromDropdown: true,
    age: profile.age,
    tempDate: profile.dob ? parseDate(profile.dob) : dayjs().toDate(),
  });

  const [updated, setUpdated] = useState(false);
  const [open, setOpen] = useState(false);
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

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

  const updateUser = async () => {
    if (!validateMail()) {
      setState((prevState) => ({
        ...prevState,
        alertTitle: "Invalid Email",
        alertMessage: "Please enter a valid email address",
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
        phone: profile.phoneNumber,
        name: state.name,
        email: state.email,
        emergencyContact: state.emergencyContact,
        city: state.city,
        dob: getFormattedDate(state.dob),
        age: state.age,
      });
      dispatch(
        setProfile({
          ...profile,
          email: state.email,
          emergencyContact: state.emergencyContact,
          name: state.name,
          city: state.city,
          dob: getFormattedDate(state.dob),
          age: state.age,
        })
      );
      AsyncStorage.setItem("email", state.email);
      AsyncStorage.setItem("emergencyContact", state.emergencyContact);
      AsyncStorage.setItem("name", state.name);
      AsyncStorage.setItem("city", state.city);
      AsyncStorage.setItem("dob", getFormattedDate(state.dob));
      AsyncStorage.setItem("age", JSON.stringify(state.age));
      setState((prevState) => ({ ...prevState, loading: false }));
      setUpdated(true);
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        setUpdated(false);
      }, 1500);
    } catch (error) {
      setState((prevState) => ({ ...prevState, loading: false }));
      console.log("Error in updateUser:", error);
    }
  };

  const formatName = (name) =>
    name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const formatPhoneNumber = (phoneNumber) =>
    `+${phoneNumber.slice(0, -10)} ${phoneNumber.slice(-10)}`;

  const validateMail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(state.email);
  };

  const validateEmergencyContact = () => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(state.emergencyContact);
  };

  const validateDate = () => {
    const today = new Date();
    if (
      state.dob.getDate() == today.getDate() &&
      state.dob.getFullYear() == today.getFullYear()
    ) {
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    const finalDate = state.tempDate;

    // const d = parseDate(finalDate);
    const millis = new Date().getTime() - finalDate.getTime();
    const age = Math.floor(millis / (1000 * 60 * 60 * 24 * 365));

    setState((prev) => ({ ...prev, dob: finalDate, age }));
    setOpen(false);
  };

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
        >
          <Modal
            transparent
            visible={open}
            animationType="fade"
            onRequestClose={() => {}}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 10,
                    alignItems: "center",
                    width: "80%",
                  }}
                >
                  <Text style={{ marginBottom: 10 }}>Select Date of Birth</Text>

                  <DatePicker
                    open={true}
                    date={state.tempDate}
                    mode="date"
                    timeZoneOffsetInMinutes={0}
                    onDateChange={(date) => {
                      setState((prev) => ({ ...prev, tempDate: date }));
                    }}
                    maximumDate={new Date()}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 14,
                      width: "85%",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity onPress={() => setOpen(false)}>
                      <Text
                        style={{
                          fontSize: 14,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirm}>
                      <Text
                        style={{
                          fontSize: 14,
                        }}
                      >
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        {updated && (
          <LottieView
            source={require("../../assets/lottie/correct.json")}
            autoPlay
            style={{
              width: wp(50),
              height: hp(50),
              zIndex: 1000,
              position: "absolute",
              padding: wp(25),
              left: wp(25),
              top: hp(25),
            }}
            speed={0.5}
            loop
          />
        )}
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: hp(2.5),
          }}
        >
          <TouchableOpacity
            style={{
              padding: 4,
              backgroundColor: Colors.white,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Colors.white,
              shadowColor: Colors.black,
              elevation: 10,
              shadowOffset: { height: 2 },
              shadowOpacity: 0.3,
              position: "relative",
              top: 15,
              left: 15,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text>{t("back")}</Text>
          </TouchableOpacity>
        </View>
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
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.profileName}>
                  {formatName(profile.name)}
                </Text>
                <Text style={styles.phoneNumber}>
                  {formatPhoneNumber(profile.phoneNumber)}
                </Text>
              </View>
            </View>

            <UserDetailsForm
              state={state}
              setState={setState}
              setOpen={setOpen}
              setUpdated={setUpdated}
              styles={styles}
              getFormattedDate={getFormattedDate}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <Button
          outline
          title={"Save"}
          loading={state.loading}
          titleStyle={{
            color: Colors.primaryText,
            fontFamily: "Montserrat-SemiBold",
            fontSize: wp(4),
          }}
          buttonStyle={styles.button}
          loadingProps={{ color: Colors.black }}
          onPress={updateUser}
          disabled={state.loading}
        />
      </SafeAreaView>
      {state.showAlert && (
        <AwesomeAlert
          show={state.showAlert}
          showProgress={false}
          title={state.alertTitle}
          message={state.alertMessage}
          closeOnTouchOutside={true}
          showCancelButton={false}
          showConfirmButton={true}
          confirmButtonColor={Colors.primary}
          confirmText="Okay"
          onConfirmPressed={() =>
            setState((prev) => ({ ...prev, showAlert: false }))
          }
          onDismiss={() => setState((prev) => ({ ...prev, showAlert: false }))}
        />
      )}
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    // alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: wp(5),
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
    fontFamily: "Montserrat-Regular",
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
    color: Colors.primaryText,
  },
});
