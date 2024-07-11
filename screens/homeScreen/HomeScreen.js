import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeDashboard from "../../components/HomeDashboard.js";
import WhatsAppFAB from "../../commonComponents/whatsappHelpButton.js";
import tambola from "tambola";
import Video from "react-native-video";
import { EventReminderNotification } from "../../services/LocalPushController";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

const HomeScreen = ({ navigation, route }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [childLoader, setChildLoader] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState("");

  const profile = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    crashlytics().log(JSON.stringify(profile));
    _retrieveData();
    loadEvents(new Date().setHours(0, 0, 0, 0));
  }, []);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("email");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      const selfInviteCode = await AsyncStorage.getItem("selfInviteCode");
      if (value !== null) {
        setPhoneNumber(phoneNumber);
        // Add other setState calls as needed
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const getProperties = async () => {
    const url = SERVER_URL + "/properties/list";
    try {
      const response = await axios.get(url);
      if (response.data) {
        const properties = response.data.properties;
        if (properties && properties.length > 0 && profile) {
          profile.properties = properties[0];
          dispatch(setProfile(profile));
          setWhatsappLink(properties[0].whatsappLink);
        }
      }
    } catch (error) {
      setError(true);
    }
  };

  const loadEvents = (selectedDate) => {
    setChildLoader(true);
    setEvents([]);
    const url = SERVER_URL + "/event/getEventsByDate";
    if (selectedDate == null) {
      selectedDate = new Date().setHours(0, 0, 0, 0);
    }

    axios
      .post(url, { date: selectedDate })
      .then((response) => {
        if (response.data) {
          response.data.events.forEach((event) => (event.loadingButton = false));
          setEvents(response.data.events);
          setError(false);
          setChildLoader(false);
        }
        getProperties();
      })
      .catch((error) => {
        setError(true);
        getProperties();
      });
  };

  const bookEvent = (item, phoneNumber, selectedDate) => {
    let ticket = tambola.generateTicket();
    if (phoneNumber == "" || phoneNumber == undefined) {
      phoneNumber = phoneNumber;
    }
    const id = item.id;
    const url = SERVER_URL + "/event/bookEvent";

    axios
      .post(url, { id, phoneNumber, tambolaTicket: ticket })
      .then((response) => {
        if (response.data === "SUCCESS") {
          EventReminderNotification({
            channelId: "events",
            event: item,
            fireTime: new Date(parseInt(item.startTime) - 1000 * 60 * 10),
            bigText: "Your session starts in a few minutes.",
          });
          EventReminderNotification({
            channelId: "events",
            event: item,
            fireTime: new Date(parseInt(item.startTime)),
            bigText: "Your session has started. Join Now!",
          });
          const tempEvents = events.map((event) => {
            if (event.id === item.id) {
              event.seatsLeft -= 1;
              event.loadingButton = false;
              event.status = "Booked";
            }
            return event;
          });
          setEvents(tempEvents);
          loadEvents(selectedDate);
        }
      })
      .catch((error) => {
        setError(true);
      });
  };

  return error ? (
    <Video
      source={require("../../images/logo_splash.mp4")}
      style={{
        position: "absolute",
        top: 0,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 1,
      }}
      muted={true}
      repeat={true}
      resizeMode="cover"
    />
  ) : (
    <>
      <HomeDashboard
        events={events}
        childLoader={childLoader}
        bookEvent={bookEvent}
        loadEvents={loadEvents}
        navigation={navigation}
        deepId={route.params?.deepId}
      />
      <WhatsAppFAB
        url={profile.properties ? profile.properties.whatsappLink : whatsappLink}
      />
    </>
  );
};

export default HomeScreen;
