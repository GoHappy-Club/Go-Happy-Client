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
import React, { useEffect, useState } from "react";
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

const NewAdditionalDetails = ({ route }) => {
  const profile = useSelector((state) => state.profile.profile);

  const parseDate = (date) => {
    console.log("date in parse", date);

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
  const [state, setState] = useState({
    name: route.params?.name,
    email: route.params?.email,
    emergencyContact: route.params?.emergencyContact,
    dob: route.params?.dob
      ? route.params?.dob
      : getFormattedDate(dayjs().subtract(49, "years")),
    city: route.params?.city,
    age: route.params?.age,
    showAlert: false,
    alertMessage: "",
    phoneNumber: route.params?.phoneNumber,
    selectedFromDropdown: true,
  });

  const [updated, setUpdated] = useState(false);
  const [open, setOpen] = useState(false);
  const membership = useSelector((state) => state.membership.membership);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    if (pending() == false) {
      navigation.replace("GoHappy Club");
    }
  }, []);

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
    if (
      state.name == null ||
      state.name == "" ||
      state.age == null ||
      state.age == "" ||
      state.city == null ||
      state.city == "" ||
      state.dob == null ||
      state.dob == ""
    ) {
      setState({
        showAlert: true,
        alertMessage: "Mandatory details are missing",
      });

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
      AsyncStorage.setItem("age", state.age);
      setState((prevState) => ({ ...prevState, loading: false }));
      AsyncStorage.setItem("showTour", "true");
      console.log("Navigating");

      navigation.navigate("GoHappy Club");
      await analytics().logEvent("signup_click", {
        phoneNumber: response.data.phone,
        email: response.data.email,
        age: response.data.age,
        name: response.data.name,
      });
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
    `+${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2)}`;

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
              maxDate={dayjs().subtract(49, "year")}
              selectedItemColor={Colors.primary}
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
              value={state.name}
              onChangeText={(text) =>
                setState((prev) => ({ ...prev, name: text }))
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age : </Text>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={state.age}
              onChangeText={(text) =>
                setState((prev) => ({ ...prev, age: text }))
              }
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
              onChangeText={(text) =>
                setState((prev) => ({ ...prev, email: text }))
              }
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
              onChangeText={(text) =>
                setState((prev) => ({ ...prev, emergencyContact: text }))
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
            setInput={(city) => setState((prev) => ({ ...prev, city: city }))}
            selectedFromDropdown={state.selectedFromDropdown}
            setSelectedFromDropdown={(value) => {
              setUpdated(false);
              setState((prev) => ({ ...prev, selectedFromDropdown: value }));
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

export default NewAdditionalDetails;

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
