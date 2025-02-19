"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { games } from "./games"
import { useNavigation } from "@react-navigation/native"
import { Colors } from "../../assets/colors/color"
import { hp } from "../../helpers/common"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.8

export default function FunZone() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigation = useNavigation()

  const categories = ["all", "board", "arcade", "puzzle"]

  const filteredGames = selectedCategory === "all" ? games : games.filter((game) => game.category === selectedCategory)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#4CAF50"
      case "medium":
        return "#FFC107"
      case "hard":
        return "#FF5252"
      default:
        return "#4CAF50"
    }
  }

  const handlePlay = (url, name) => {
    navigation.navigate("Game", { gameUrl: url, name })
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Fun Zone</Text>
        <Text style={styles.subtitle}>Choose your adventure!</Text>
      </View>

      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gamesContainer}>
        {filteredGames.map((game) => (
          <TouchableOpacity key={game.id} style={styles.gameCard}>
            <Image source={{ uri: game.imageUrl }} style={styles.gameImage} />
            <View style={styles.gameInfo}>
              <View style={styles.gameHeader}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) }]}>
                  <Text style={styles.difficultyText}>{game.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.gameDescription}>{game.description}</Text>
              <View style={styles.gameFooter}>
                <View style={styles.playersContainer}>
                  <Ionicons name="people" size={16} color="#FFF" />
                  <Text style={styles.playersText}>{game.players} Players</Text>
                </View>
                <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(game.gameUrl, game.title)}>
                  <Text style={styles.playButtonText}>Play Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    height: hp(100),
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
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
  header: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFF",
    opacity: 0.8,
  },
  categoryWrapper: {
    marginTop: 20,
    marginBottom: 10,
  },
  categoryContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryButtonActive: {
    backgroundColor: "#FF6B6B",
  },
  categoryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#FFF",
  },
  gamesContainer: {
    padding: 15,
    gap: 20,
  },
  gameCard: {
    width: CARD_WIDTH,
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
  },
  gameImage: {
    width: "100%",
    height: "100%",
  },
  gameInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  gameDescription: {
    color: "#FFF",
    opacity: 0.8,
    marginBottom: 12,
    fontSize: 14,
  },
  gameFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  playersText: {
    color: "#FFF",
    fontSize: 14,
  },
  playButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  playButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
})

