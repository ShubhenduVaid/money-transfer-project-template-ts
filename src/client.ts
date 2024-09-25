// @@@SNIPSTART money-transfer-project-template-ts-start-workflow
import { Connection, Client } from '@temporalio/client';
import { moneyTransfer } from './workflows';
import type { PaymentDetails } from './shared';

import { namespace, taskQueueName } from './shared';
import fs from 'fs/promises';

async function run() {
  console.log(
    'namespace',
    process.env.namespace,
    process.env.TEMPORAL_NAMESPACE
  );
  const cert = await fs.readFile(
    '/Users/shubhenduvaid/workspace/temporal/temporal-certs/client.pem'
  );
  const key = await fs.readFile(
    '/Users/shubhenduvaid/workspace/temporal/temporal-certs/client.key'
  );

  const connectionOptions = {
    address: 'default.fmp11.tmprl.cloud:7233',
    tls: {
      clientCertPair: {
        crt: cert,
        key,
      },
    },
  };
  const connection = await Connection.connect(connectionOptions);
  const client = new Client({ connection, namespace });

  const details: PaymentDetails = {
    amount: 400,
    sourceAccount: '85-150',
    targetAccount: '43-812',
    referenceId: '12345',
  };

  console.log(
    `Starting transfer from account ${details.sourceAccount} to account ${details.targetAccount} for $${details.amount}`
  );

  const handle = await client.workflow.start(moneyTransfer, {
    args: [details],
    taskQueue: taskQueueName,
    workflowId: 'pay-invoice-801',
  });

  console.log(
    `Started Workflow ${handle.workflowId} with RunID ${handle.firstExecutionRunId}`
  );
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
