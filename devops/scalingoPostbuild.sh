#!/usr/bin/env bash

set -eux -o pipefail

export NEXTAUTH_URL="https://${APP}.${REGION_NAME}.scalingo.io"
echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env
echo "NEXTAUTH_URL=${NEXTAUTH_URL}"

# NOTE: build step in scalingo is not automatically run, when scalingoPostbuild script is used
yarn build

yarn prisma:generate

# TODO: when running in real production, database should only be migrated, not reset and seeded
# deletes the database, runs the migrations and seeds the database again
npx prisma migrate reset --force