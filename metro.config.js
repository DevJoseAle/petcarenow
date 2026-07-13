const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Keep Metro on Expo's supported defaults. Custom native-folder blocking can
// be reintroduced later with a public Metro API if needed.

module.exports = config;
