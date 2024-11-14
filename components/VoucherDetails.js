import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const VoucherDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, image, title } = route.params;

  return (
    <View style={styles.container}>
      <Animated.Image
        sharedTransitionTag={id}
        source={{
          uri: image,
        }}
        style={{
          width: "100%",
          height: "50%",
          borderRadius: 10,
        }}
      />
      <Animated.Text
        sharedTransitionTag="text"
        style={styles.title}
        onPress={() => navigation.goBack()}
      >
        {title}
      </Animated.Text>
      {/* Add more details about the voucher here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default VoucherDetails;
