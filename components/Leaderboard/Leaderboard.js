import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Crown,
  Ellipsis,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import { Colors } from "../../assets/colors/color";
import { useNavigation } from "@react-navigation/native";
import { wp } from "../../helpers/common";
import FastImage from "react-native-fast-image";

const MOCK_DATA = {
  topUsers: [
    {
      id: "1",
      name: "Mehul",
      score: 2430,
      username: "@mehul",
      avatar:
        "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?w=2560",
      position: 2,
    },
    {
      id: "2",
      name: "Mehul",
      score: 2430,
      username: "@mehul",
      avatar:
        "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?w=2560",
      position: 1,
    },
    {
      id: "3",
      name: "Mehul",
      score: 2430,
      username: "@mehul",
      avatar:
        "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?w=2560",
      position: 3,
    },
  ],
  otherUsers: [
    {
      id: "4",

      name: "Mehul",
      score: 2430,
      username: "@mehul",
      avatar:
        "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?w=2560",
      trending: "up",
    },
    {
      id: "5",

      name: "Mehul",
      score: 2430,
      username: "@mehul",
      avatar:
        "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?w=2560",
      trending: "down",
    },
    {
      id: "6",

      name: "Mehul",
      score: 2430,
      username: "@mehul",
      avatar:
        "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?w=2560",
      trending: "up",
    },
    {
      id: "7",

      name: "Mehul",
      score: 2430,
      username: "@mehul",
      avatar:
        "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?w=2560",
      trending: "up",
    },
    {
      id: "8",

      name: "Mehul",
      score: 2430,
      username: "@mehul",
      avatar:
        "https://www.rd.com/wp-content/uploads/2019/09/GettyImages-621924830-scaled.jpg?w=2560",
      trending: "down",
    },
  ],
};

function LeaderboardTabs() {
  const [activeTab, setActiveTab] = React.useState("Weekly");
  const tabs = ["Weekly", "Monthly"];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function TopThree() {
  return (
    <View style={styles.topThreeContainer}>
      {MOCK_DATA.topUsers.map((user) => {
        const isWinner = user.position === 1;
        const isRunnerUp = user.position === 2 || user.position === 3;

        return (
          <View
            key={user.id}
            style={[
              styles.topUserContainer,
              isWinner && styles.winnerContainer,
              isRunnerUp && styles.runnerUpContainer,
            ]}
          >
            <View style={styles.avatarContainer}>
              {isWinner && (
                <View style={styles.crownContainer}>
                  <Crown size={32} color="#FFD700" />
                </View>
              )}
              <FastImage
                source={{ uri: user.avatar }}
                style={[
                  styles.topUserAvatar,
                  isWinner && styles.winnerAvatar,
                  isRunnerUp && styles.runnerUpAvatar,
                ]}
              />
            </View>
            <Text style={styles.topUserName}>{user.name}</Text>
            <Text style={[styles.topUserScore, isWinner && styles.winnerScore]}>
              {user.score}
            </Text>
            <Text style={styles.username}>{user.username}</Text>
          </View>
        );
      })}
    </View>
  );
}

function LeaderboardList() {
  return (
    <View style={styles.listContainer}>
      {MOCK_DATA.otherUsers.map((user) => (
        <View key={user.id} style={styles.listItem}>
          <Image source={{ uri: user.avatar }} style={styles.listAvatar} />
          <View style={styles.listUserInfo}>
            <Text style={styles.listName}>{user.name}</Text>
            <Text style={styles.listUsername}>{user.username}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.listScore}>{user.score}</Text>
            {/* {user.trending === "up" ? (
              <TrendingUp size={24} color={Colors.green} />
            ) : (
              <TrendingDown size={24} color={Colors.red} />
            )} */}
          </View>
        </View>
      ))}
    </View>
  );
}

export default function Leaderboard({ type, setType }) {
  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              setType("");
            }}
          >
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.title}>Workshops Leaderboard</Text>
          {/* <Pressable style={styles.menuButton}>
            <Ellipsis size={24} color="#1A1A1A" />
          </Pressable> */}
        </View>
        <LeaderboardTabs />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <TopThree />
          <LeaderboardList />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap:18
  },
  backButton: {
    padding: 4,
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    elevation: 10,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.3,
  },
  backText: {
    fontSize: wp(3.5),
    color: Colors.primaryText,
  },
  title: {
    fontSize: wp(5),
    fontWeight: "600",
    color: "#1A1A1A",
  },
  menuButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: "#FFF",
  },
  tabText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#1A1A1A",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: wp(8),
    marginTop: wp(4),
  },
  topUserContainer: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  winnerContainer: {
    marginTop: -30,
  },
  runnerUpContainer: {
    marginTop: 10,
  },
  topUserAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#FFE6E6",
  },
  winnerAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  runnerUpAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  crownContainer: {
    position: "absolute",
    bottom: -10,
    left: "50%",
    transform: [{ translateX: -16 }],
    zIndex: 1,
    backgroundColor: "#FFF",
    padding: 3,
    borderRadius: 100,
  },
  topUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 8,
  },
  topUserScore: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginTop: 4,
  },
  winnerScore: {
    color: "#FFD700",
    fontSize: 18,
  },
  username: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  listUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  listUsername: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listScore: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginRight: 4,
  },
});
