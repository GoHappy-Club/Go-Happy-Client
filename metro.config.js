const { getDefaultConfig } = require('expo/metro-config'); // For Expo
const { mergeConfig } = require('@react-native/metro-config'); // For merging configs

const defaultConfig = getDefaultConfig(__dirname);

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = defaultConfig;

  const customConfig = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: [...assetExts.filter(ext => ext !== 'svg'), 'lottie'], // Add 'lottie', remove 'svg'
      sourceExts: [...sourceExts, 'svg'], // Add 'svg'
    },
  };

  return mergeConfig(defaultConfig, customConfig);
})();
