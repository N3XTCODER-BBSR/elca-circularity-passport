#!/usr/bin/env bash

RUN_SEEDERS_ON_DEPLOY=${RUN_SEEDERS_ON_DEPLOY:-0}

set -eux -o pipefail

npx prisma prisma:deploy

if [ "${RUN_SEEDERS_ON_DEPLOY}" == 1 ]; then
  echo "Seeding database"
  npx prisma db seed
fi