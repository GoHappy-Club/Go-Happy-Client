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
import { format, fromUnixTime } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const Item = ({ item, onPress }) => {
  const formatDate = (startTime) => {
    const dt = fromUnixTime(startTime / 1000);
    const finalTime = format(dt, "MMM d, h:mm aa");
    return finalTime;
  };

  return (
    <Pressable onPress={() => onPress(item)} style={styles.item}>
      <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
      <View style={styles.textContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.startTime}>{formatDate(item.startTime)}</Text>
      </View>
    </Pressable>
  );
};

const SearchBar = ({ loadCaller, checkIsParticipantInSameEvent }) => {
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

  const handleClick = (item) => {
    navigation.navigate("Session Details", {
      phoneNumber: profile.phoneNumber,
      profile: profile,
      deepId: item.id,
      onGoBack: () => loadCaller(),
      alreadyBookedSameDayEvent: checkIsParticipantInSameEvent(item),
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleSearch}
        style={[
          styles.searchIcon,
          { display: isSearchActive ? "none" : "flex" },
        ]}
      >
        <SearchIcon color="#000" size={24} />
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
              backgroundColor: Colors.primary,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleSearch}
          >
            <Text style={{ color: "#fff" }}>Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleSearch} style={styles.closeButton}>
          <X color="#000" size={24} />
        </TouchableOpacity>
      </Animated.View>
      {isSearchActive &&
        (searchText != "" ? (
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
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2 * StatusBar.currentHeight,
            }}
          >
            <Text>Enter something above first.</Text>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  searchIcon: {
    position: "relative",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1001,
  },
  searchInputContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
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
    backgroundColor: Colors.grey.grey,
    borderRadius: 40,
  },
  item: {
    backgroundColor: Colors.grey.countdown,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coverImage: {
    width: "100%",
    height: height * 0.2,
    borderRadius: 20,
    marginBottom: 10,
    objectFit: "cover",
  },
  textContainer: {},
  eventName: {
    fontSize: height * 0.025,
    color: "white",
    letterSpacing: 2,
    fontWeight: "bold",
  },
  startTime: {
    fontSize: height * 0.015,
    color: "white",
    letterSpacing: 2,
    fontWeight: "bold",
  },
});

export default SearchBar;
