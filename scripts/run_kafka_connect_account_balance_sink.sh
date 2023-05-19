#!/bin/bash

# Variables
KAFKA_CONNECT_DOCKER_IMAGE="confluentinc/cp-kafka-connect:latest"
BOOTSTRAP_SERVERS="127.0.0.1:9092"
CONNECT_REST_PORT="8083"
CONNECT_GROUP_ID="quickstart"
CONNECT_CONFIG_STORAGE_TOPIC="quickstart-config"
CONNECT_OFFSET_STORAGE_TOPIC="quickstart-offsets"
CONNECT_STATUS_STORAGE_TOPIC="quickstart-status"
CONNECT_LOG4J_ROOT_LOGLEVEL="DEBUG"
CONNECT_PLUGIN_PATH="/usr/share/java"

CONNECT_STANDALONE_CONFIG_PATH="./kafka-connect-props/connect-standalone.properties"
SINK_CONFIG_PATH="./kafka-connect-props/account-balance-sink.properties"

# Command to run kafka connect
docker run -d \
  --name=kafka-connect \
  --net=host \
  -v $CONNECT_STANDALONE_CONFIG_PATH:/etc/kafka/connect-standalone.properties \
  -v $SINK_CONFIG_PATH:/etc/kafka/sink-quickstart-sqlite.properties \
  -e CONNECT_BOOTSTRAP_SERVERS=$BOOTSTRAP_SERVERS \
  -e CONNECT_REST_PORT=$CONNECT_REST_PORT \
  -e CONNECT_GROUP_ID=$CONNECT_GROUP_ID \
  -e CONNECT_CONFIG_STORAGE_TOPIC=$CONNECT_CONFIG_STORAGE_TOPIC \
  -e CONNECT_OFFSET_STORAGE_TOPIC=$CONNECT_OFFSET_STORAGE_TOPIC \
  -e CONNECT_STATUS_STORAGE_TOPIC=$CONNECT_STATUS_STORAGE_TOPIC \
  -e CONNECT_KEY_CONVERTER="org.apache.kafka.connect.json.JsonConverter" \
  -e CONNECT_VALUE_CONVERTER="org.apache.kafka.connect.json.JsonConverter" \
  -e CONNECT_INTERNAL_KEY_CONVERTER="org.apache.kafka.connect.json.JsonConverter" \
  -e CONNECT_INTERNAL_VALUE_CONVERTER="org.apache.kafka.connect.json.JsonConverter" \
  -e CONNECT_REST_ADVERTISED_HOST_NAME="127.0.0.1" \
  -e CONNECT_LOG4J_ROOT_LOGLEVEL=$CONNECT_LOG4J_ROOT_LOGLEVEL \
  -e CONNECT_PLUGIN_PATH=$CONNECT_PLUGIN_PATH \
  $KAFKA_CONNECT_DOCKER_IMAGE /etc/kafka/connect-standalone.properties /etc/kafka/sink-quickstart-sqlite.properties
