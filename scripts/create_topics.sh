#! /bin/bash

set -e

docker pull confluentinc/cp-kafka:7.3.2

PARTITIONS=5
REPLICATION_FACTOR=1
BOOTSTRAP_SERVER="127.0.0.1:9092"


# Run the Docker command to delete the topic
docker run --rm --net=host confluentinc/cp-kafka:7.3.2 kafka-topics --delete --topic order-status --bootstrap-server "${BOOTSTRAP_SERVER}" --if-exists

# Allow some time for the topic to be deleted
sleep 5

# Run the Docker command to create the topic
docker run --rm --net=host confluentinc/cp-kafka:7.3.2 kafka-topics --create --topic order-status --partitions ${PARTITIONS}  --replication-factor ${REPLICATION_FACTOR} --bootstrap-server "${BOOTSTRAP_SERVER}" --if-not-exists
# docker run --rm --net=host confluentinc/cp-kafka:7.3.2 kafka-topics --create --topic "account-balances" --partitions 2 --replication-factor 1 --bootstrap-server "${BOOTSTRAP_SERVER}" --if-not-exists
#docker run --rm --net=host confluentinc/cp-kafka:7.3.2 kafka-topics --create --topic word-count --partitions 5 --replication-factor 1 --bootstrap-server "${BOOTSTRAP_SERVER}" --if-not-exists
#docker run --rm --net=host confluentinc/cp-kafka:7.3.2 kafka-topics --create --topic word-count --partitions 5 --replication-factor 1 --bootstrap-server "${BOOTSTRAP_SERVER}" --if-not-exists
