import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { View } from "react-native";
import GOHLoader from "../commonComponents/GOHLoader";
import { Colors } from "../assets/colors/color";

const Game = () => {
  const [time, setTime] = useState(5);
  const route = useRoute();
  const { gameUrl, name } = route.params;

  const adBlockScript = `
  (function() {
  const adSelectors = ['ins', '.ads', '.ad-banner', '[id*="ad-"]', '[class*="ad"]'];
  
  function removeAds() {
    adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });
  }
  
  removeAds();

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Ensure it's an element node
          adSelectors.forEach(selector => {
            if (node.matches(selector)) {
              node.remove();
            }
            node.querySelectorAll(selector).forEach(el => el.remove());
          });
        }
      });
    });
  });

  // Observe changes in the document body
  observer.observe(document.body, { childList: true, subtree: true });
})();
`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {time > 0 && (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.background,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GOHLoader />
        </View>
      )}
      {/* {time == 0 && ( */}
      <WebView
        source={{ uri: gameUrl }}
        style={{ flex: time == 0 ? 1 : 0 }}
        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        injectedJavaScript={adBlockScript}
        // javaScriptEnabled={true}
        // domStorageEnabled={true}
      />
      {/* )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Game;
