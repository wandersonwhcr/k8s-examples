console.log(new Date(), 'Application Started');

function handler(signal) {
  console.info(new Date(), 'Signal Received: ' + signal);
  console.info(new Date(), 'Application Stopped');
  process.exit(0);
}

process.on('SIGINT', handler);
process.on('SIGTERM', handler);

async function checkEventLoop() {
  return new Promise(result => setTimeout(result, 0));
}

async function main() {
  while (true) {
    await checkEventLoop();
  }
}

main()
  .catch(error => {
    console.error(new Date(), error);
    console.info(new Date(), 'Application Stopped');
    process.exit(1);
  });
