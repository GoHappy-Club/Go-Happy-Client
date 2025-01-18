import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Colors } from "../../assets/colors/color";
import i18n from "../../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const languages = [
  { name: "English", code: "en" },
  { name: "Hindi", code: "hi" },
];

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const getLanguage = async () => {
      const lang = await AsyncStorage.getItem("@lang");
      console.log("Lang, ", lang);
      
      if (lang) {
        setSelectedLanguage(lang);
      }
    };
    getLanguage();
  }, []);

  const handleChange = async (code) => {
    setSelectedLanguage(code);
    i18n.changeLanguage(code);
    await AsyncStorage.setItem("@lang", code);
  };

  const renderLanguageCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        selectedLanguage === item.code && styles.selectedCard,
      ]}
      onPress={() => handleChange(item.code)}
    >
      <View style={styles.radioButton}>
        {selectedLanguage === item.code && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
      <Text style={styles.languageName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        renderItem={renderLanguageCard}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.95,
    alignSelf: "center",
  },
  selectedCard: {
    backgroundColor: Colors.bottomNavigation,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.black,
  },
  languageName: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default Language;
