const classModel = require("../models/classModel");
const examModel = require("../models/examModel");
const errorRes = require("../utils/errorResponse");
const contentType = require("content-type");
const s3Helper = require("./s3Helper");
const poolConnection = require("../utils/dbConnection");
// const redisClient = require('../middleware/redis');

const examController = {
  getExamList: async (req, res) => {
    console.log("getExamList");
    try {
      // const className = req.params? req.params.class : null;
      const classId = req.params ? req.params.classId : null;
      console.log(classId);
      if (!classId) {
        const [errorCode, errorMessage] = errorRes.classIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const paging = req.query?.paging || 0;
      console.log(paging);
      const examList = await examModel.getExamList(classId, paging);
      if (!examList) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (examList.length === 0) {
        return res.status(200).json({ data: [] });
      }
      console.log(examList);
      res.status(200).json(examList);
    } catch (err) {
      console.error(err);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  getExamById: async (req, res) => {
    console.log("getExamById");
    try {
      const examId = req.params ? req.params.examId : null;
      if (!examId) {
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const exam = await examModel.getExamById(examId);
      if (!exam) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      res.status(200).json(exam);
    } catch (err) {
      console.error(err);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  uploadExam: async (req, res) => {
    console.log("uploadExam");
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

      let classId = await classModel.getClassId(req.body.className);
      if (!classId) {
        const grade = req.body.grade;
        const className = req.body.className;
        classId = await classModel.createClass(className, grade, connection);
      }
      if (!classId) {
        await connection.rollback();
        const deleteKeys = [];
        if (req.files["mainFile"] && req.files["mainFile"][0]) {
          deleteKeys.push(req.files["mainFile"][0].key);
        }
        if (req.files["ansFile"] && req.files["ansFile"][0]) {
          deleteKeys.push(req.files["ansFile"][0].key);
        }
        if (req.files["sheetFiles"]) {
          deleteKeys.push(...req.files["sheetFiles"].map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      let sheetFiles = [];
      if (req.files["sheetFiles"]) {
        sheetFiles = req.files["sheetFiles"].map((file) => file.location);
      }

      const mainFileLocation =
        req.files["mainFile"] && req.files["mainFile"][0]
          ? req.files["mainFile"][0].location
          : null;
      const ansFileLocation =
        req.files["ansFile"] && req.files["ansFile"][0]
          ? req.files["ansFile"][0].location
          : null;

      const exam = {
        classId: classId,
        type: req.body.type,
        teacher: req.body.teacher,
        year: req.body.year,
        mainFile: mainFileLocation,
        ansFile: ansFileLocation,
        sheetFiles: sheetFiles,
        hasAns: req.body.hasAns,
      };

      console.log(exam);

      const result = await examModel.uploadExam(exam, connection);
      if (!result) {
        await connection.rollback();
        const deleteKeys = [];
        if (req.files["mainFile"] && req.files["mainFile"][0]) {
          deleteKeys.push(req.files["mainFile"][0].key);
        }
        if (req.files["ansFile"] && req.files["ansFile"][0]) {
          deleteKeys.push(req.files["ansFile"][0].key);
        }
        if (req.files["sheetFiles"]) {
          deleteKeys.push(...req.files["sheetFiles"].map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }

      await connection.commit();
      res.status(200).json({ data: result });
    } catch (err) {
      console.error(err);
      if (connection) {
        await connection.rollback();
      }
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
};

module.exports = examController;
