import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FAB } from "react-native-paper";
import { Linking } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
const WhatsAppFAB = ({ url }) => {
  const handlePress = async () => {
    // if (url == " " || url == undefined) {
    //   var url = SERVER_URL + "/properties/list";
    //   try {
    //     const response = await axios.get(url);
    //     if (response.data) {
    //       const properties = response.data.properties;
    //       if (properties && properties.length > 0) {
    //         Linking.openURL(properties[0].whatsappLink);
    //       }
    //     }
    //   } catch (error) {
    //     this.error = true;
    //   }
    // } else {
    //   Linking.openURL(url);
    // }
    const url = "https://wa.me/6280114385?text= Hi%20GoHappy%20Club%20Team%0A%0ACan%20you%20please%20help%20me%20%3F"
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <FAB
          style={styles.fab}
          icon={() => (
            <Image
              source={require("../images/whatsapp.png")}
              style={styles.logo}
            />
          )}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  fab: {
    backgroundColor: "#25D366",
  },
  logo: {
    width: 24,
    height: 24,
    alignSelf: "center",
    backgroundColor: "white", // set background color for image
    borderRadius: 20, // make the image round
    padding: 4, // add some padding to the image
  },
});

export default WhatsAppFAB;
