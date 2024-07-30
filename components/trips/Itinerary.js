import { Linking, View } from "react-native";
import { Button, Text } from "react-native-paper";
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
import { Colors } from "../../constants/Colors";

export const Itinerary = ({ details }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [item, setItem] = useState(undefined);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    setItem(details);

    setSections([
      {
        id: "aboutTheLocation",
        title: "About the location",
      },
      {
        id: "highlights",
        title: "Highlights",
      },
      {
        id: "itinerary",
        title: "Itinerary",
      },
      {
        id: "inclusion",
        title: "Inclusion",
      },
      {
        id: "exclusion",
        title: "Exclusion",
      },
      {
        id: "paymentPlan",
        title: "Payment Plan",
      },
      {
        id: "docsRequired",
        title: "Documents Required",
      },
      {
        id: "cancellationPolicy",
        title: "Cancellation Policy",
      },
      {
        id: "termsAndConditions",
        title: "Terms And Conditions",
      },
    ]);
  }, [details]);

  const QuickView = () => {
    const timeDifference = Math.abs(details.endTime - details.startTime);

    // Convert milliseconds to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    let data = {
      id: "aboutTheLocation",
      title: "About the location",
      startTime: details.startTime,
      endTime: details.endTime,
      cities: details.cities,
      cost: details.cost,
      duration: daysDifference + " Days / " + (daysDifference - 1) + " Nights",
    };
    return (
      <View style={{ margin: "7%", marginBottom: 0, marginTop: "5%" }}>
        <View
          style={
            {
              // alignItems: "center",
              // justifyContent: "center",
            }
          }
        >
          <Text
            style={{
              backgroundColor: Colors.primary,
              padding: 4,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 10,
              fontSize: 26,
              color: Colors.white,
              textAlign: "center",
              marginBottom: "3%",
              fontWeight: "bold",
            }}
          >
            {details.title}
          </Text>
        </View>
        <RenderHTML
          source={{
            html: "<hr/>",
          }}
        />
        <View style={styles.quickViewItem}>
          <FontAwesomeIcon icon={faCalendarAlt} size={20} color={Colors.brown} />
          <Text style={{ fontSize: 18, textAlignVertical: "center" }}>
            {"  "}
            {loadOnlyDate(data.startTime)} - {loadOnlyDate(data.endTime)}
          </Text>
        </View>
        <View style={styles.quickViewItem}>
          <FontAwesomeIcon icon={faCloudSun} size={20} color={Colors.blue.blue} />
          <Text style={{ fontSize: 18, textAlignVertical: "center" }}>
            {"  "}
            {data.duration}
          </Text>
        </View>
        <View style={styles.quickViewItem}>
          <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color={Colors.red} />
          <Text
            style={{
              fontSize: 18,
              textAlignVertical: "center",
            }}
          >
            {"  "}
            {data.cities.join(" - ")}
          </Text>
        </View>
        <View style={styles.quickViewItem}>
          <FontAwesomeIcon icon={faMoneyBill} size={20} color={Colors.green} />
          <Text style={{ fontSize: 18, textAlignVertical: "center" }}>
            {"  "}₹ {data.cost}/- per person
          </Text>
        </View>
        <RenderHTML
          source={{
            html: "<hr/>",
          }}
        />
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
          color={Colors.black}
        />
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View style={styles.content}>
        <RenderHTML
          source={{
            html: item[section.id] + "<hr/>",
          }}
        />
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {item && <QuickView />}
        <Accordion
          containerStyle={styles.test}
          sections={sections}
          activeSections={activeSections}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
        />
      </ScrollView>
      {item && (
        <View style={{ margin: 15 }}>
          <Button
            outline
            style={{ backgroundColor: Colors.primary }}
            onPress={() => {
              let link = item.inquireNowLink;
              link = link.replace("${trip}", item.location);
              //console.log(link);
              return Linking.openURL(link);
            }}
          >
            <Text style={{ color: Colors.white, fontWeight: "bold" }}>
              Inquire Now
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  test: {
    //backgroundColor: "green",
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
    marginLeft: "2%",
    marginBottom: "2%",
    paddingTop: 0,
    marginTop: 0,
  },
  quickViewItem: {
    marginBottom: "3%",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
});
