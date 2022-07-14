const amqplib = require('amqplib');
const bson = require('bson');
const process = require('process');

function factorial(number) {
  if (number == 1) {
    return 1;
  }

  return number * factorial(number - 1);
}

async function main() {
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

    console.log(new Date(), headers['x-resource-id'], factorial(body.number));

    channel.ack(message);
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
