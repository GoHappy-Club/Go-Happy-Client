import { Crown } from "lucide-react-native";
import React from "react";
import { Image } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";

const SilverCard = ({ identifier }) => {
  const profile = useSelector((state) => state.profile.profile);

  return (
    <LinearGradient
      colors={["#C0C0C0", "#E8E8E8", "#B8B8B8"]}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.nameContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
          }}
        >
          <FastImage
            style={styles.cover}
            resizeMode="cover"
            source={{
              uri: profile.profileImage,
            }}
          />
          <Text style={styles.name}>{profile.name}</Text>
          <Crown size={24} color={"#A9A9A9"} fill={"#A9A9A9"} />
        </View>
        <Text style={styles.phoneNumber}>
          XXXXX{profile?.phoneNumber?.substring(7, 12)}
        </Text>
      </View>
      <Text style={styles.identifier}>GoHappy Club</Text>
      <Text style={styles.membershipType}>Silver</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 180,
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-between",
  },
  nameContainer: {
    flexDirection: "column",
    gap: 10,
    position: "absolute",
    top: "60%",
    left: 15,
  },
  name: {
    color: "black",
    fontSize: 18,
    // fontWeight: "bold",
  },
  cover: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  identifier: {
    color: "black",
    fontSize: 20,
    // fontWeight: "bold",
    position: "absolute",
    right: 20,
    top: 10,
  },
  phoneNumber: {
    color: "black",
    fontSize: 16,
  },
  membershipType: {
    color: "black",
    fontSize: 28,
    fontWeight: "500",
    position: "absolute",
    right: 20,
    bottom: 10,
    textTransform: "uppercase",
  },
});

export default SilverCard;
