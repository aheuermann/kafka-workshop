import fs from 'fs';
import path from 'path';
import { createClient } from '../lib/client';
import { Partitioners } from 'kafkajs';

const ORDER_STATUS_TOPIC = 'order-status';
const ORDER_STATUS_UPDATES_FILE = path.join(__dirname, './data/order-status-updates.txt');

// Create Kafka client
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
  // TODO: add comments here to guide and links to doc

  await producer.connect();

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
