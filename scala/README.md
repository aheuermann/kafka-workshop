# Kafka Workshop (Scala)

See the [root readme](../README.md) for more information on the exercise.
## Pre-requisites
- jdk 8+, sbt

## Producer

main: `scala/src/main/scala/orders/producer/OrderProducer.scala`

run: `sbt "runMain com.example.orders.producer.OrderProducer"`

## Consumer

main: `scala/src/main/scala/orders/sink/PostgresSinkConsumer.scala`

run: `sbt "runMain com.example.orders.sink.PostgresSinkConsumer"`

