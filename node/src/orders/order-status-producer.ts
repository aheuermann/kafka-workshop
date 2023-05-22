import fs from 'fs';
import path from 'path';
import { createClient } from '../lib/client';
import { Partitioners } from 'kafkajs';

const ORDER_STATUS_TOPIC = 'order-status';
const ORDER_STATUS_UPDATES_FILE = path.join(__dirname, '../../../data/order-status-updates.txt');

// create kafka client
const kafka = createClient();

// initialize producer, we will connect to the broker later
const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });

interface OrderStatusUpdate {
  id: string; // uuid order id
  accountId: string; // text
  status: string; // text
  timestamp: string; // timestamp
}

async function publishOrderStatusUpdates(updates: OrderStatusUpdate[]) {
  /**
   * PRODUCER_START
   *
   * KafkaJS Producer API: https://kafka.js.org/docs/producing
   *
   * High-level flow:
   * 1. Connect the to kafka cluster
   * 2. Publish each order status update to the order-status topic. The records should be in json format.
   */
  // connect to kafka
  await producer.connect();

  // loop through each update and publish to the topic
  for await (const update of updates) {
    await producer.send({
      messages: [
        {
          key: update.id,
          value: JSON.stringify(update),
        },
      ],
      topic: ORDER_STATUS_TOPIC,
    });
  }
}

const orderStatusUpdates = fs
  .readFileSync(ORDER_STATUS_UPDATES_FILE)
  .toString()
  .trim()
  .split('\n')
  .map((line) => JSON.parse(line));

publishOrderStatusUpdates(orderStatusUpdates as OrderStatusUpdate[])
  .then(async () => {
    console.log('Done publishing order status updates');
    await producer.disconnect();
    process.exit(0);
  })
  .catch((err) => console.error(`Error reading file: ${err}`));
