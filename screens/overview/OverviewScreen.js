import React, { useState, useEffect } from "react";
import axios from "axios";
import WhatsAppFAB from "../../commonComponents/whatsappHelpButton.js";
import Video from "react-native-video";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../../redux/actions/counts.js";
import { Image, View, ScrollView, Text } from "react-native";
import TopBanner from "../../components/overview/TopBanner.js";
import TrendingSessions from "../../components/overview/TrendingSessions";
import PromotionSection from "../../components/overview/PromotionSection.js";
import UpcomingWorkshops from "../../components/overview/UpcomingWorkshops.js";
import Sections from "../../components/overview/Sections.js";
import crashlytics from '@react-native-firebase/crashlytics';
import { useNavigation } from "@react-navigation/native";

const OverviewScreen = () => {
  const [error, setError] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [trendingSessions, setTrendingSessions] = useState(null);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState(null);
  const [posters, setPosters] = useState([]);

  const profile = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    crashlytics().log(JSON.stringify(profile));
    getOverviewData();
  }, []);

  const getOverviewData = async () => {
    const url = SERVER_URL + "/home/overview";
    try {
      const response = await axios.get(url);
      if (response.data) {
        setTrendingSessions(response.data.trendingSessions);
        setUpcomingWorkshops(response.data.upcomingWorkshops);
        setPosters(response.data.posters);
      }
    } catch (error) {
      setError(true);
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

  return !error ? (
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
      <ScrollView>
        <TopBanner
          navigation={navigation}
          posters={posters}
        />
        <Sections
          navigation={navigation}
          helpUrl={
            profile.properties
              ? profile.properties.whatsappLink
              : whatsappLink
          }
        />
        <UpcomingWorkshops
          navigation={navigation}
          upcomingWorkshops={upcomingWorkshops}
          reloadOverview={getOverviewData}
        />
        <TrendingSessions
          navigation={navigation}
          trendingSessions={trendingSessions}
          reloadOverview={getOverviewData}
        />
        <PromotionSection navigation={navigation} />
      </ScrollView>
      <WhatsAppFAB
        url={
          profile.properties
            ? profile.properties.whatsappLink
            : whatsappLink
        }
      />
    </>
  );
};

export default OverviewScreen;
