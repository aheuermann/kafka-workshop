// src/consumer.ts
import { OrderStatusEntity } from './order-status.entity';
import { createClient } from '../../lib/client';
import { AppDataSource } from './datasource';

const CONSUMED_TOPIC = 'order-status';
const CONSUMER_GROUP = 'order-status-sink';

const kafka = createClient();

const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });

interface OrderStatusUpdate {
  id: string; // uuid order id
  accountId: string; // text
  status: string; // text
  timestamp: string; // timestamp
}

function selectLastById(records: OrderStatusUpdate[]) {
  const result = new Map<number, OrderStatusUpdate>();

  for (const record of records) {
    result[record.id] = record;
  }

  // Convert the object back to array
  return Object.values(result);
}

async function startConsumer(): Promise<void> {
  // connect to the database
  await AppDataSource.initialize();

  async function shutdown() {
    console.log('Disconnecting from kafka brokers');
    await consumer.disconnect();
  }

  process.on('SIGTERM', () => {
    shutdown().catch((err) => console.log(`Error on shutdown: ${err}`));
  });

  async function onError(err: Error) {
    console.log(err);
    await shutdown();
  }

  // connect to kafka and subscribe to the topic
  await consumer.connect();
  await consumer.subscribe({ topic: CONSUMED_TOPIC, fromBeginning: true });

  async function eachBatch({ batch, resolveOffset, heartbeat }): Promise<void> {
    const entities = selectLastById(batch.messages.map((message) => JSON.parse(message.value.toString())));
    try {
      await AppDataSource.getRepository(OrderStatusEntity)
        .createQueryBuilder()
        .insert()
        .into(OrderStatusEntity)
        .values(entities)
        .orUpdate(['status', 'account_id', 'timestamp', 'created_at', 'updated_at'], ['id'], {})
        .execute();
      await resolveOffset(batch.lastOffset());
      await heartbeat();
    } catch (err) {
      await onError(err);
    }
  }

  // start consuming messages
  await consumer.run({
    eachBatchAutoResolve: false,
    eachBatch,
  });
}

startConsumer().catch((e) => {
  console.error(e);
  process.exit(1);
});
