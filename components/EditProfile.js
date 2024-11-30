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
import AutocompleteCityInput from "./Autocomplete";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";

const EditProfile = () => {
  const profile = useSelector((state) => state.profile.profile);

  const [state, setState] = useState({
    email: profile.email,
    emergencyContact: profile.emergencyContact,
    whatsappLink: "",
  });
  const [updated, setUpdated] = useState(false);

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
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await axios.post(`${SERVER_URL}/user/update`, {
        email: state.email,
        emergencyContact: state.emergencyContact,
        phone: profile.phoneNumber,
      });
      dispatch(
        setProfile({
          ...profile,
          email: state.email,
          emergencyContact: state.emergencyContact,
        })
      );
      AsyncStorage.setItem("email", state.email);
      AsyncStorage.setItem("emergencyContact", state.emergencyContact);
      setState((prevState) => ({ ...prevState, loading: false }));
      setUpdated(true);
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
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text>Back</Text>
        </TouchableOpacity>
        {profile.age == null || profile.age > 50 ? (
          <Pressable
            style={styles.helpButton}
            onPress={() => Linking.openURL(state.whatsappLink)}
          >
            <CircleHelp size={22} color={"black"} />
            <Text style={styles.helpText}>Help</Text>
          </Pressable>
        ) : null}
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
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={state.email}
            onChangeText={(text) => setState({ ...state, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact Number"
            value={state.emergencyContact}
            onChangeText={(text) =>
              setState({ ...state, emergencyContact: text })
            }
            keyboardType="phone-pad"
            maxLength={10}
          />
          {/* <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              alignSelf: "center",
              paddingHorizontal: wp(4),
              paddingVertical: wp(2),
              borderRadius: 5,
            }}
            onPress={updateUser}
          >
            <Text
              style={{
                color: "white",
                fontSize: wp(5),
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Save
            </Text>
          </TouchableOpacity> */}
          <Button
            outline
            title={"Save"}
            loading={state.loading}
            buttonStyle={styles.button}
            onPress={updateUser}
            disabled={state.loading}
          />
          {updated && (
            <Text style={{ color: "green", textAlign: "center" }}>
              Updated Successfully
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.beige,
  },
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: wp(5),
    paddingTop: hp(7),
  },
  backButton: {
    position: "absolute",
    top: hp(2),
    left: wp(5),
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
  helpButton: {
    position: "absolute",
    top: hp(2),
    right: wp(5),
    flexDirection: "row",
    alignItems: "center",
  },
  helpText: {
    fontSize: wp(4),
    marginLeft: 5,
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
    width: "100%",
    marginTop: hp(4),
  },
  input: {
    width: "100%",
    padding: wp(3),
    marginBottom: hp(2),
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    fontSize: wp(4),
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 100,
    backgroundColor: Colors.primary,
  },
});
