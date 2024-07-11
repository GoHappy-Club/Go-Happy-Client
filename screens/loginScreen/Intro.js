import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const Intro = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container1}>
      <View style={styles.container2}>
        <Image
          source={{
            uri: "https://storage.googleapis.com/gohappy-main-bucket/Assets/session_section_pills.png",
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.text}>
        Join free sessions by clicking the "Free Sessions" icon on the next
        Screen.
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.replace("GoHappy Club");
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Let's get started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: "#0A1045",
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    borderRadius: 80,
    alignSelf: "center",
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#EBC1C1",
    color: "#000",
    padding: 14,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default Intro;
