const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'lottie'], // Add 'lottie' to the list of asset extensions
  },
};

module.exports = mergeConfig(defaultConfig, config);
