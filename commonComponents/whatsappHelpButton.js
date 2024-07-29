import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FAB } from "react-native-paper";
import { Linking } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { CopilotStep, walkthroughable } from "react-native-copilot";

const Walkthroughable = walkthroughable(View);

const WhatsAppFAB = ({ url }) => {
  const handlePress = async () => {
    ////console.log("url is ", url);
    if (url == " " || url == undefined) {
      var url = SERVER_URL + "/properties/list";
      try {
        const response = await axios.get(url);
        ////console.log(JSON.stringify(response));
        if (response.data) {
          const properties = response.data.properties;
          if (properties && properties.length > 0) {
            Linking.openURL(properties[0].whatsappLink);
          }
        }
      } catch (error) {
        this.error = true;
        // throw new Error("Error getting order ID");
      }
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <CopilotStep
        name="whatsapp"
        order={7}
        text="Click here to contact us on WhatsApp"
      >
        <Walkthroughable>
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
        </Walkthroughable>
      </CopilotStep>
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
