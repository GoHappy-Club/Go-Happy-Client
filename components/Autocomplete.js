import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Colors } from "../assets/colors/color";
import { wp } from "../helpers/common";

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const AutocompleteCityInput = ({
  label,
  input,
  setInput,
  setSelectedFromDropdown,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [correlationId] = useState(uuidv4());
  const [isSelected, setIsSelected] = useState(false);
  const [dropdownHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    setIsSelected(true);
  }, []);

  const fetchSuggestions = useCallback(
    async (text) => {
      try {
        const requestId = uuidv4();
        const response = await fetch(
          `https://api.olamaps.io/places/v1/autocomplete?input=${text}&api_key=98HE0vBmKMbRFO9jhasJqFd1rEWZfiFIUjqe09mN`,
          {
            headers: {
              "X-Request-Id": requestId,
              "X-Correlation-Id": correlationId,
            },
          },
        );
        const data = await response.json();
        if (data.status === "ok") {
          const cities = Array.from(
            new Set(
              data.predictions
                .filter((prediction) => prediction.types.includes("locality"))
                .map((prediction) =>
                  prediction.structured_formatting.main_text.toLowerCase(),
                ),
            ),
          );
          if (text && !cities.includes(text.toLowerCase())) {
            cities.push(`${text.toLowerCase()}...`);
          }
          setSuggestions(cities);

          Animated.timing(dropdownHeight, {
            toValue: Math.min(cities.length * 40, 160),
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    },
    [correlationId, dropdownHeight],
  );

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [fetchSuggestions],
  );

  useEffect(() => {
    if (input?.length > 1 && !isSelected) {
      debouncedFetchSuggestions(input);
    } else {
      setSuggestions([]);
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [input, debouncedFetchSuggestions, isSelected]);

  const handleInputChange = (text) => {
    setInput(text);
    setIsSelected(false);
    setSelectedFromDropdown(false);
  };

  const handleSelection = (item) => {
    setInput((item.charAt(0).toUpperCase() + item.slice(1)).replace("...", ""));
    setIsSelected(true);
    setSelectedFromDropdown(true);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Animated.View
          style={[styles.suggestionsContainer, { height: dropdownHeight }]}
        >
          <FlatList
            data={suggestions}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.suggestion,
                  { backgroundColor: pressed ? "#E8E8E8" : "#FFF5E9" },
                ]}
                onPress={() => handleSelection(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        </Animated.View>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={handleInputChange}
          placeholder={"Enter your city here"}
          placeholderTextColor={Colors.grey[6]}
        />
      </View>
    </View>
  );
};

AutocompleteCityInput.propTypes = {
  label: PropTypes.string.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  setSelectedFromDropdown: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: wp(90),
  },
  label: {
    fontSize: 12,
    color: Colors.grey[6],
    marginBottom: 4,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    fontSize: wp(5.5),
    fontFamily: "Montserrat-Regular",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    color: "#000",
  },
  suggestionsContainer: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFF5E9",
    borderColor: "#DDD",
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
    zIndex: 1,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  suggestionText: {
    fontSize: 16,
    color: "#000",
  },
});

export default AutocompleteCityInput;
