#!/usr/bin/env bash

# RUN_SEEDERS_ON_DEPLOY=${RUN_SEEDERS_ON_DEPLOY:-0}

set -eux -o pipefail

export NEXTAUTH_URL="https://${APP}.${REGION_NAME}.scalingo.io"
echo "NEXTAUTH_URL=${NEXTAUTH_URL}" >> .env
echo "NEXTAUTH_URL=${NEXTAUTH_URL}"

npx prisma migrate reset --force
# npx next build

# if [ "${RUN_SEEDERS_ON_DEPLOY}" == "1" ] || [ "${RUN_SEEDERS_ON_DEPLOY}" == "true" ]; then
#   echo "Seeding database"
#   npx prisma db seed
# fi