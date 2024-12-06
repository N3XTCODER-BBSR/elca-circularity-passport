FROM node:20
# TODO scalingo/scalingo-22 with a buildpack

ENV NPM_CONFIG_PRODUCTION=false
ENV NODE_ENV=test
ENV NEXT_TELEMETRY_DISABLED=1
ENV PRISMA_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

# TODO: 
# - run the nextjs app by default
# - consider running npx next build
CMD echo "TODO: Specify the run command for the non-testing use case!"