import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { JitsiMeeting } from "@jitsi/react-native-sdk";
import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";

const Jitsi = () => {
  const jitsiMeeting = useRef(null);
  const room = "552280247e070790081d2e447275935a284daa64531afb32632700c33c1d12bb";
  const navigation = useNavigation();

  const onReadyToClose = useCallback(() => {
    navigation.navigate("GoHappy Club");
    jitsiMeeting.current.close();
  }, [navigation]);

  const onEndpointMessageReceived = useCallback(() => {
    console.log("You got a message!");
  }, []);

  const eventListeners = {
    onReadyToClose,
    onEndpointMessageReceived,
  };

  return (
    <JitsiMeeting
      config={{
        hideConferenceTimer: true,
        customToolbarButtons: [
          {
            icon: "https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png",
            id: "btn1",
            text: "Button one",
          },
          {
            icon: "https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png",
            id: "btn2",
            text: "Button two",
          },
        ],
        whiteboard: {
          enabled: true,
          collabServerBaseUrl: "https://meet.jit.si/",
        },
      }}
      userInfo={{
        displayName: "Mehul",
      }}
      eventListeners={eventListeners}
      flags={{
        "audioMute.enabled": true,
        "ios.screensharing.enabled": true,
        "fullscreen.enabled": false,
        "audioOnly.enabled": false,
        "android.screensharing.enabled": true,
        "pip.enabled": true,
        "pip-while-screen-sharing.enabled": true,
        "conference-timer.enabled": true,
        "close-captions.enabled": false,
        "toolbox.enabled": true,
      }}
      ref={jitsiMeeting}
      style={{ flex: 1 }}
      room={room}
      serverURL={"https://meet.jit.si/"}
    />
  );
};

export default Jitsi;

const styles = StyleSheet.create({});
