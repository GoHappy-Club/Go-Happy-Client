import React, { useRef, useEffect, useMemo } from "react";
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
  Quote,
  Video,
  Crown,
  Star,
  Shield,
  Headphones,
  Clock,
  Calendar,
  Mail,
  Phone,
  Users,
  Zap,
  CircleX,
} from "lucide-react-native";
import SubscriptionCard from "../../components/subscription/SubscriptionCard";
import { wp } from "../../helpers/common";
import { Colors } from "../../assets/colors/color";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const membershipTiers = {
  silver: {
    id: "silver",
    name: "Silver",
    color: Colors.black,
    privileges: [
      {
        id: 1,
        icon: Gift,
        label: "Basic Rewards",
      },
      {
        id: 2,
        icon: Quote,
        label: "Standard Quotes",
      },
      {
        id: 3,
        icon: Video,
        label: "Video Library",
      },
      {
        id: 4,
        icon: Clock,
        label: "24/7 Support",
      },
    ],
  },
  gold: {
    id: "gold",
    name: "Gold",
    color: "#FFD700",
    privileges: [
      {
        id: 1,
        icon: Gift,
        label: "Enhanced Rewards",
      },
      {
        id: 2,
        icon: Quote,
        label: "Premium Quotes",
      },
      {
        id: 3,
        icon: Video,
        label: "Premium Content",
      },
      {
        id: 4,
        icon: Clock,
        label: "Priority Support",
      },
      {
        id: 5,
        icon: Star,
        label: "Special Events",
      },
      {
        id: 6,
        icon: Calendar,
        label: "Early Access",
      },
    ],
  },
  platinum: {
    id: "platinum",
    name: "Platinum",
    color: "#E5E4E2",
    privileges: [
      {
        id: 1,
        icon: Crown,
        label: "VIP Rewards",
      },
      {
        id: 2,
        icon: Quote,
        label: "Custom Quotes",
      },
      {
        id: 3,
        icon: Video,
        label: "Exclusive Content",
      },
      {
        id: 4,
        icon: Shield,
        label: "Concierge Support",
      },
      {
        id: 5,
        icon: Star,
        label: "VIP Events",
      },
      {
        id: 6,
        icon: Calendar,
        label: "First Access",
      },
      {
        id: 7,
        icon: Phone,
        label: "Direct Line",
      },
      {
        id: 8,
        icon: Users,
        label: "Network Access",
      },
    ],
  },
};

const PRIVILEGE_ITEM_WIDTH = 112;

export default function MembershipDetails() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const membership = useSelector((state) => state.membership.membership);
  console.log(membership);

  const membershipType = membership.membershipType?.toLowerCase();

  const navigation = useNavigation();

  const currentPrivileges =
    membershipTiers[membershipType]?.privileges ||
    membershipTiers.silver.privileges;
  const PRIVILEGES_CONTAINER_WIDTH =
    currentPrivileges.length * PRIVILEGE_ITEM_WIDTH;

  useEffect(() => {
    scrollX.setValue(0);
    const scrollAnimation = Animated.timing(scrollX, {
      toValue: -PRIVILEGES_CONTAINER_WIDTH,
      duration: 9000,
      useNativeDriver: true,
      isInteraction: false,
    });

    Animated.loop(scrollAnimation).start();
  }, []);

  const upgradeOptions = useMemo(
    () => [
      {
        id: 1,
        title: "Upgrade Membership",
        icon: Zap,
        onPress: () => navigation.navigate("SubscriptionPlans"),
      },
      {
        id: 3,
        title: "Renew Membership",
        icon: Star,
        onPress: () =>
          navigation.navigate("SubscriptionPlans", {
            renew: true,
          }),
      },
      { id: 2, title: "Cancel Membership", icon: CircleX },
    ],
    [navigation]
  );

  const renderPrivileges = (membershipLevel) => {
    console.log(membershipLevel);

    const privileges = membershipTiers[membershipLevel].privileges;

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
        {[...privileges, ...privileges, ...privileges].map((item, index) => (
          <View
            key={`${item.id}-${index}`}
            style={[
              styles.privilegeItem,
              { borderColor: membershipTiers[membershipLevel].color },
            ]}
          >
            <item.icon
              color={membershipTiers[membershipLevel].color}
              size={24}
            />
            <Text
              style={[
                styles.privilegeLabel,
                { color: membershipTiers[membershipLevel].color },
              ]}
            >
              {item.label}
            </Text>
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
        {renderPrivileges(membershipType)}
      </View>

      {upgradeOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.upgradeButton}
          onPress={option.onPress}
        >
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
    marginVertical: 24,
    overflow: "hidden",
  },
  privilegesContent: {
    flexDirection: "row",
  },
  privilegeItem: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 16,
    width: PRIVILEGE_ITEM_WIDTH,
    marginRight: 12,
  },
  privilegeLabel: {
    color: Colors.black,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  privilegeDescription: {
    color: Colors.black,
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
    opacity: 0.7,
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
