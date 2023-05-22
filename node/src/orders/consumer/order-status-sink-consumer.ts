import { OrderStatusEntity } from './order-status.entity';
import { createClient } from '../../lib/client';
import { AppDataSource } from './datasource';

// topic to consume order updates from
const CONSUMED_TOPIC = 'order-status';

// consumer group for offset management
const CONSUMER_GROUP = 'order-status-consumer';

const kafka = createClient();

// create new consumer client
const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });

// interface for order status update messages
interface OrderStatusUpdate {
  id: string; // uuid order id
  accountId: string; // text
  status: string; // text
  timestamp: string; // timestamp
}

async function shutdown() {
  console.log('Disconnecting from kafka brokers');
  await consumer.disconnect();
}

process.on('SIGTERM', () => {
  shutdown().catch((err) => console.log(`Error on shutdown: ${err}`));
});

/**
 * Dedupe the records by id, prefering the last record (latest)
 * @param records
 * @returns
 */
function dedupeByIdPreferLast(records: OrderStatusUpdate[]) {
  const result = new Map<number, OrderStatusUpdate>();

  for (const record of records) {
    result[record.id] = record;
  }
  // convert the object back to array
  return Object.values(result);
}

async function startConsumer(): Promise<void> {
  /**
   * CONSUMER_START
   *
   * KafkaJS Consumer API: https://kafka.js.org/docs/consuming
   * TypeORM Repository API: https://typeorm.io/repository-api
   *         DataSource API: https://typeorm.io/data-source-api
   * OR install another ORM. Connection details are in the datasource.ts file.
   *
   * High-level flow:
   * 1. Connect to the database using the AppDataSource.
   * 2. Connect the consumer to the kafka cluster
   * 3. Subscribe to the order-status topic
   * 4. Update the public.order_status table
   * 5. Commit the message offset
   *
   */
  // connect to the database
  await AppDataSource.initialize();

  // connect to kafka and subscribe to the topic
  await consumer.connect();
  await consumer.subscribe({ topic: CONSUMED_TOPIC, fromBeginning: true });

  async function eachBatch({ batch, resolveOffset, heartbeat }): Promise<void> {
    const entities = dedupeByIdPreferLast(batch.messages.map((message) => JSON.parse(message.value.toString())));
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
      console.log(err);
      await shutdown();
    }
  }

  // start consuming messages
  await consumer.run({
    autoCommit: true,
    eachBatchAutoResolve: false,
    autoCommitInterval: 5000, // commit every 5 sec (at most)
    eachBatch,
  });
}

startConsumer().catch((e) => {
  console.error(e);
  process.exit(1);
});
