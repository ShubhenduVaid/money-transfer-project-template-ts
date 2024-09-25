// @@@SNIPSTART money-transfer-project-template-ts-worker
import { Worker, NativeConnection } from '@temporalio/worker';
import * as activities from './activities';
import { namespace, taskQueueName } from './shared';
import fs from 'fs/promises';

async function run() {
  const connection = await NativeConnection.connect({
    address: 'default.fmp11.tmprl.cloud:7233',
    tls: {
      clientCertPair: {
        crt: await fs.readFile(
          '/Users/shubhenduvaid/workspace/temporal/temporal-certs/client.pem'
        ),
        key: await fs.readFile(
          '/Users/shubhenduvaid/workspace/temporal/temporal-certs/client.key'
        ),
      },
    },
  });
  // Register Workflows and Activities with the Worker and connect to
  // the Temporal server.
  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve('./workflows'),
    activities,
    namespace,
    taskQueue: taskQueueName,
  });

  // Start accepting tasks from the Task Queue.
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
