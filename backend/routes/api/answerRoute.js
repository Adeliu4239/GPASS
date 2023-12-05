const express = require("express");
const router = express.Router();
const answerController = require("../../controllers/answerController");
const authorization = require("../../middleware/adminCheck");
const uploadFiles = require("../../utils/uploadFiles");

router.get("/", (req, res) => {
  res.send("answer");
});

router.get("/:exerciseId", answerController.getAnswerList);
router.post(
  "/upload/:exerciseId",
  uploadFiles
    .upLoadFlies(`gpass/answers`)
    .single("image_url"),
  authorization,
  answerController.createAnswer
);
router.put(
    "/details/:answerId",
    uploadFiles.upLoadFlies(`gpass/answers`).single("image_url"),
    authorization,
    answerController.updateAnswer
);
router.delete("/details/:answerId", authorization, answerController.deleteAnswer);

module.exports = router;