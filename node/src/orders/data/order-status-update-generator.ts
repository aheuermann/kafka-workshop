import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const OUTPUT_FILE = path.join(__dirname, './/order-status-updates.txt');

const NUM_ACCOUNTS = 3;
const UNIQUE_ORDERS_PER_ACCOUNT = 10;

const STATUSES = ['IN_PROCESS', 'PENDING', 'INVOICED', 'PAID', 'DISPATCHED', 'DELIVERED', 'CLOSED'];

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function generateOrderUpdatesForAccount(accountId: string) {
  fs.unlinkSync(OUTPUT_FILE);
  for (let i = 0; i < UNIQUE_ORDERS_PER_ACCOUNT; i++) {
    const id = uuidv4();

    let dateIter = addDays(new Date(), -STATUSES.length - 1);
    for (let u = 0; u < STATUSES.length; ++u) {
      const status = STATUSES[u];
      const timestamp = dateIter.toISOString();
      const orderUpdate = JSON.stringify({ id, accountId, status, timestamp });
      dateIter = addDays(dateIter, 1);
      fs.appendFileSync(OUTPUT_FILE, orderUpdate);
      fs.appendFileSync(OUTPUT_FILE, '\n');
    }
  }
}

async function generateOrderStatusUpdates() {
  for (let i = 0; i < NUM_ACCOUNTS; ++i) {
    const accountId = `acct_${i}`;
    generateOrderUpdatesForAccount(accountId);
  }
}

generateOrderStatusUpdates()
  .catch((err) => {
    console.error(`[order-status-generator] ${err.message}`, err);
  })
  .then(() => {
    console.log('[order-status-generator] finished');
  });
