ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "2.13.10"

lazy val root = (project in file("."))
  .settings(
    name := "kafka-workshop",
    idePackagePrefix := Some("com.example")
  )
libraryDependencies ++= Seq(
  "com.typesafe.play" %% "play-json" % "2.9.4",
  "org.apache.kafka" % "kafka-clients" % "3.4.0",
  "org.postgresql" % "postgresql" % "42.6.0",
  "org.scalikejdbc" %% "scalikejdbc" % "4.0.+",
  "ch.qos.logback" % "logback-classic" % "1.4.6",
)