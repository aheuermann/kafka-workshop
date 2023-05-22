package com.example
package orders.sink

import org.apache.kafka.clients.consumer.{ConsumerConfig, KafkaConsumer}
import play.api.libs.json._
import scalikejdbc._

import java.time.Duration
import java.util.{Collections, Properties}
import scala.jdk.CollectionConverters._

object PostgresSinkConsumer {

  // input topic
  val topic = "order-status"

  // consumer group
  val groupId = "order-status-consumer"

  // configure Kafka Consumer
  val props = new Properties()
  props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092")
  props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId)
  props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
  props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringDeserializer")
  props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")

  private val consumer = new KafkaConsumer[String, String](props)

  // configure ScalikeJDBC
  Class.forName("org.postgresql.Driver")
  ConnectionPool.singleton("jdbc:postgresql://127.0.0.1:5432/app", "postgres", "password")

  implicit val session: AutoSession.type = AutoSession

  def main(args: Array[String]): Unit = {
    Runtime.getRuntime.addShutdownHook(new Thread(() => {
      println("Gracefully shutting down the consumer...")
      consumer.close()
      println("Consumer has been shut down.")
    }))

    startConsumer()
  }

  private def startConsumer(): Unit = {
    /**
     * CONSUMER_START
     *
     * KafkaConsumer API  Consumer API: https://kafka.js.org/docs/consuming
     * Scalikejdbc Docs: http://scalikejdbc.org/
     *
     * High-level flow:
     * 1. Subscribe to the order-status topic
     * 2. Update the public.order_status table
     * 3. Commit the message offset
     *
     */
    consumer.subscribe(Collections.singletonList(topic))

    try {
      while (true) {
        val records = consumer.poll(Duration.ofMillis(100)).asScala

        val orderStatusUpdates = records
          .map(record => Json.parse(record.value).as[OrderStatus])

        val dedupedEntities = orderStatusUpdates
          .groupBy(_.id)
          .values
          .map(_.last)

        if (dedupedEntities.nonEmpty) {
          val batchParams: Seq[Seq[Any]] = dedupedEntities.map(e => Seq(e.id, e.accountId, e.status, e.timestamp)).toSeq

          val sqlQuery =
            sql"""
            INSERT INTO order_status (id, account_id, status, timestamp)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (id) DO UPDATE
            SET account_id = EXCLUDED.account_id,
              status = EXCLUDED.status,
              timestamp = EXCLUDED.timestamp
           """

          sqlQuery.batch(batchParams: _*).apply()
        }
      }
    } finally {
      consumer.close()
    }
  }
}
