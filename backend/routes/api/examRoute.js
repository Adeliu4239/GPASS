const express = require("express");
const router = express.Router();
const examController = require("../../controllers/examController");
const uploadFiles = require("../../utils/uploadFiles");

router.get("/", (req, res) => {
  res.send("exam");
});
router.get("/:classId", examController.getExamList);
router.get("/detail/:examId", examController.getExamById);
router.post(
  "/upload",
  uploadFiles.upLoadFlies().fields([
    { name: "main_file", maxCount: 1 },
    { name: "ans_file", maxCount: 1 },
    { name: "sheet_files", maxCount: 10 },
  ]),
  examController.uploadExam
);
router.put("/:examId", examController.updateExam);
// router.delete("/:examId", examController.deleteExam);

module.exports = router;
