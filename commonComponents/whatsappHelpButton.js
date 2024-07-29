import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FAB } from "react-native-paper";
import { Linking } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

import { CopilotStep, walkthroughable } from "react-native-copilot";

const Walkthroughable = walkthroughable(View);

const WhatsAppFAB = ({ url }) => {
  const profile = useSelector((state) => state.profile.profile);

  const handlePress = async () => {
    var url = SERVER_URL + "/properties/list";
    try {
      const response = await axios.get(url);
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0) {
          const now = new Date();
          const days = Math.ceil(
            (now.getTime() - Number(profile.dateOfJoining)) / (1000 * 3600 * 24)
          )
          if(days<10 || Number(profile.sessionsAttended)<5){
            Linking.openURL(properties[0].whatsappLink[0]);
          }else{
            Linking.openURL(properties[0].whatsappLink[1]);
          }
        }
      }
    } catch (error) {
      this.error = true;
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
