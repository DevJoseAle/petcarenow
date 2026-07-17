#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: ./scripts/set-xcode-build-env.sh <appstore|teststore>" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_TYPE="$1"

case "$BUILD_TYPE" in
  appstore)
    ENV_FILE="$ROOT_DIR/.env.appstore.local"
    ;;
  teststore)
    ENV_FILE="$ROOT_DIR/.env.teststore.local"
    ;;
  *)
    echo "Unknown build type: $BUILD_TYPE" >&2
    echo "Supported values: appstore, teststore" >&2
    exit 1
    ;;
esac

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing environment file: $ENV_FILE" >&2
  exit 1
fi

{
  printf 'export NODE_BINARY=%s\n' "$(command -v node)"
  printf 'export EXPO_NO_DOTENV=1\n'
  printf 'set -a\n'
  printf '. "%s"\n' "$ENV_FILE"
  printf 'set +a\n'
} > "$ROOT_DIR/ios/.xcode.env.local"

echo "Configured Xcode environment: $BUILD_TYPE"
echo "Using env file: $ENV_FILE"
