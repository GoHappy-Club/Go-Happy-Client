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
        injectedJavaScript={name == "Bubble Shooter" ? removeMargin : adBlockScript}
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
