const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Web için resolver ayarları
config.resolver.alias = {
  'react-native$': 'react-native-web',
};

module.exports = config;
