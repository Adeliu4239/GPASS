const errorRes = require("../utils/errorResponse");
const contentType = require("content-type");
const s3Helper = require("../utils/s3Helper");
const poolConnection = require("../utils/dbConnection");
const answerModel = require("../models/answerModel");
const userModel = require("../models/userModel");

const answerController = {
  getAnswerList: async (req, res) => {
    console.log("getAnswerList");
    try {
      const exerciseId = req.params.exerciseId;
      const paging = req.query ? req.query.paging : 0;
      if (!exerciseId) {
        const [errorCode, errorMessage] = errorRes.exerciseIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const answers = await answerModel.getAnswerList(exerciseId, paging);
      if (!answers) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      for (const answer of answers) {
        if(answer.hide_name === 1){
          answer.creator_name = "匿名";
          answer,creator_photo = null;
        }
        else{
          const user = await userModel.getUserById(answer.creator_id);
          answer.creator_name = user.name;
          answer.creator_photo = user.photo;
        }
      }
      return res.status(200).json({ answers });
    } catch (err) {
      console.error(err);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  createAnswer: async (req, res) => {
    console.log("createAnswer");
    let connection;
    try {
      connection = await poolConnection();
      const exerciseId = req.params.exerciseId;
      const userId = req.user.id;
      const content = req.body.content;
      const image = req.file;
      console.log("image", image);
      if (!exerciseId) {
        const [errorCode, errorMessage] = errorRes.exerciseIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (!content && !image) {
        await connection.rollback();
        if (image) {
          s3Helper.deleteS3Objects(req.file.key, process.env.AWS_BUCKET);
        }
        const [errorCode, errorMessage] = errorRes.bodyMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const imageUrl = req.file? req.file.location : null;
      const answer = {
        exerciseId,
        userId,
        content,
        imageUrl,
        hideName: req.body.hideName? req.body.hideName : 0,
      };
      const result = await answerModel.createAnswer(answer, connection);
      if (!result) {
        await connection.rollback();
        if (image) {
          s3Helper.deleteS3Objects(req.file.key, process.env.AWS_BUCKET);
        }
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      await connection.commit();
      return res.status(200).json({ answerId: result });
    } catch (err) {
      console.error(err);
      await connection.rollback();
      if (req.file) {
        s3Helper.deleteS3Objects(req.file.key, process.env.AWS_BUCKET);
      }
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  updateAnswer: async (req, res) => {
    console.log("updateAnswer");
    let connection;
    try {
      connection = await poolConnection();
      const answerId = req.params.answerId;
      const userId = req.user.id;
      const image = req.file? req.file : null;
      if (!answerId) {
        const [errorCode, errorMessage] = errorRes.answerIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (!req.body.content && !req.file) {
        await connection.rollback();
        if (image) {
          s3Helper.deleteS3Objects(req.file.key, process.env.AWS_BUCKET);
        }
        const [errorCode, errorMessage] = errorRes.bodyMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const queryResult = await answerModel.getAnswerById(answerId);
      if (!queryResult) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        await connection.rollback();
        if (image) {
          s3Helper.deleteS3Objects(req.file.key, process.env.AWS_BUCKET);
        }
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (queryResult.creator_id !== userId) {
        const [errorCode, errorMessage] = errorRes.notAuthorized();
        await connection.rollback();
        if (image) {
          s3Helper.deleteS3Objects(req.file.key, process.env.AWS_BUCKET);
        }
        return res.status(errorCode).json({ error: errorMessage });
      }

      const content = req.body.content ? req.body.content : queryResult.content;
      const imageUrl = req.file? req.file.location : queryResult.image_url;
      const answer = {
        answerId,
        content,
        imageUrl,
      };
      const result = await answerModel.updateAnswer(answer, connection);
      if (!result) {
        await connection.rollback();
        if (image) {
          s3Helper.deleteS3Objects(req.file.key, process.env.AWS_BUCKET);
        }
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      await connection.commit();
      return res.status(200).json({ answerId: result });
    } catch (err) {
      console.error(err);
      await connection.rollback();
      if (req.file) {
        s3Helper.deleteS3Objects(req.file.key, process.env.AWS_BUCKET);
      }
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  deleteAnswer: async (req, res) => {
    console.log("deleteAnswer");
    let connection;
    try {
      connection = await poolConnection();
      const answerId = req.params.answerId;
      const userId = req.user.id;
      if (!answerId) {
        const [errorCode, errorMessage] = errorRes.answerIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const queryResult = await answerModel.getAnswerById(answerId);
      if (!queryResult) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        await connection.rollback();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (queryResult.creator_id !== userId) {
        const [errorCode, errorMessage] = errorRes.notAuthorized();
        await connection.rollback();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const result = await answerModel.deleteAnswer(answerId, connection);
      if (!result) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        await connection.rollback();
        return res.status(errorCode).json({ error: errorMessage });
      }
      await connection.commit();
      return res.status(200).json({ answerId: result });
    } catch (err) {
      console.error(err);
      await connection.rollback();
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
};

module.exports = answerController;
