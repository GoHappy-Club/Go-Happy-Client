import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { Colors } from "../assets/colors/color";
import { hp, wp } from "../helpers/common";
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
import { setProfile } from "../redux/actions/counts";
import { TouchableOpacity } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Button } from "react-native-elements";
import AutocompleteCityInput from "./Autocomplete";
import Toast from "react-native-simple-toast";
import LottieView from "lottie-react-native";
import AwesomeAlert from "react-native-awesome-alerts";

const EditProfile = () => {
  const profile = useSelector((state) => state.profile.profile);

  const parseDate = (date) => {
    const splittedDate = date.split("-");
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
  const [state, setState] = useState({
    name: profile.name,
    email: profile.email,
    emergencyContact: profile.emergencyContact,
    whatsappLink: "",
    dob: profile.dob
      ? profile.dob
      : getFormattedDate(dayjs().subtract(49, "years")),
    city: profile.city,
    showAlert: false,
    alertMessage: "",
    alertTitle: "",
  });

  const [updated, setUpdated] = useState(false);
  const [open, setOpen] = useState(false);
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await axios.post(`${SERVER_URL}/user/update`, {
        phone: profile.phoneNumber,
        name: state.name,
        email: state.email,
        emergencyContact: state.emergencyContact,
        city: state.city,
        dob: state.dob,
      });
      dispatch(
        setProfile({
          ...profile,
          email: state.email,
          emergencyContact: state.emergencyContact,
          name: state.name,
          city: state.city,
          dob: state.dob,
        })
      );
      AsyncStorage.setItem("email", state.email);
      AsyncStorage.setItem("emergencyContact", state.emergencyContact);
      AsyncStorage.setItem("name", state.name);
      AsyncStorage.setItem("city", state.city);
      AsyncStorage.setItem("dob", state.dob);
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

                setState((prev) => ({ ...prev, dob: finalDate }));
              }}
              maxDate={dayjs().subtract(49, "years")}
              selectedItemColor={Colors.primary}
            />
          </View>
        </Pressable>
        {updated && (
          <LottieView
            source={require("../assets/lottie/correct.lottie")}
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
            <Text>back</Text>
          </TouchableOpacity>
        </View>
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
              <Text style={styles.profileName}>{formatName(profile.name)}</Text>
              <Text style={styles.phoneNumber}>
                {formatPhoneNumber(profile.phoneNumber)}
              </Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name : </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={state.name}
              onChangeText={(text) => {
                setUpdated(false);
                setState((prev) => ({ ...prev, name: text }));
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email : </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={state.email}
              onChangeText={(text) => {
                setUpdated(false);
                setState((prev) => ({ ...prev, email: text }));
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Emergency Contact : </Text>
            <TextInput
              style={styles.input}
              value={state.emergencyContact}
              placeholder="Emergency Contact"
              maxLength={10}
              keyboardType="phone-pad"
              onChangeText={(text) => {
                setUpdated(false);
                setState((prev) => ({ ...prev, emergencyContact: text }));
              }}
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
              onPress={() => setOpen(true)}
            >
              <Text style={[styles.input, { borderBottomWidth: 0 }]}>
                {state.dob}
              </Text>
              <Calendar size={24} color={"black"} />
            </Pressable>
          </View>
          <AutocompleteCityInput
            label={"City : "}
            input={state.city}
            setInput={(text) => {
              setUpdated(false);
              setState((prev) => ({ ...prev, city: text }));
            }}
          />
        </ScrollView>
        <Button
          outline
          title={"Save"}
          loading={state.loading}
          buttonStyle={styles.button}
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
    backgroundColor: Colors.beige,
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
  },
});
