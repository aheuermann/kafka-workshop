import { Kafka } from 'kafkajs';

const logCreator =
  () =>
  ({ namespace, label, log }) => {
    const { message, ...others } = log;
    console.log(`${label} [${namespace}] ${message} ${JSON.stringify(others)}`);
  };

export function createClient(clientId?: string): Kafka {
  return new Kafka({
    clientId,
    brokers: ['127.0.0.1:9092'],
    logCreator,
  });
}

export async function recreateTopic(topic: string, numPartitions: number): Promise<void> {
  const admin = createClient().admin();

  await admin.connect();
  // Check if topic exists
  const topics = await admin.listTopics();
  const topicExists = topics.includes(topic);

  // If it exists, delete it
  if (topicExists) {
    console.log(`Topic ${topic} exists, deleting it...`);
    await admin.deleteTopics({
      topics: [topic],
      timeout: 10000, // wait up to 10s for deletion
    });
    console.log(`Topic ${topic} deleted.`);
  }

  console.log(`Creating topic ${topic}...`);
  // Now create the topic
  await admin.createTopics({
    waitForLeaders: true,
    topics: [
      {
        topic,
        numPartitions,
        replicationFactor: 1,
      },
    ],
  });

  console.log(`Topic ${topic} created with ${numPartitions} partitions.`);

  await admin.disconnect();
}
