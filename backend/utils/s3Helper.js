const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const deleteS3Objects = async (keys, bucket) => {
  const deleteParams = {
    Bucket: bucket,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  };

  await s3.deleteObjects(deleteParams).promise();
};

module.exports = { deleteS3Objects };
