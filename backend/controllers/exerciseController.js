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
        const deleteKeys  = [];
        if (req.files) {
          deleteKeys.push(...req.files.map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.contentTypeError();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const examId = req.params ? req.params.examId : null;
      if (!examId) {
        await connection.rollback();
        const deleteKeys  = [];
        if (req.files) {
          deleteKeys.push(...req.files.map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const question = req.body.question;
      const content = req.body? req.body.content : null;
      const creator = req.user.id;
      if (!examId || !question) {
        const [errorCode, errorMessage] = errorRes.bodyMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const exercise = {
        question,
        content,
        creator,
      };
      const exerciseId = await exerciseModel.createExercise(examId, exercise, connection);
      if (!exerciseId) {
        const [errorCode, errorMessage] = errorRes.dbConnectFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      let imageUrls = [];
      if (req.files) {
        imageUrls = req.files.map((file) => file.location);
      }
      for (let i = 0; i < imageUrls.length; i++) {
        console.log(imageUrls[i]);
        let result = await exerciseModel.createExerciseImage(exerciseId, imageUrls[i], connection);
        console.log(result);
        if (!result) {
          await connection.rollback();
          const deleteKeys  = [];
          if (req.files) {
            deleteKeys.push(...req.files.map((file) => file.key));
          }
          await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
          const [errorCode, errorMessage] = errorRes.dbConnectFailed();
          return res.status(errorCode).json({ error: errorMessage });
        }
      }
      await connection.commit();
      return res.status(200).json({ data: exerciseId });
    } catch (error) {
      console.log(error);
      await connection.rollback();
      const deleteKeys  = [];
        if (req.files) {
          deleteKeys.push(...req.files.map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    } finally {
      connection.release();
    }
  },
  updateExercise: async (req, res) => {
    console.log("updateExercise");
    let connection;
    try {
      connection = await poolConnection();
      await connection.beginTransaction();

      const requestHeader = contentType.parse(req.headers["content-type"]);
      if (requestHeader.type !== "multipart/form-data") {
        await connection.rollback();
        const deleteKeys  = [];
        if (req.files) {
          deleteKeys.push(...req.files.map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.contentTypeError();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const exerciseId = req.params ? req.params.exerciseId : null;
      if (!exerciseId) {
        await connection.rollback();
        const deleteKeys  = [];
        if (req.files) {
          deleteKeys.push(...req.files.map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }

      if(!req.body.question && !req.body.content && !req.files) {
        await connection.rollback();
        const [errorCode, errorMessage] = errorRes.noThingToUpdate();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const checkExerciseResult = await exerciseModel.getExerciseById(exerciseId);

      if (!checkExerciseResult || checkExerciseResult.deleted_at) {
        await connection.rollback();
        const deleteKeys  = [];
        if (req.files) {
          deleteKeys.push(...req.files.map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.queryNotFound();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if(checkExerciseResult.creator_id !== req.user.id) {
        console.log(checkExerciseResult.creator_id);
        await connection.rollback();
        const deleteKeys  = [];
        if (req.files) {
          deleteKeys.push(...req.files.map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.notYourExercise();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const question = req.body.question? req.body.question : checkExerciseResult.question;
      const content = req.body.content? req.body.content : checkExerciseResult.content;
      const creator = req.user.id;
      const exercise = {
        question,
        content,
        creator,
      };
      const result = await exerciseModel.updateExercise(exerciseId, exercise, connection);
      if (!result) {
        const [errorCode, errorMessage] = errorRes.dbConnectFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      let imageUrls = [];
      if (req.files) {
        imageUrls = req.files.map((file) => file.location);
        // const deleteKeys  = [];
        // if (checkExerciseResult.images) {
        //   checkExerciseResult.images.forEach((image) => {
        //     const encodedUrl = image.image_url.replace("https://ade-stylish.s3.ap-northeast-1.amazonaws.com/", "");
        //     const decodedUrl = decodeURIComponent(encodedUrl);
        //     deleteKeys.push(decodedUrl);
        //   });
        // }
        // await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
      }
      for (let i = 0; i < imageUrls.length; i++) {
        console.log(imageUrls[i]);
        let result = await exerciseModel.createExerciseImage(exerciseId, imageUrls[i], connection);
        console.log(result);
        if (!result) {
          await connection.rollback();
          const deleteKeys  = [];
          if (req.files) {
            deleteKeys.push(...req.files.map((file) => file.key));
          }
          await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
          const [errorCode, errorMessage] = errorRes.dbConnectFailed();
          return res.status(errorCode).json({ error: errorMessage });
        }
      }
      await connection.commit();
      return res.status(200).json({ data: exerciseId });
    } catch (error) {
      console.log(error);
      await connection.rollback();
      const deleteKeys  = [];
        if (req.files) {
          deleteKeys.push(...req.files.map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  deleteExercise: async (req, res) => {
    console.log("deleteExercise");
    try {
      const exerciseId = req.params ? req.params.exerciseId : null;
      if (!exerciseId) {
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const checkExerciseResult = await exerciseModel.getExerciseById(exerciseId);
      if (!checkExerciseResult || checkExerciseResult.deleted_at) {
        const [errorCode, errorMessage] = errorRes.queryNotFound();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if(checkExerciseResult.creator_id !== req.user.id) {
        console.log(checkExerciseResult.creator_id);
        const [errorCode, errorMessage] = errorRes.notYourExercise();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const result = await exerciseModel.deleteExercise(exerciseId);
      if (!result) {
        const [errorCode, errorMessage] = errorRes.dbConnectFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      return res.status(200).json({ data: exerciseId });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
};



module.exports = exerciseController;
