package com.example
package orders.producer

import orders.formats.Formats._

import play.api.libs.json.{Format, Json}

import java.time.Instant
import java.util.UUID

case class OrderStatusUpdate(
                              id: UUID,
                              accountId: String,
                              status: String,
                              timestamp: Instant
                            )

object OrderStatusUpdate {
  implicit val format: Format[OrderStatusUpdate] = Json.format[OrderStatusUpdate]
}
