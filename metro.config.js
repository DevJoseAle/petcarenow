const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const escapePathForRegex = (value) =>
  value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replaceAll('/', '\\/');

const excludedPaths = [
  path.join(__dirname, 'ios', 'Pods'),
  path.join(__dirname, 'ios', 'build'),
  path.join(__dirname, 'dist'),
];

const excludedRootFiles = [
  '.env',
  '.env.local',
  '.env.appstore.local',
  '.env.teststore.local',
  '.env.example',
  '.env.appstore.example',
  '.env.teststore.example',
];

const existingBlockList = config.resolver?.blockList
  ? Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : [config.resolver.blockList]
  : [];

config.resolver = {
  ...config.resolver,
  blockList: [
    ...existingBlockList,
    ...excludedPaths.map(
      (excludedPath) => new RegExp(`^${escapePathForRegex(excludedPath)}\\/.*$`)
    ),
    ...excludedRootFiles.map(
      (fileName) =>
        new RegExp(
          `^${escapePathForRegex(path.join(__dirname, fileName))}$`
        )
    ),
  ],
};

module.exports = config;
