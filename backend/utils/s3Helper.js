require('dotenv').config();
const { S3Client, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
  },
  region: process.env.AWS_REGION 
})

const deleteS3Objects = async (keys, bucket) => {
  if (!keys || !bucket) {
    return;
  }
  const deleteParams = {
    Bucket: bucket,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  };

  const command = new DeleteObjectsCommand(deleteParams);

  await s3.send(command);
};

module.exports = { deleteS3Objects };
