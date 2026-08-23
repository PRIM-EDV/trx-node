#-----------------------
# Base image layer
#-----------------------
FROM node:25.8.0-slim AS base

# ----------------------
# Package.json layer
# ----------------------
FROM base AS package.json
RUN apt-get update && apt-get install -y jq

WORKDIR /opt/trx-node

COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY libs/trx-protocol/package.json ./libs/trx-protocol/
COPY libs/meshtastic-protocol/package.json ./libs/meshtastic-protocol/
COPY libs/phobos/infrastructure/package.json ./libs/phobos/infrastructure/
COPY libs/phobos-maptool/models/package.json ./libs/phobos-maptool/models/
COPY libs/phobos-maptool/protocol/package.json ./libs/phobos-maptool/protocol/
COPY libs/phobos-maptool/dto/package.json ./libs/phobos-maptool/dto/

RUN jq 'del(.version)' package.json > package.json.slim && mv package.json.slim package.json
RUN jq 'del(.version)' apps/backend/package.json > apps/backend/package.json.slim && mv apps/backend/package.json.slim apps/backend/package.json
RUN jq 'del(.version)' libs/trx-protocol/package.json > libs/trx-protocol/package.json.slim && mv libs/trx-protocol/package.json.slim libs/trx-protocol/package.json
RUN jq 'del(.version)' libs/meshtastic-protocol/package.json > libs/meshtastic-protocol/package.json.slim && mv libs/meshtastic-protocol/package.json.slim libs/meshtastic-protocol/package.json
RUN jq 'del(.version)' libs/phobos/infrastructure/package.json > libs/phobos/infrastructure/package.json.slim && mv libs/phobos/infrastructure/package.json.slim libs/phobos/infrastructure/package.json
RUN jq 'del(.version)' libs/phobos-maptool/models/package.json > libs/phobos-maptool/models/package.json.slim && mv libs/phobos-maptool/models/package.json.slim libs/phobos-maptool/models/package.json
RUN jq 'del(.version)' libs/phobos-maptool/protocol/package.json > libs/phobos-maptool/protocol/package.json.slim && mv libs/phobos-maptool/protocol/package.json.slim libs/phobos-maptool/protocol/package.json
RUN jq 'del(.version)' libs/phobos-maptool/dto/package.json > libs/phobos-maptool/dto/package.json.slim && mv libs/phobos-maptool/dto/package.json.slim libs/phobos-maptool/dto/package.json

# ----------------------
# Base dependencies layer
# ----------------------
FROM base AS deps
RUN apt update && apt install protobuf-compiler -y

WORKDIR /opt/trx-node

COPY --from=package.json /opt/trx-node ./

COPY lerna*.json ./
COPY libs ./libs
COPY ext/meshtastic/protobufs ./ext/meshtastic/protobufs

RUN npm install

# ----------------------
# Backend build
# ----------------------
FROM deps AS backend
COPY apps/backend ./apps/backend
RUN npx lerna run build --scope @trx-node/backend --include-dependencies

# ----------------------
# Image
# ----------------------
FROM backend

WORKDIR /opt/trx-node/apps/backend

CMD ["npm", "run", "start:prod"]
