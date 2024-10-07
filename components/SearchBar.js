import React, { useState, useRef, useMemo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { SearchIcon, X } from "lucide-react-native";
import { Pressable } from "react-native";
import { Colors } from "../assets/colors/color";
import { format, fromUnixTime, getUnixTime, startOfDay } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MaterialIndicator } from "react-native-indicators";

const { width, height } = Dimensions.get("window");

const Item = ({ item, onPress }) => {
  const formatDate = (startTime) => {
    const dt = fromUnixTime(startTime / 1000);
    const finalTime = format(dt, "MMM d, h:mm aa");
    return finalTime;
  };

  return (
    <Pressable onPress={() => onPress(item)} style={styles.item}>
      <Image
        source={{ uri: item.coverImage }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.startTime}>{formatDate(item.startTime)}</Text>
      </View>
    </Pressable>
  );
};

const SearchBar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const profile = useSelector((state) => state.profile.profile);

  const navigation = useNavigation();

  const inputRef = useRef(null);

  const slideAnim = useRef(new Animated.Value(-height)).current;

  const toggleSearch = () => {
    if (isSearchActive) {
      inputRef.current.blur();
    } else {
      inputRef.current.focus();
    }
    setIsSearchActive(!isSearchActive);
    Animated.timing(slideAnim, {
      toValue: isSearchActive ? -height : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSearch = async () => {
    inputRef.current.blur();
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(
        `${SERVER_URL}/event/searchEvents?inputSearch=${searchText}`
      );
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  const comeBack = () => {
    navigation.navigate("HomeScreen");
    handleSearch();
  };

  const handleClick = (item) => {
    navigation.navigate("Session Details", {
      phoneNumber: profile.phoneNumber,
      profile: profile,
      deepId: item.id,
      onGoBack: () => comeBack(),
      alreadyBookedSameDayEvent: checkIsParticipantInSameEvent(item),
    });
  };

  const checkIsParticipantInSameEvent = (item) => {
    let isParticipantInSameEvent = false;
    if (item.sameDayEventId === null) {
      return false;
    }
    events.map((event) => {
      if (
        getUnixTime(startOfDay(fromUnixTime(event.eventDate / 1000))) ==
          getUnixTime(startOfDay(fromUnixTime(item.eventDate / 1000))) &&
        !isParticipantInSameEvent
      ) {
        isParticipantInSameEvent =
          event.startTime != item.startTime &&
          event.sameDayEventId == item.sameDayEventId &&
          event.participantList.includes(profile.phoneNumber);
      }
    });
    return isParticipantInSameEvent;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleSearch}
        style={[
          styles.searchIcon,
          {
            display: isSearchActive ? "none" : "flex",
            width: width * 0.9,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.white,
            borderRadius: 40,
            paddingHorizontal: 15,
            marginBottom: 20,
          },
        ]}
      >
        <TextInput style={styles.searchInput} placeholder="Search..." editable={false} selectTextOnFocus={false} />
        <SearchIcon color="#000" size={30} />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.searchInputContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.searchBar}>
          <SearchIcon color="#000" size={24} style={styles.searchBarIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            style={{
              padding: 4,
              backgroundColor: Colors.pink.pink,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleSearch}
          >
            <Text style={{ color: Colors.greyishText, fontWeight: "bold" }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleSearch} style={styles.closeButton}>
          <X color="#000" size={24} />
        </TouchableOpacity>
      </Animated.View>
      {isSearchActive &&
        !loading &&
        searchText != "" &&
        events &&
        Object.keys(events).length >= 0 && (
          <>
            <FlatList
              data={events}
              renderItem={(item) => (
                <Item item={item.item} onPress={handleClick} />
              )}
              ItemSeparatorComponent={<View style={{ margin: 4 }} />}
              style={{
                marginTop: 2 * StatusBar.currentHeight,
                paddingHorizontal: 10,
              }}
            />
          </>
        )}
      {isSearchActive && searchText == "" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 3 * StatusBar.currentHeight,
            display: isSearchActive && searchText == "" ? "flex" : "none",
          }}
        >
          <Text
            style={{
              fontSize: height * 0.03,
              textAlign: "center",
              width: width * 0.8,
            }}
          >
            Kindly type what you're looking for in the search bar to get your
            results.
          </Text>
          <Image
            source={require("../images/eventSearchEmpty.png")}
            resizeMode="cover"
            style={{
              width: width,
              height: height * 0.4,
            }}
          />
        </View>
      )}
      {isSearchActive && loading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5 * StatusBar.currentHeight,
            position: "absolute",
            top: "100%",
            left: "45%",
          }}
        >
          <MaterialIndicator color={Colors.primary} />
        </View>
      )}
      {isSearchActive &&
        events &&
        Object.keys(events).length == 0 &&
        searchText != "" && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 3 * StatusBar.currentHeight,
              // display: events && Object.keys(events).length == 0 && searchText != "" ? "flex" : "none",
              position: "absolute",
            }}
          >
            <Image
              source={require("../images/noSearchResult.png")}
              resizeMode="cover"
              style={{
                width: width,
                height: height * 0.4,
                objectFit: "cover",
              }}
            />
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "center",
  },
  searchIcon: {
    top: 10,
    zIndex: 1001,
  },
  searchInputContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: Colors.white,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.grey.f0,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchBarIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    padding: 6,
    backgroundColor: Colors.grey.f0,
    borderRadius: 40,
  },
  item: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coverImage: {
    width: "100%",
    height: height * 0.25,
    borderRadius: 20,
    marginBottom: 10,
    objectFit: "cover",
  },
  textContainer: {
    padding: 4,
    gap: 2,
  },
  eventName: {
    fontSize: height * 0.025,
    color: Colors.black,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  startTime: {
    fontSize: height * 0.015,
    color: Colors.black,
    letterSpacing: 2,
  },
});

export default SearchBar;
