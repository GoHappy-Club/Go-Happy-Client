import React, { useState, useRef, useMemo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  Keyboard,
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
  const loadDate = (item) => {
    const dt = fromUnixTime(item.startTime / 1000);
    const finalTime = format(dt, "MMM d, h:mm aa");
    return finalTime;
  };

  const trimContent = (text) => {
    if (text.length < 20) {
      return text;
    }
    return text.substring(0, 20) + "...";
  };
  return (
    <Pressable onPress={() => onPress(item)} style={styles.item}>
      <Image
        source={{ uri: item.coverImage }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.eventName}>{trimContent(item.eventName)}</Text>
        <Text style={styles.startTime}>{loadDate(item)}</Text>
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
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      inputRef.current.blur();
    } else {
      inputRef.current.focus();
    }
    Animated.timing(slideAnim, {
      toValue: isSearchActive ? -height : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSearch = async () => {
    Keyboard.dismiss;
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
          event.participantList?.includes(profile.phoneNumber);
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
            marginBottom: height * 0.025,
          },
        ]}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          editable={false}
          selectTextOnFocus={false}
        />
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
            selectTextOnFocus={true}
            returnKeyType="search"
            returnKeyLabel="search"
          />
          <TouchableOpacity
            style={{
              padding: 4,
              backgroundColor: Colors.primary,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleSearch}
          >
            <Text
              style={{
                color: Colors.white,
                fontWeight: "400",
                paddingLeft: "1%",
                paddingRight: "1%",
              }}
            >
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
                marginTop: height * 0.14,
                padding: width * 0.01,
              }}
              keyboardDismissMode="on-drag"
            />
          </>
        )}
      {isSearchActive && searchText == "" && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: height * 0.25,
            display: isSearchActive && searchText == "" ? "flex" : "none",
          }}
        >
          <Text
            style={{
              fontSize: height * 0.02,
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
            marginTop: height * 0.4,
            position: "absolute",
            top: "100%",
            left: "45%",
          }}
        >
          <MaterialIndicator color={Colors.primary} />
        </View>
      )}
      {isSearchActive &&
        !loading &&
        events &&
        Object.keys(events).length == 0 &&
        searchText != "" && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: height * 0.25,
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
    top: 15,
    zIndex: 1001,
  },
  searchInputContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: Colors.white,
    paddingTop: height * 0.07,
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.grey.f0,
    borderRadius: 20,
    paddingHorizontal: 15,
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
    right: 10,
    padding: 6,
    backgroundColor: Colors.grey.f0,
    borderRadius: 40,
  },
  item: {
    backgroundColor: Colors.primary,
    marginBottom: "2%",
    marginLeft: "2%",
    marginRight: "2%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  coverImage: {
    width: "100%",
    height: height * 0.2,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 5,
    objectFit: "cover",
  },
  textContainer: {
    padding: 4,
    paddingHorizontal: 10,
    gap: 2,
  },
  eventName: {
    fontSize: height * 0.025,
    color: Colors.white,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  startTime: {
    fontSize: height * 0.015,
    color: Colors.white,
    letterSpacing: 2,
  },
});

export default SearchBar;
