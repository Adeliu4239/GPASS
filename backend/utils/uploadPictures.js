require('dotenv').config();
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // change it as per your AWS account
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // change it as per your AWS account
  },
  region: process.env.AWS_REGION // change it as per your AWS account
})

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: process.env.AWS_BUCKET, // bucket name to upload file
  // acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
      const filePath = "images/" + fileName;
      cb(null, filePath);
  }
});

module.exports = {
  uploadPicture: () => {
    console.log("uploadPicture");
    const upload = multer({
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
          return cb(new Error("Please upload a Image with png or jpg format"));
        }
        cb(undefined, true);
      },
      storage: s3Storage,
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB file size limit
      },
    });
    return upload;
  },
};
