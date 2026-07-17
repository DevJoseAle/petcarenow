#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: ./scripts/with-build-env.sh <appstore|teststore> <command...>" >&2
  exit 1
fi

BUILD_TYPE="$1"
shift

case "$BUILD_TYPE" in
  appstore)
    ENV_FILE=".env.appstore.local"
    ;;
  teststore)
    ENV_FILE=".env.teststore.local"
    ;;
  *)
    echo "Unknown build type: $BUILD_TYPE" >&2
    echo "Supported values: appstore, teststore" >&2
    exit 1
    ;;
esac

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing environment file: $ENV_FILE" >&2
  echo "Create it from ${ENV_FILE/.local/.example} before running this command." >&2
  exit 1
fi

unset EXPO_PUBLIC_SUPABASE_URL
unset EXPO_PUBLIC_SUPABASE_ANON_KEY
unset EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID
unset EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY
unset EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY
unset EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE
unset EXPO_PUBLIC_REVENUECAT_TEST_API_KEY

set -a
source "$ENV_FILE"
set +a

export EXPO_NO_DOTENV=1

exec "$@"
