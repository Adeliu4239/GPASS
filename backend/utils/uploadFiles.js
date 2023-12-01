require('dotenv').config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
  },
  region: process.env.AWS_REGION 
})

const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET,
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = file.originalname;
    const encodedFileName = Buffer.from(fileName, 'utf-8').toString('utf-8');
    const filePath = "gpass/exams/" + encodedFileName;
    const encodedFilePath = Buffer.from(filePath, 'utf-8').toString('utf-8');
    cb(null, encodedFilePath);
  },
  contentDisposition: multerS3.AUTO_CONTENT_DISPOSITION,
});

const upload = multer({
  fileFilter(req, file, cb) {
    const allowedFileTypes = /png|jpeg|jpg|pdf|docs|doc|zip/;
    const extname = allowedFileTypes.test(file.originalname.toLowerCase().split('.').pop());
    if (!extname) {
      return cb(new Error("Please upload a file with a valid format (png, jpeg, jpg, pdf, docs, doc, zip)"));
    }
    cb(null, true);
  },
  storage: s3Storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 檔案大小限制
  },
});

module.exports = {
  upLoadFlies: () => {
    console.log("uploadFiles");
    return upload;
  },
};
