# Build stage
FROM rust:latest AS rust-builder

# Create a new empty shell project
WORKDIR /rust-api
COPY ./server .

# Build with release profile for optimization
RUN cargo build --release

# Production stage
FROM node:latest AS node-builder

WORKDIR /app

COPY ./app-ui/package.json .
COPY ./app-ui/yarn.lock .

RUN yarn install

COPY ./app-ui .
RUN yarn build

COPY --from=rust-builder /rust-api/target/release/portfolio-web-api ./portfolio-web-api

# Run the binary
ENTRYPOINT npm run preview & ./portfolio-web-api