import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { ChevronLeft, Users, Calendar, BookOpen } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../assets/colors/color";

const LEADERBOARD_TYPES = [
  {
    id: "refer",
    title: "Refer Leaderboard",
    description: "See who's bringing in the most referrals",
    icon: Users,
  },
  {
    id: "sessions",
    title: "Sessions Leaderboard",
    description: "Track top performers in sessions",
    icon: Calendar,
  },
  {
    id: "workshops",
    title: "Workshops Leaderboard",
    description: "View workshop participation leaders",
    icon: BookOpen,
  },
];

export default function LeaderboardTypeSelection({ type, setType }) {
  const navigation = useNavigation();

  const handleTypeSelect = (type) => {
    setType(type);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Leaderboard</Text>
        {/* <View style={{ width: 40 }} /> */}
      </View>

      <View style={styles.cardsContainer}>
        {LEADERBOARD_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <Pressable
              key={type.id}
              style={styles.card}
              onPress={() => handleTypeSelect(type.id)}
            >
              <View style={styles.iconContainer}>
                <Icon size={24} color="#1A1A1A" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{type.title}</Text>
                <Text style={styles.cardDescription}>{type.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
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
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontSize: 14,
    color: "#1A1A1A",
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE6E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
});
