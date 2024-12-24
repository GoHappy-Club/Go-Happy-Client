import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FAB } from "react-native-paper";
import { Linking } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

import { CopilotStep, walkthroughable } from "react-native-copilot";
import { Colors } from "../assets/colors/color";

const Walkthroughable = walkthroughable(View);

const WhatsAppFAB = () => {
  const profile = useSelector((state) => state.profile.profile);
  const [link, setLink] = useState("");

  useEffect(() => {
    handlePress();
  }, []);

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
          );
          if (days < 10 || Number(profile.sessionsAttended) < 5) {
            setLink(properties[0].whatsappGroupLink[0]);
          } else {
            setLink(properties[0].whatsappGroupLink[1]);
          }
        }
      }
    } catch (error) {
      this.error = true;
      crashlytics().log("Error in getting properties list",error);
    }
  };

  return (
    <View style={styles.container}>
      <CopilotStep
        name="whatsapp"
        order={10}
        text="Click here to join our WhatsApp Group."
      >
        <Walkthroughable>
          <TouchableOpacity onPress={() => Linking.openURL(link)}>
            <FAB
              style={styles.fab}
              icon={() => (
                <FastImage
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
    backgroundColor: Colors.whatsappButton,
  },
  logo: {
    width: 24,
    height: 24,
    alignSelf: "center",
    backgroundColor: Colors.white, // set background color for image
    borderRadius: 20, // make the image round
    padding: 4, // add some padding to the image
  },
});

export default WhatsAppFAB;
