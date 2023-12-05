// uploadFiles.js

require("dotenv").config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const createS3Storage = (path) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  return multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
      const encodedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      const filePath = `${path}/${encodedFileName}`;
      console.log(filePath);
      cb(null, filePath);
    },
  });
};

const upLoadFlies = (filePath) => {
  console.log("uploadFiles");
  const storage = createS3Storage(filePath);
  return multer({
    fileFilter(req, file, cb) {
      const allowedFileTypes = /png|jpeg|jpg|pdf|docs|doc|zip/;
      const extname = allowedFileTypes.test(
        file.originalname.toLowerCase().split(".").pop()
      );
      if (!extname) {
        return cb(
          new Error(
            "Please upload a file with a valid format (png, jpeg, jpg, pdf, docs, doc, zip)"
          )
        );
      }
      cb(null, true);
    },
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB 檔案大小限制
    },
  });
};

module.exports = {
  upLoadFlies: upLoadFlies,
};
