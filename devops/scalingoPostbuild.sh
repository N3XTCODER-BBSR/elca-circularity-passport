#!/usr/bin/env bash

set -eux -o pipefail

export NEXTAUTH_URL="https://${APP}.${REGION_NAME}.scalingo.io"
echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env
echo "NEXTAUTH_URL=${NEXTAUTH_URL}"

# TODO: when running in real production, database should only be migrated, not reset and seeded

# deletes the database, runs the migrations and seeds the database again
npx prisma migrate reset --force