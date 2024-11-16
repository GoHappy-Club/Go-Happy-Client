// import { View, Text, Image, StyleSheet } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import Animated, { FadeInLeft } from "react-native-reanimated";
// import { useNavigation } from "@react-navigation/native";
// import { hp, wp } from "../helpers/common";

// const VoucherDetails = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { id, image, title, color, value, percent, expiryDate } = route.params;

//   return (
//     <>
//       <Animated.View
//         sharedTransitionTag={`sharedBg${color}`}
//         style={[
//           {
//             width: "100%",
//             height: hp(100),
//             backgroundColor: "white",
//             borderRadius: 10,
//             borderWidth: 1,
//             borderColor: "#e0e0e0",
//             justifyContent: "start",
//             alignItems: "center",
//             flexDirection: "row",
//             padding: wp(1),
//             position: "absolute",
//             backgroundColor: color,
//           },
//         ]}
//       />
//       <View style={[styles.container]}>
//         <Animated.Image
//           sharedTransitionTag={id}
//           source={{
//             uri: image,
//           }}
//           style={styles.image}
//         />
//         <Animated.Text
//           sharedTransitionTag={`sharedText${id}`}
//           style={styles.title}
//           onPress={() => navigation.goBack()}
//         >
//           {title}
//         </Animated.Text>
//         {/* Add more details about the voucher here */}
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // padding: 16,
//     alignItems: "center",
//     // backgroundColor: "#fff",
//   },
//   image: {
//     width: "100%",
//     height: hp(42),
//     // borderRadius: 10,
//   },
//   title: {
//     fontSize: wp(4.5),
//     color: "#000",
//     fontFamily: "NunitoSans-SemiBold",
//     width: "80%",
//   },
// });

// export default VoucherDetails;

// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// const VoucherDetails = () => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         {/* Logo */}
//         <View style={styles.logoContainer}>
//           <Image
//             source={{
//               uri: "https://upload.wikimedia.org/wikipedia/en/4/45/Starbucks_Corporation_Logo_2011.svg",
//             }}
//             style={styles.logo}
//           />
//         </View>

//         {/* Coupon Details */}
//         <View style={styles.textContainer}>
//           <Text style={styles.brandName}>STARBUCKS</Text>
//           <Text style={styles.offer}>
//             BUY <Text style={styles.largeText}>1</Text> GET 1 FREE
//           </Text>
//           <Text style={styles.description}>
//             Purchase Any Starbucks Beverage AND Receive A Complimentary Second
//             Beverage
//           </Text>

//           <View style={styles.conditions}>
//             <Text style={styles.conditionItem}>
//               • Redeemable at all Starbucks Coffee stores in Taiwan.
//             </Text>
//             <Text style={styles.conditionItem}>
//               • Not valid with any other discounts and promotions.
//             </Text>
//             <Text style={styles.conditionItem}>
//               • Valid for coffee and tea beverages only.
//             </Text>
//             <Text style={styles.conditionItem}>• No cash value.</Text>
//           </View>
//         </View>

//         {/* Barcode */}
//         <View style={styles.barcodeContainer}>
//           <View style={styles.barcode} />
//           <Text style={styles.barcodeNumber}>No. 336682836523</Text>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Valid until 05 April 2019</Text>
//         </View>
//         <View style={styles.cutoutLeft} />
//         <View style={styles.cutoutRight} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f7f7f7",
//   },
//   card: {
//     width: "90%",
//     height:"80%",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     paddingVertical: 20,
//     paddingHorizontal: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   logo: {
//     width: 60,
//     height: 60,
//     resizeMode: "contain",
//   },
//   textContainer: {
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   brandName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   offer: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   largeText: {
//     fontSize: 24,
//     color: "#00704a",
//   },
//   description: {
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 15,
//     color: "#333",
//   },
//   conditions: {
//     alignItems: "flex-start",
//   },
//   conditionItem: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 5,
//   },
//   barcodeContainer: {
//     alignItems: "center",
//     marginVertical: 15,
//   },
//   barcode: {
//     width: "80%",
//     height: 50,
//     backgroundColor: "#ccc",
//     borderRadius: 5,
//   },
//   barcodeNumber: {
//     marginTop: 10,
//     fontSize: 12,
//     color: "#333",
//   },
//   footer: {
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     paddingTop: 10,
//     alignItems: "center",
//   },
//   footerText: {
//     fontSize: 12,
//     color: "#999",
//   },
//   cutoutLeft: {
//     position: "absolute",
//     left: -15,
//     top: "70%",
//     width: 30,
//     height: 30,
//     backgroundColor: "#f7f7f7",
//     borderRadius: 15,
//     transform: [{ translateY: -15 }],
//   },
//   cutoutRight: {
//     position: "absolute",
//     right: -15,
//     top: "70%",
//     width: 30,
//     height: 30,
//     backgroundColor: "#f7f7f7",
//     borderRadius: 15,
//     transform: [{ translateY: -15 }],
//   },
// });

// export default VoucherDetails;

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
  FadeIn,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { formatDate } from "./Rewards";
import { wp } from "../helpers/common";

const VoucherDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, image, title, color, value, percent, expiryDate, description } =
    route.params;

  const conditions_and_redemptions = [
    ...description.redemption,
    ...description.tnc,
  ];

  return (
    <>
      <Animated.View
        sharedTransitionTag={`sharedBg${color}`}
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: "#f7f7f7",
          },
        ]}
      />

      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Animated.Image
              sharedTransitionTag={id}
              source={{
                uri:
                  image ||
                  "https://upload.wikimedia.org/wikipedia/en/4/45/Starbucks_Corporation_Logo_2011.svg",
              }}
              style={styles.logo}
            />
          </View>

          <View style={styles.textContainer}>
            <Animated.Text
              sharedTransitionTag={`sharedText${id}`}
              style={styles.title}
            >
              {title}
            </Animated.Text>

            <Animated.Text
              sharedTransitionTag={`sharedValue${id}`}
              style={styles.offer}
            >
              {value != null ? `₹${value}` : `${percent}% OFF`}
            </Animated.Text>
            <Animated.Text
              entering={FadeInLeft.delay(400).springify()}
              exiting={FadeOutRight}
              style={styles.description}
            >
              {description.description}
            </Animated.Text>
            <Animated.View
              entering={FadeInLeft.delay(600).springify()}
              exiting={FadeOutRight}
              style={styles.conditions}
            >
              {conditions_and_redemptions.map((item, i) => (
                <Animated.Text
                  entering={FadeInLeft.delay(600 + i * 100)}
                  style={styles.conditionItem}
                >
                  • {item}
                </Animated.Text>
              ))}
            </Animated.View>
          </View>
          <View style={styles.footer}>
            <Animated.Text
              sharedTransitionTag={`sharedExpiryDate${id}`}
              style={styles.footerText}
            >
              Valid until {formatDate(expiryDate)}
            </Animated.Text>
          </View>
          <View style={styles.cutoutLeft} />
          <View style={styles.cutoutRight} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  card: {
    width: "90%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 70,
    height: 70,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: wp(4.5),
    color: "#000",
    fontFamily: "NunitoSans-SemiBold",
    textAlign: "center",
  },
  offer: {
    fontSize: wp(8),
    fontWeight: "bold",
    color: "#000",
    fontFamily: "NunitoSans-SemiBold",
  },
  largeText: {
    fontSize: 24,
    color: "#00704a",
  },
  description: {
    fontSize: wp(5),
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  conditions: {
    alignItems: "flex-start",
    width: "100%",
  },
  conditionItem: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  barcodeContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  barcode: {
    width: "80%",
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  barcodeNumber: {
    marginTop: 10,
    fontSize: 12,
    color: "#333",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
  cutoutLeft: {
    position: "absolute",
    left: -15,
    top: "70%",
    width: 30,
    height: 30,
    backgroundColor: "#f7f7f7",
    borderRadius: 15,
    transform: [{ translateY: -15 }],
  },
  cutoutRight: {
    position: "absolute",
    right: -15,
    top: "70%",
    width: 30,
    height: 30,
    backgroundColor: "#f7f7f7",
    borderRadius: 15,
    transform: [{ translateY: -15 }],
  },
});

export default VoucherDetails;
