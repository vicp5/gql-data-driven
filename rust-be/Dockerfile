FROM rustlang/rust:nightly as build

ENV USER=root

WORKDIR /code
RUN cargo init
COPY Cargo.toml /code/Cargo.toml
RUN cargo fetch

COPY src /code/src

RUN cargo test --offline
RUN cargo build --release --offline

FROM debian:buster-slim

RUN apt update && apt upgrade && apt install libssl-dev -y

COPY --from=build /code/target/release/rust-be /usr/bin/rust-be

ENV RUST_LOG=info
#ENV RUST_BACKTRACE=full

ENTRYPOINT [ "/usr/bin/rust-be" ]