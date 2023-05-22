package com.example
package orders.producer

import org.apache.kafka.clients.producer.{KafkaProducer, ProducerConfig}
import play.api.libs.json._

import java.util.Properties
import scala.io.{BufferedSource, Source}

/**
 * This class reads from the order-status-updates file and publishes the records to the `order-status` topic.
 */
object OrderProducer {
  val topic = "order-status"
  // load from resources file
  val updatesFile = "order-status-updates.txt"

  val props = new Properties()
  props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "127.0.0.1:9092")
  props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer")
  props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer")
  val producer = new KafkaProducer[String, String](props)

  /**
   * Publish the sequence of order updates to the "order-status" topic.
   *
   * @param updates - sequence of OrderStatusUpdates to publish
   */
  private def publishOrderStatusUpdates(updates: Seq[OrderStatusUpdate]): Unit = {
    /**
     * PRODUCER_START
     *
     * KafkaProducer API Docs: https://kafka.apache.org/34/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html
     *
     * Publish each order status update to the order-status topic. The records should be in json format.
     */
  }

  def main(args: Array[String]): Unit = {
    val orderStatusUpdates = Source.fromResource(updatesFile).getLines.toList.map { line =>
      Json.parse(line).as[OrderStatusUpdate]
    }
    publishOrderStatusUpdates(orderStatusUpdates)
    producer.close()
  }
}