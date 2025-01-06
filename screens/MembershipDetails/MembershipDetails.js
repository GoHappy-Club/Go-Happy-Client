import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import {
  Gift,
  Video,
  Zap,
  Star,
  Quote,
  CircleX,
} from "lucide-react-native";
import SubscriptionCard from "../../components/subscription/SubscriptionCard";
import { wp } from "../../helpers/common";
import { Colors } from "../../assets/colors/color";

const privileges = [
  { id: 1, icon: Gift, label: "Rewards" },
  { id: 2, icon: Quote, label: "Quotes" },
  { id: 3, icon: Video, label: "Videos" },
];

const upgradeOptions = [
  { id: 1, title: "Upgrade Membership", icon: Zap },
  { id: 3, title: "Renew Membership", icon: Star },
  { id: 2, title: "Cancel Membership", icon: CircleX },
];

const PRIVILEGE_ITEM_WIDTH = 112;
const PRIVILEGES_CONTAINER_WIDTH = privileges.length * PRIVILEGE_ITEM_WIDTH;

export default function MembershipDetails() {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scrollAnimation = Animated.timing(scrollX, {
      toValue: -PRIVILEGES_CONTAINER_WIDTH,
      duration: 9000,
      useNativeDriver: true,
      isInteraction: false,
    });

    Animated.loop(scrollAnimation).start();
  }, []);

  const renderPrivileges = () => {
    return (
      <Animated.View
        style={[
          styles.privilegesContent,
          {
            transform: [{ translateX: scrollX }],
            width: PRIVILEGES_CONTAINER_WIDTH * 2,
          },
        ]}
      >
        {[...privileges, ...privileges,...privileges].map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.privilegeItem}>
            <item.icon color={Colors.black} size={24} />
            <Text style={styles.privilegeLabel}>{item.label}</Text>
          </View>
        ))}
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subscriptionContainer}>
        <SubscriptionCard />
      </View>

      <View style={styles.privilegeTitle}>
        <Text style={styles.headerTitle}>Privileges :</Text>
      </View>

      <View style={styles.privilegesContainer}>
        {renderPrivileges()}
      </View>

      {upgradeOptions.map((option) => (
        <TouchableOpacity key={option.id} style={styles.upgradeButton}>
          <option.icon
            color={Colors.black}
            size={20}
            style={styles.upgradeIcon}
          />
          <Text style={styles.upgradeText}>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subscriptionContainer: {
    paddingHorizontal: wp(7),
    width: "100%",
  },
  privilegeTitle: {
    paddingHorizontal: wp(7),
    width: "100%",
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },
  privilegesContainer: {
    height: 120,
    marginTop: 24,
    overflow: 'hidden',
  },
  privilegesContent: {
    flexDirection: 'row',
  },
  privilegeItem: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 16,
    width: 100,
    marginRight: 12,
  },
  privilegeLabel: {
    color: Colors.black,
    marginTop: 8,
    fontSize: 12,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  upgradeIcon: {
    marginRight: 12,
  },
  upgradeText: {
    color: Colors.black,
    fontSize: 16,
  },
});

