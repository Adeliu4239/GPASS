// uploadMiddleware.js
const multer = require("multer");
const uploadModule = require("../utils/uploadModule");

const upload = multer({
  storage: multer.memoryStorage(),
});

const uploadFilesMiddleware = (fields) => {
  return upload.fields(fields);
};

const handleUpload = (req, res, next) => {
  try {
    const { main_file, ans_file, sheet_files } = req.files;

    // Perform any necessary validations or checks on the files here
    console.log("main_file", main_file);
    console.log("ans_file", ans_file);
    console.log("sheet_files", sheet_files);
    // Upload files to S3 using the module
    if (main_file) req.mainFileUpload = uploadModule.uploadToS3(main_file[0], "gpass/exams/");
    if (ans_file) req.ansFileUpload = uploadModule.uploadToS3(ans_file[0], "gpass/exams/");
    if (sheet_files) req.sheetFileUploads = sheet_files.map((file) => uploadModule.uploadToS3(file, "gpass/exams/"));

    next();
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  uploadFilesMiddleware,
  handleUpload,
};
