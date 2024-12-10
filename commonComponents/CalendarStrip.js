import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { wp } from "../helpers/common";
import { Colors } from "../assets/colors/color";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = wp(16) + 8;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DateCard = ({ date, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(date)}
      style={[styles.dateCard, isSelected && styles.selectedCard]}
    >
      <Text style={[styles.monthText, isSelected && styles.selectedText]}>
        {monthNames[date.getMonth()]}
      </Text>
      <Text style={[styles.dateText, isSelected && styles.selectedText]}>
        {date.getDate().toString().padStart(2, "0")}
      </Text>
    </TouchableOpacity>
  );
};

export default function CustomCalendarStrip({
  selectedDate,
  changeSelectedDate,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scrollViewRef = useRef(null);

  const generateDates = (startDate, count) => {
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const dates = generateDates(today, 14);

  const scrollToIndex = (index) => {
    const scrollPosition =
      index * CARD_WIDTH - (SCREEN_WIDTH / 2 - CARD_WIDTH / 2);
    scrollViewRef.current?.scrollTo({
      x: Math.max(0, scrollPosition),
      animated: true,
    });
  };

  const handlePrevious = () => {
    const currentIndex = dates.findIndex(
      (date) => date.getTime() === new Date(selectedDate).getTime()
    );
    if (currentIndex > 0) {
      changeSelectedDate(dates[currentIndex - 1].toISOString());
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    const currentIndex = dates.findIndex(
      (date) => date.getTime() === new Date(selectedDate).getTime()
    );
    if (currentIndex < dates.length - 1) {
      changeSelectedDate(dates[currentIndex + 1].toISOString());
      scrollToIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    const initialIndex = dates.findIndex(
      (date) => date.getTime() === new Date(selectedDate).getTime()
    );
    if (initialIndex !== -1) {
      scrollToIndex(initialIndex);
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        {selectedDate != dates[0].getTime() && (
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious} disabled={selectedDate == dates[0].getTime()}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
        )}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
        >
          {dates.map((date) => (
            <DateCard
              key={date.toISOString()}
              date={date}
              isSelected={date.getTime() === new Date(selectedDate).getTime()}
              onSelect={(date) => {
                changeSelectedDate(date.toISOString());
                const index = dates.findIndex(
                  (d) => d.getTime() === date.getTime()
                );
                scrollToIndex(index);
              }}
            />
          ))}
        </ScrollView>
        {selectedDate != dates[dates.length-1].getTime() &&<TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <ChevronRight size={24} color="#000" />
        </TouchableOpacity>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingVertical: wp(2),
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  dateCard: {
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    minWidth: wp(16),
  },
  selectedCard: {
    backgroundColor: Colors.primary,
  },
  monthText: {
    fontSize: wp(4),
    color: "#000",
    marginBottom: 4,
  },
  dateText: {
    fontSize: wp(4.2),
    color: "#000",
  },
  selectedText: {
    color: Colors.white,
  },
  navButton: {
    padding: 8,
  },
});
