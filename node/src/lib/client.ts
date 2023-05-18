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
