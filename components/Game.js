import { useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const Game = () => {
  const fullScreenScript = `
    setTimeout(() => {
      let fullScreenButton = document.querySelector('button'); // Modify if necessary
      if (fullScreenButton) {
        fullScreenButton.click(); // Simulates a user clicking the full-screen button
      }
    }, 2000);
  `;

  const adBlockScript = `
    (function() {
      var adSelectors = ['iframe', '.ads', '.ad-banner', '[id^="ad-"]', '[class*="ad"]'];
      adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    })();
  `;

  const removeMargin = `
  setTimeout(() => {
    const canvas = document.querySelector("#content canvas");
    if (canvas) {
      canvas.style.marginTop = "0px";
    }
  }, 1000);
`;

  const route = useRoute();
  const { gameUrl, name } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: gameUrl }}
        style={{ flex: 1 }}
        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        injectedJavaScript={`
          function removeAds() {
            // Select ad containers by their class names or IDs
            const adElements = document.querySelectorAll('.ad-container, #banner-ad, .advertisement');
            
            // Remove each element
            adElements.forEach(el => {
              if (el && el.parentNode) {
                el.parentNode.removeChild(el);
              }
            });
            
            // For dynamically loaded ads, run periodically
            setTimeout(removeAds, 1000);
          }
          
          // Initial call
          removeAds();
          
          true; // This is needed for iOS
        `}
        // javaScriptEnabled={true}
        // domStorageEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Game;
