package com.example
package orders.formats

import java.time.{Instant, ZoneOffset}
import java.time.format.DateTimeFormatter
import play.api.libs.json._

object Formats {
  val dateFormatter: DateTimeFormatter = DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC)

  implicit val instantReads: Reads[Instant] = Reads[Instant](js =>
    js.validate[String].map[Instant](str =>
      Instant.from(dateFormatter.parse(str))))

  implicit val instantWrites: Writes[Instant] = Writes[Instant](i =>
    JsString(dateFormatter.format(i)))
}
