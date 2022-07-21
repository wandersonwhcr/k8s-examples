#!/usr/bin/env node

const aws = require('aws-sdk');

async function main() {
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    s3ForcePathStyle: true,
  });

  const buckets = await s3.listBuckets()
    .promise()
    .then(data => data.Buckets)
    .then(buckets => buckets.map(bucket => bucket.Name));

  if (buckets.includes(process.env.AWS_BUCKET)) {
    console.info(new Date(), `Bucket "${process.env.AWS_BUCKET}" found.`);
    return;
  }

  const result = await s3.createBucket({ Bucket: process.env.AWS_BUCKET})
    .promise();

  console.info(new Date(), `Bucket "${process.env.AWS_BUCKET}" created.`);
}

main()
  .catch((error) => { console.error(error); process.exit(1); });
