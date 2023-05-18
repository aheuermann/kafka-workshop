import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'order_status' })
export class OrderStatusEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'text', name: 'account_id' })
  accountId: string;

  @Column({ type: 'text' })
  status: Date;

  @Column({ type: 'timestamp', name: 'timestamp' })
  timestamp: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: string;
}
