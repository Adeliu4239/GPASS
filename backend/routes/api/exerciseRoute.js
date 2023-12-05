const express = require("express");
const router = express.Router();
const authorization = require("../../middleware/adminCheck");
const exerciseController = require("../../controllers/exerciseController");
const uploadFiles = require("../../utils/uploadFiles");

router.get("/", (req, res) => {
    res.send("exercise");
    }
);
router.get("/:examId", exerciseController.getExerciseList);
router.get("/details/:exerciseId", exerciseController.getExerciseById);
router.post(
    "/upload",
    uploadFiles.upLoadFlies().array("exercise_files", Infinity),
    authorization,
    exerciseController.uploadExercise
);
// router.put(
//     "/details/:exerciseId",
//     uploadFiles.upLoadFlies().array("exercise_files", Infinity),
//     exerciseController.updateExercise
// );
// router.delete("/details/:exerciseId", exerciseController.deleteExercise);
// router.delete("/:exerciseId", exerciseController.deleteExercise);

module.exports = router;