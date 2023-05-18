package com.example
package orders.sink

import play.api.libs.json.{Format, Json}

import java.time.Instant
import java.util.UUID

case class OrderStatus(
                        id: UUID,
                        accountId: String,
                        status: String,
                        timestamp: Instant
                      )

object OrderStatus {
  implicit val format: Format[OrderStatus] = Json.format[OrderStatus]
}
