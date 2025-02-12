import React, { useState, useRef, useMemo, useEffect } from "react";
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
  Platform,
} from "react-native";
import { Clock, SearchIcon, X } from "lucide-react-native";
import { Pressable } from "react-native";
import { Colors } from "../../assets/colors/color";
import { format, fromUnixTime, getUnixTime, startOfDay } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MaterialIndicator } from "react-native-indicators";
import { debounce } from "lodash";
import { Avatar, Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";

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
      <FastImage
        source={{ uri: item.coverImage }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.eventName}>{trimContent(item.eventName)}</Text>
        <Text style={styles.startTime}>{loadDate(item)}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FastImage
            source={
              item.expertImage
                ? {
                    uri: item.expertImage,
                  }
                : require("../../images/profile_image.jpeg")
            }
            style={{ width: 30, height: 30, borderRadius: 20 }}
            resizeMode="cover"
          />
          <Title
            style={{ color: Colors.primaryText, fontSize: 13, paddingLeft: 10 }}
          >
            {trimContent(item.expertName, 17)}
          </Title>
        </View>
      </View>
    </Pressable>
  );
};

const SearchBar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const profile = useSelector((state) => state.profile.profile);

  const navigation = useNavigation();

  const inputRef = useRef(null);

  const slideAnim = useRef(new Animated.Value(-height)).current;

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    const listener = navigation.addListener("blur", () => {
      if (isSearchActive) {
        toggleSearch();
      }
    });
    return () => navigation.removeListener(listener);
  }, [isSearchActive]);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem("recent_searches");
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearch = async (search) => {
    if (search?.length < 4) return;
    try {
      setRecentSearches((prevSearches) => {
        const searches = [...prevSearches];
        const filteredSearches = searches.filter((item) => item !== search);
        filteredSearches.unshift(search);
        const trimmedSearches = filteredSearches.slice(0, 3);
        AsyncStorage.setItem(
          "recent_searches",
          JSON.stringify(trimmedSearches)
        ).catch((error) =>
          console.error("Error saving to AsyncStorage:", error)
        );

        return trimmedSearches;
      });
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const toggleSearch = () => {
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
    setIsSearchActive(!isSearchActive);
  };

  const handleSearch = async (text) => {
    if (!text.trim()) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(
        `${SERVER_URL}/event/searchEvents?inputSearch=${text}`
      );
      setEvents(response.data);
      // Save to recent searches only if the search was successful
      await saveRecentSearch(text);
    } catch (error) {
      console.log(error);
      setError(true);
      crashlytics().log(`Error in searching events ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useRef(
    debounce((text) => handleSearch(text), 500)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleRecentSearchPress = (search) => {
    setSearchText(search);
    debouncedSearch(search);
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

  const RecentSearches = () => (
    <View style={styles.recentSearchesContainer}>
      <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
      {recentSearches.map((search, index) => (
        <TouchableOpacity
          key={index}
          style={styles.recentSearchItem}
          onPress={() => handleRecentSearchPress(search)}
        >
          <Clock size={16} color={Colors.grey.grey} />
          <Text style={styles.recentSearchText}>{search}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
            backgroundColor: Colors.background,
            borderRadius: 40,
            borderWidth: 1,
            paddingHorizontal: 15,
            marginBottom: height * 0.025,
            paddingVertical: Platform.OS === "ios" ? wp(1) : 0,
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
            placeholderTextColor={Colors.grey.grey}
            placeholder="Search for Experts or Event names"
            value={searchText}
            onChangeText={handleSearchTextChange}
            returnKeyType="search"
            returnKeyLabel="search"
          />
        </View>
        <TouchableOpacity onPress={toggleSearch} style={styles.closeButton}>
          <X color="#000" size={24} />
        </TouchableOpacity>
      </Animated.View>
      {isSearchActive &&
        !loading &&
        searchText != "" &&
        // events &&
        Object.keys(events).length >= 0 && (
          <>
            <FlatList
              data={events}
              renderItem={(item) => (
                <Item item={item.item} onPress={handleClick} />
              )}
              ItemSeparatorComponent={<View style={{ margin: 4 }} />}
              style={{
                marginTop: height * 0.15,
                padding: width * 0.01,
              }}
              keyboardDismissMode="on-drag"
            />
          </>
        )}
      {isSearchActive && !searchText && recentSearches.length > 0 && (
        <RecentSearches />
      )}
      {isSearchActive && !searchText && recentSearches.length == 0 && (
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            marginTop: height * 0.2,
          }}
        >
          Please type what you're looking for above.
        </Text>
      )}
      {isSearchActive && loading && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: height * 0.4,
          }}
        >
          <MaterialIndicator color={Colors.primary} />
        </View>
      )}
      {isSearchActive &&
        !loading &&
        events &&
        Object.keys(events).length == 0 &&
        searchText?.length > 1 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: height * 0.25,
              position: "absolute",
            }}
          >
            <FastImage
              source={require("../../images/noSearchResult.png")}
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
    paddingTop: height * 0.07,
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 20,
    borderColor: Colors.black,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  searchBarIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 16,
    width: "90%",
    padding: width * 0.01,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: Colors.grey.f0,
    borderRadius: 40,
  },
  recentSearchesContainer: {
    width: width,
    marginTop: height * 0.15,
    padding: 16,
    backgroundColor: Colors.background,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.grey[700],
    marginBottom: 12,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  recentSearchText: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.grey[600],
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
    color: Colors.primaryText,
    letterSpacing: 2,
    fontWeight: "bold",
  },
  startTime: {
    fontSize: height * 0.015,
    color: Colors.primaryText,
    letterSpacing: 2,
  },
});

export default SearchBar;
