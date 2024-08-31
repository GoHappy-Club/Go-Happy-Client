import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FAB } from "react-native-paper";
import { Linking } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import AwesomeAlert from "react-native-awesome-alerts";
const WhatsAppFAB = ({ url }) => {
  const [showAlert, setShowAlert] = useState(false);
  const handlePress = async () => {
    if (url == " " || url == undefined) {
      var url = SERVER_URL + "/properties/list";
      try {
        const response = await axios.get(url);
        if (response.data) {
          const properties = response.data.properties;
          if (properties && properties.length > 0) {
            Linking.openURL(properties[0].whatsappLink);
          }
        }
      } catch (error) {
        this.error = true;
      }
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setShowAlert(true)}>
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
      {showAlert && <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Join WhatsApp Group"
                message={"Only for new Members"}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                confirmText="Join"
                confirmButtonColor="#29BFC2"
                cancelButtonColor="gray"
                cancelText="Cancel"
                onConfirmPressed={() => {
                  Linking.openURL(url);
                }}
                onCancelPressed={() => {
                  setShowAlert(false);
                }}
              />}
    </>
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
