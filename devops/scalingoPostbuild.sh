#!/usr/bin/env bash

set -eux -o pipefail

# Only set NEXTAUTH_URL if it's not already defined
if [ -z "${NEXTAUTH_URL:-}" ]; then
  export NEXTAUTH_URL="https://${APP}.${REGION_NAME}.scalingo.io"
  echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env
  echo "NEXTAUTH_URL=${NEXTAUTH_URL}"
fi


yarn prisma:generate

# NOTE: build step in scalingo is not automatically run, when scalingoPostbuild script is used
yarn build

yarn prisma migrate deploy
yarn prisma db seed
yarn seed:demo-data