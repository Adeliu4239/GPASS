const errorRes = require("../utils/errorResponse");
const contentType = require("content-type");
const s3Helper = require("../utils/s3Helper");
const poolConnection = require("../utils/dbConnection");
const exerciseModel = require("../models/exerciseModel");

const exerciseController = {
  getExerciseList: async (req, res) => {
    console.log("getExerciseList");
    try {
      const examId = req.params ? req.params.examId : null;
      const paging = req.query ? req.query.paging : null;
      if (!examId) {
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const exerciseList = await exerciseModel.getExerciseList(examId, paging);
      if (!exerciseList) {
        const [errorCode, errorMessage] = errorRes.dbConnectFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      return res.status(200).json({ data: exerciseList });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  getExerciseById: async (req, res) => {
    console.log("getExerciseById");
    try {
      const exerciseId = req.params ? req.params.exerciseId : null;
      if (!exerciseId) {
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const exercise = await exerciseModel.getExerciseById(exerciseId);
      if (!exercise) {
        const [errorCode, errorMessage] = errorRes.dbConnectFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      return res.status(200).json({ data: exercise });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  uploadExercise: async (req, res) => {
    console.log("uploadExercise");
    let connection;
    try {
      connection = await poolConnection();
      await connection.beginTransaction();

      const requestHeader = contentType.parse(req.headers["content-type"]);
      if (requestHeader.type !== "multipart/form-data") {
        await connection.rollback();
        const [errorCode, errorMessage] = errorRes.contentTypeError();
        return res.status(errorCode).json({ error: errorMessage });
      }
      
      const examId = req.body.examId;
      const question = req.body.question;
      const content = req.body.content;
      const images = req.files;
      if (!examId || !question) {
        const [errorCode, errorMessage] = errorRes.bodyMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const exercise = {
        examId,
        question,
        content,
      };
      const exerciseId = await exerciseModel.createExercise(exercise);
      if (!exerciseId) {
        const [errorCode, errorMessage] = errorRes.dbConnectFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const imageUrls = [];
      for (const image of images) {
        const imageUrl = await s3Helper.uploadFile(image);
        if (!imageUrl) {
          const [errorCode, errorMessage] = errorRes.dbConnectFailed();
          return res.status(errorCode).json({ error: errorMessage });
        }
        imageUrls.push(imageUrl);
      }
      const result = await exerciseModel.createExerciseImages(
        exerciseId,
        imageUrls
      );
      if (!result) {
        const [errorCode, errorMessage] = errorRes.dbConnectFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      return res.status(200).json({ data: exerciseId });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    } finally {
      connection.release();
    }
  },
};

module.exports = exerciseController;
