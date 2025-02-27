import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  ScrollView,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { Colors } from "../../assets/colors/color";
import { wp } from "../../helpers/common";
import { Copy, Share2 } from "lucide-react-native";
import ReferralSteps from "./ReferralSteps";

export default function ReferralScreen() {
  const referralLink = "https://gohappyclub.page.link/xmzd";

  const handleShare = async () => {};

  const copyToClipboard = () => {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.textStats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1000</Text>
            <Text style={styles.statLabel}>Rewards Earned</Text>
          </View>
        </View>
        <Image
          source={require("../../images/new_refer.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Refer and Earn!</Text>
        <Text style={styles.subtitle}>
          Members who refer 3 seniors (50+ of age) to GoHappy Club will receive
          exciting gifts at home!
        </Text>
        <ReferralSteps />

        <View style={styles.linkContainer}>
          <Text style={styles.linkLabel}>Share your referral link</Text>
          <TouchableOpacity style={styles.linkBox} onPress={copyToClipboard}>
            <Text style={styles.link} numberOfLines={1}>
              {referralLink}
            </Text>
            <TouchableOpacity onPress={copyToClipboard}>
              {/* <Text style={styles.copyIcon}>📋</Text> */}
              <Copy size={24} color={Colors.grey[4]} />
            </TouchableOpacity>
          </TouchableOpacity>
          <Text style={styles.shareHint}>
            Share via WhatsApp, Facebook, or groups
          </Text>
        </View>

        <TouchableOpacity style={styles.referButton} onPress={handleShare}>
          <Text style={styles.referButtonText}>Refer Now</Text>
          <Share2 size={24} color={Colors.grey[4]} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: Colors.beige,
    borderBottomRightRadius: wp(10),
    borderBottomLeftRadius: wp(10),
  },
  textStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    color: Colors.primaryText,
    fontFamily: "Montserrat-SemiBold",
    fontSize: wp(8),
  },
  statLabel: {
    fontSize: 14,
    color: Colors.greyishText,
  },
  illustration: {
    width: "100%",
    height: 200,
    marginVertical: 20,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: wp(6),
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primaryText,
    fontFamily: "Montserrat-SemiBold",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grey.countdown,
  },
  stepsContainer: {
    marginVertical: 24,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF9999",
    marginTop: 6,
    marginRight: 12,
  },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: "#FF9999",
    marginLeft: 5,
    marginVertical: -8,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
  },
  linkContainer: {
    marginVertical: wp(2),
  },
  linkLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  link: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  copyIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  shareHint: {
    fontSize: 12,
    color: "#999",
    fontFamily: "Poppins-Regular",
  },
  referButton: {
    backgroundColor: "#FFE4E4",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  referButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  shareIcon: {
    fontSize: 20,
  },
});
