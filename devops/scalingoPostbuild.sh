#!/usr/bin/env bash

set -eux -o pipefail

export NEXTAUTH_URL="https://${APP}.${REGION_NAME}.scalingo.io"
echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env
echo "NEXTAUTH_URL=${NEXTAUTH_URL}"

yarn prisma:generate

# NOTE: build step in scalingo is not automatically run, when scalingoPostbuild script is used
yarn build

npx prisma migrate deploy