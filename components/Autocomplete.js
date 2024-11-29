import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import debounce from "lodash.debounce";
import { OLA_API_KEY } from "@env";

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const AutocompleteCityInput = ({ input, setInput, color = "white" }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [correlationId] = useState(uuidv4());

  const fetchSuggestions = useCallback(
    async (text) => {
      try {
        const requestId = uuidv4();
        const response = await fetch(
          `https://api.olamaps.io/places/v1/autocomplete?input=${text}&api_key=${OLA_API_KEY}`,
          {
            headers: {
              "X-Request-Id": requestId,
              "X-Correlation-Id": correlationId,
            },
          }
        );
        const data = await response.json();
        if (data.status === "ok") {
          const cities = Array.from(
            new Set(
              data.predictions
                .filter((prediction) => prediction.types.includes("locality"))
                .map((prediction) =>
                  prediction.structured_formatting.main_text.toLowerCase()
                )
            )
          );
          setSuggestions(cities);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    },
    [correlationId]
  );

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  useEffect(() => {
    if (input?.length > 2) {
      debouncedFetchSuggestions(input);
    } else {
      setSuggestions([]);
    }
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [input, debouncedFetchSuggestions]);

  const handleInputChange = (text) => {
    setInput(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { backgroundColor: color }]}
        placeholder="Enter city name"
        value={input}
        onChangeText={handleInputChange}
      />
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <Text
            style={[styles.suggestion, { backgroundColor: color }]}
            onPress={() => {
              setInput(item);
              setSuggestions([]);
            }}
          >
            {item}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%"
    // backgroundColor: "#fffaf1",
  },
  input: {
    fontSize: 18,
    color: "black",
    marginTop: "5%",
    alignSelf: "center",
    paddingLeft: 15,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    width: "70%",
  },
  suggestion: {
    fontSize: 18,
    color: "black",
    alignSelf: "center",
    paddingLeft: 15,
    borderColor: "black",
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    width: "70%",
  },
});

export default AutocompleteCityInput;
