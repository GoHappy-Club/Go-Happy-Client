import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faWallet, faCrown } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { Colors } from "../assets/colors/color";
import { useSelector } from "react-redux";
import GradientText from "../commonComponents/GradientText";
import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get("window").width;

const Header = () => {
  const profile = useSelector((state) => state.profile.profile);
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate("MyProfile");
  };

  return (
    <View style={styles.header}>
      <Pressable style={styles.userInfo} onPress={handleNavigate}>
        <Image
          source={{
            uri: profile.profileImage,
            height: 40,
            width: 40,
          }}
          resizeMethod="resize"
          resizeMode="cover"
          style={styles.profileImage}
        />
        <Text style={styles.username} adjustsFontSizeToFit={true}>Hello {profile.name}</Text>
      </Pressable>
      {/* <View style={styles.rightWrapper}>
        <TouchableOpacity style={styles.upgradeButton}>
          <FontAwesomeIcon icon={faCrown} color="#FBC65F" />
          <GradientText
            text="Upgrade"
            style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}
            colors={["#FCF6BA", "#E3D088", "#B38728"]}
          />
        </TouchableOpacity>
        <View style={styles.credits}>
          <Text style={styles.creditsText}>{200}</Text>
          <FontAwesomeIcon icon={faWallet} />
        </View>
      </View> */}
    </View>
  );
  // return <View style={{backgroundColor:"grey",width:"100%"}}><Text>jkldsaafjl</Text></View>
};

const styles = StyleSheet.create({
  header: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 0.25 * StatusBar.currentHeight,
    backgroundColor: "#F2F2F2",
    elevation:50,
    // marginRight:30
    // marginLeft:-20
    // position:"relative",
    // width:"auto"
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "bold",
  },
  upgradeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 40,
    borderColor:"#FBC65F",
    borderWidth:1
  },
  credits: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.grey.lightgrey,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  creditsText: {
    marginRight: 5,
    fontWeight: "bold",
  },
  profileImage: {
    borderRadius: 20,
    borderColor: Colors.black,
    objectFit: "cover",
    borderWidth: 0.1,
  },
  rightWrapper:{
    flexDirection:'row',
    gap:10,
    alignItems:'center',
    justifyContent:'center',
  }
});

export default Header;
