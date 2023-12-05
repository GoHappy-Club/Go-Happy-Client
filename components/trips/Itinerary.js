import { View } from "react-native";
import { Text } from "react-native-paper";
import React, { Component, useEffect, useState } from "react";
import Accordion from "react-native-collapsible/Accordion";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { loadOnlyDate } from "../../commonComponents/helpers";

import {
  faCalendarAlt,
  faMapMarkerAlt,
  faMoneyBill,
  faCloudSun,
  faArrowAltCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import RenderHTML from "react-native-render-html";

export const Itinerary = ({ details }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [item, setItem] = useState(undefined);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    console.log("item", details);
    setItem(details);
    const timeDifference = Math.abs(details.endTime - details.startTime);

    // Convert milliseconds to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    console.log(daysDifference);
    setSections([
      {
        title: "Highlights",
        startTime: details.startTime,
        endTime: details.endTime,
        cities: details.cities,
        cost: details.cost,
        duration:
          daysDifference + " Days / " + (daysDifference - 1) + " Nights",
      },
      {
        title: "Attractions",
        attractions: details.attractions,
      },
    ]);
  }, [details]);

  const QuickView = ({ section }) => {
    return (
      <View>
        <Text style={{ fontSize: 18, marginBottom: "3%" }}>
          <FontAwesomeIcon icon={faCalendarAlt} size={20} color="brown" />
          {"  "}
          {loadOnlyDate(section.startTime)} - {loadOnlyDate(section.endTime)}
        </Text>
        <Text style={{ fontSize: 18, marginBottom: "3%" }}>
          <FontAwesomeIcon icon={faCloudSun} size={20} color="blue" />
          {"  "}
          {section.duration}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginBottom: "3%",
          }}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="red" />
          {"  "}
          {section.cities.join(" - ")}
        </Text>
        <Text style={{ fontSize: 18 }}>
          <FontAwesomeIcon icon={faMoneyBill} size={20} color="green" />
          {"  "}₹ {section.cost}/- per person
        </Text>
      </View>
    );
  };

  const Attractions = ({ section }) => {
    return (
      <View>
        {/* <Text style={{ fontSize: 18, marginBottom: "3%" }}>
          <FontAwesomeIcon icon={faCalendarAlt} size={20} color="brown" />
          {"  "}
          {loadOnlyDate(section.startTime)} - {loadOnlyDate(section.endTime)}
        </Text>
        <Text style={{ fontSize: 18, marginBottom: "3%" }}>
          <FontAwesomeIcon icon={faCloudSun} size={20} color="blue" />
          {"  "}
          {section.duration}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginBottom: "3%",
          }}
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color="red" />
          {"  "}
          {section.cities.join(" - ")}
        </Text>
        <Text style={{ fontSize: 18 }}>
          <FontAwesomeIcon icon={faMoneyBill} size={20} color="green" />
          {"  "}₹ {section.cost}/- per person
        </Text> */}
      </View>
    );
  };

  const _renderHeader = (section) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
        <FontAwesomeIcon
          style={{ marginHorizontal: "auto", marginLeft: "auto" }}
          icon={faArrowAltCircleDown}
          size={20}
          color="black"
        />
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View style={styles.content}>
        {section.title == "Highlights" && <QuickView section={section} />}

        {section.title == "Attractions" && <Attractions section={section} />}
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <ScrollView>
      {item && (
        <RenderHTML
          baseStyle={styles.description}
          // contentWidth={width}
          source={{
            html: item.beautifulDescription,
            // html: item.description,
          }}
        />
      )}
      <Accordion
        containerStyle={styles.test}
        sections={sections}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 22,
    margin: "5%",
    marginBottom: 0,
  },
  test: {
    // backgroundColor: "green",
    margin: "5%",
    // marginTop: "5%",
  },
  header: {
    backgroundColor: "pink",
    borderRadius: 8,
    padding: "5%",
    display: "flex",
    flexDirection: "row",
    marginBottom: "5%",
  },
  headerText: {
    // fontWeight: "bold",
    fontSize: 18,
  },
  content: {
    padding: "5%",
    paddingTop: 0,
  },
});
