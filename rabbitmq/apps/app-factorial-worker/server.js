const amqplib = require('amqplib');
const aws = require('aws-sdk');
const bson = require('bson');
const process = require('process');

function factorial(number) {
  if (number == 1) {
    return 1;
  }

  return number * factorial(number - 1);
}

async function main() {
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    s3ForcePathStyle: true,
  });

  const url = new URL('amqp://localhost');

  url.hostname = process.env.RABBITMQ_HOST;
  url.port     = process.env.RABBITMQ_PORT;
  url.username = process.env.RABBITMQ_USERNAME;
  url.password = process.env.RABBITMQ_PASSWORD;

  const connection = await amqplib.connect(url.href);

  const channel = await connection.createChannel();

  channel.consume('factorials', (message) => {
    const headers = message.properties.headers;
    const body    = bson.deserialize(message.content);

    body.factorial = factorial(body.number);

    const params = {
      Bucket: 'factorials',
      Key: headers['x-resource-id'],
      Body: JSON.stringify(body),
      ContentType: 'application/json',
    };

    s3.putObject(params, (err, data) => {}); // TODO Exception Handling

    channel.ack(message);

    console.debug(new Date(), headers['x-resource-id'], body.factorial);
  });

  async function handler() {
    channel.close();
    connection.close();
    console.info(new Date(), 'Worker Stopped.');
    process.exit(0);
  }

  process.on('SIGINT', handler);
  process.on('SIGTERM', handler);
}

main()
  .then(() => console.info(new Date(), 'Worker Started.'))
  .catch((error) => { console.error(error); process.exit(1); });
