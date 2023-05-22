import { DataSource } from 'typeorm';
import { OrderStatusEntity } from './order-status.entity';

export const AppDataSource = new DataSource({
  name: 'consumer-db',
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  database: 'app',
  username: 'postgres',
  password: 'password',
  entities: [OrderStatusEntity],
});
