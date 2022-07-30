console.log(new Date(), 'Application Started');

function handler(signal) {
  console.info(new Date(), 'Signal Received', signal);
  console.info(new Date(), 'Application Stopped');
  process.exit(0);
}

process.on('SIGINT', handler);
process.on('SIGTERM', handler);

async function checkEventLoop() {
  return new Promise(result => setTimeout(result, 0));
}

async function main() {
  switch (process.argv[2]) {

    case 'memory':
      const data = [];
      while (true) {
        data.push(new Array(1024 * 10).fill(0));
        console.debug(new Date(), process.memoryUsage.rss() / 1024 / 1024, 'MB');
        await checkEventLoop();
      }
      break;

    default:
      throw 'Unknown Test';
  }
}

main()
  .catch(error => {
    console.error(new Date(), error);
    console.info(new Date(), 'Application Stopped');
    process.exit(1);
  });
