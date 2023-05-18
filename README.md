# Kafka Workshop

In this workshop, you'll learn how to build a simple Kafka producer-consumer application. This is the main documentation page and applies to all languages. Each language has a small, project-specific readme.

## Pre-requisites

- Docker and Docker Compose installed ([need docker?](#docker-install))

## Backing Apps

Our local setup includes Kafka, a Postgres database, and a Kafka UI. To start them run `./scripts/start_services.sh`.

- Kafka UI: http://localhost:8080
- Kafka broker: `localhost:9092` (`PLAINTEXT`)
- Postgres DB: `postgres://postgres:password@localhost:5432/app` (run `./scripts/psql_prompt.sh` to run queries)
- Schema Registry: required by `kafka-ui` (we won't be using it in this exercise)

## Scripts

There are utility scripts in the `./scripts` directory.

| Script Name                   | Description                                                                                                     |
| ----------------------------- |-----------------------------------------------------------------------------------------------------------------|
| `create_topics.sh`            | (re)create the `order-status` topic. Can also be done in UI (http://localhost:8080).                            |
| `psql_prompt.sh`              | opens a psql command prompt                                                                                     |
| `db_query_order_status.sh`    | queries the `order_status` table and outputs the results                                                        |
| `db_truncate_order_status.sh` | truncates the `order_status` table                                                                              |
| `reset_services.sh`           | alias for `docker-compose down && docker-compose up -d` - resets backing services (destructive)                 |
| `start_services.sh`           | alias for `docker-compose up -d` - starts backing services                                                      |
| `stop_services.sh`            | alias for `docker-compose down -d` -- stops backing services (destructive)                                      |

You can return to a clean slate by running `./scripts/reset_services.sh`. This will clear all data from Kafka and Postgres and restart them.

## Exercise

### Objective

The goal of this workshop is to build a simple Kafka Producer-Consumer Data flow. We start with the Kafka producer that will publish `3,500` order status updates to the `order-status` table. After that we will build the consumer (postgres sink) that consumes the messages from kafka and writes the data to the Postgres database.

After running the consumer, you should see `500` records in the `public.order_status` table, all in the `CLOSED` status.

### 1. Building the Producer

Look for `PRODUCER_START` in the project of your choice. If you haven't already, start Kafka and all backing services.

- `./scripts/start_services.sh` - start Kafka, Kafka UI, and PostgresQL
- `./scripts/create_topics.sh` - create the `order-status` topic

Our Kafka producer will read order status updates from a txt file (`./data/order-status-updates.txt`) and publish each record to the `order-status` topic. The data looks like this:

```json
{
  "id": "A3A25E64-CF72-4EB5-B387-C73E24DE02A2",
  "accountId": "acct_0",
  "status": "IN_PROCESS",
  "timestamp": "2023-05-11T20:05:07.225Z"
}
{
  "id": "A3A25E64-CF72-4EB5-B387-C73E24DE02A2",
  "accountId": "acct_0",
  "status": "PENDING",
  "timestamp": "2023-05-11T20:05:06.225Z"
}
```


### 2. Building Consumer (Postgres Sink)

Next build the kafka consumer. Look for `CONSUMER_START` in the project of your choice. The consumer is responsible for reading from the `order-status` topic and writing the messages to the `public.order_status` table. It uses a consumer group (`order-status-consumer`) to track offsets and to allow for multiple instances to run in parallel. See the project docs for how to run multiple instance.

Each record in the table should correspond to an order status insert or update (no deletes). The table is keyed off the order id, so each update for a given order id will overwrite the previous row for that id.

**Note: the consumers don't stop, you can see whether it's processed all records by looking at the consumer group () in the kafka ui (http://localhost:8080). Add some logging so you know it's working. Check the consumer group in the kafka UI to see if it has processed all records.**

## Completion

Once you have completed both parts of the exercise, you should be able to run the producer to publish messages to Kafka, and then run the consumer to consume those messages and write them to the Postgres database.

When the `public.order_status` table contains 500 records, and all of them are in the "CLOSED" status, you have successfully completed the workshop.

Good luck, and have fun learning about Kafka, producers, consumers, and Postgres sinks!

## Troubleshooting

If you run into any issues:

- Use `./scripts/reset_services.sh ` to clear all data from Kafka and Postgres and start
  over.
- Double-check that all services are running. Run `docker-compose ps` and see if anything is `(exited)`. Use `docker-compose logs (kafka1|postgres|akfka-ui|zookeeper)` to see what You can use
  the `./scripts/start_services.sh` command to start all services.
- Make sure your messages are correctly formatted and that the `order-status` topic exists.

If you're still having trouble, don't hesitate to ask for help.

## Docker Install
If you don't have docker installed, the following will install [Colima](https://github.com/abiosoft/colima).

```sh
brew install colima docker docker-compose docker-buildx

mkdir -p ~/.docker/cli-plugins
ln -sfn $(brew --prefix)/opt/docker-compose/bin/docker-compose ~/.docker/cli-plugins/docker-compose

colima start --cpu 2 --memory 6 --disk 80
```
