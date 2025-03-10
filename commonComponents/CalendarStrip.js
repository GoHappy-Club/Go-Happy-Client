import { ChevronLeft, ChevronRight } from "lucide-react-native";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "../assets/colors/color";
import { wp } from "../helpers/common";

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
const weekDays = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
};

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
      <Text style={[styles.dayText, isSelected && styles.selectedText]}>
        {weekDays[date.getDay()]}
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
      (date) => date.getTime() === new Date(selectedDate).getTime(),
    );
    if (currentIndex > 0) {
      changeSelectedDate(dates[currentIndex - 1].toISOString());
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    const currentIndex = dates.findIndex(
      (date) => date.getTime() === new Date(selectedDate).getTime(),
    );
    if (currentIndex < dates.length - 1) {
      changeSelectedDate(dates[currentIndex + 1].toISOString());
      scrollToIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    const initialIndex = dates.findIndex(
      (date) => date.getTime() === new Date(selectedDate).getTime(),
    );
    if (initialIndex !== -1) {
      scrollToIndex(initialIndex);
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        {/* {selectedDate != dates[0].getTime() && ( */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePrevious}
          disabled={selectedDate == dates[0].getTime()}
        >
          <ChevronLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        {/* )} */}
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
                  (d) => d.getTime() === date.getTime(),
                );
                scrollToIndex(index);
              }}
            />
          ))}
        </ScrollView>
        {/* {selectedDate != dates[dates.length - 1].getTime() && ( */}
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <ChevronRight size={24} color={Colors.black} />
        </TouchableOpacity>
        {/* )} */}
      </View>
    </View>
  );
}

CustomCalendarStrip.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  changeSelectedDate: PropTypes.func.isRequired,
};
DateCard.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

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
    padding: 4,
  },
  selectedCard: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderColor: Colors.black,
    borderWidth: 1,
  },
  monthText: {
    fontSize: wp(3.8),
    color: Colors.primaryText,
    // marginBottom: 4,
  },
  dateText: {
    fontSize: wp(4),
    color: Colors.primaryText,
  },
  dayText: {
    fontSize: wp(3),
    color: Colors.primaryText,
  },
  selectedText: {
    color: Colors.black,
  },
  navButton: {
    padding: 8,
  },
});
