import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";
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

  const route = useRoute();
  const { gameUrl } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: gameUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        // injectedJavaScript={adBlockScript}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Game;
