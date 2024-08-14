FROM node:22.6.0

RUN apt update && apt install protobuf-compiler -y

WORKDIR /opt/trx-node/server

# Install server source dependancies
COPY ./server/*.json ./
RUN npm install

# Build server
COPY ./server/lib ./lib
COPY ./server/src ./src
COPY ./protocol ../protocol

# Build protocol
RUN npm run proto:generate

# Run startscript
COPY ./server/run.sh ./
RUN chmod +x run.sh

CMD ["./run.sh"]
