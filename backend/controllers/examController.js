const classModel = require("../models/classModel");
const examModel = require("../models/examModel");
const errorRes = require("../utils/errorResponse");
const contentType = require("content-type");
const s3Helper = require("../utils/s3Helper");
const poolConnection = require("../utils/dbConnection");
// const redisClient = require('../middleware/redis');

const examController = {
  getAllExams: async (req, res) => {
    console.log("getAllExams");
    try {
      const paging = req.query?.paging || 0;
      console.log(paging);
      const className = req.query?.class || null;
      console.log(req.query);
      let classId = null;
      if(className){
        classId = await classModel.getClassId(className);
        console.log(className, classId);
      }        
      const teacher = req.query?.teacher || null;
      const year = req.query?.year || null;
      const type = req.query?.type || null;
      const hasAns = req.query?.hasAns || null;
      console.log(teacher, year, type, hasAns);
      const examList = await examModel.getExamList(classId, paging, teacher, year, type, hasAns);
      if (!examList) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (examList.length === 0) {
        return res.status(200).json({ data: [] });
      }
      const classNameList = await classModel.getAllClasses();
      examList.forEach((exam) => {
        const className = classNameList.find((className) => className.id === exam.class_id);
        exam.class = className.name;
      });
      res.status(200).json(examList);
    } catch (err) {
      console.error(err);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
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

      const teacher = req.query?.teacher || null;
      const year = req.query?.year || null;
      const type = req.query?.type || null;
      const hasAns = req.query?.hasAns || null;
      console.log(teacher, year, type, hasAns);
      const examList = await examModel.getExamList(classId, paging, teacher, year, type, hasAns);
      if (!examList) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (examList.length === 0) {
        return res.status(200).json({ data: [] });
      }
      const className = await classModel.getClassName(classId);
      examList.forEach((exam) => {
        exam.class = className;
      });
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
      console.log(examId);
      if (!examId) {
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const exam = await examModel.getExamById(examId);
      if (!exam) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const className = await classModel.getClassName(exam.class_id);
      console.log(className);
      exam.class = className;
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
      
      if(!req.body?.examInfo){
        await connection.rollback();
        const [errorCode, errorMessage] = errorRes.bodyMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const examInfo = JSON.parse(req.body.examInfo);
      console.log(examInfo);
      let classId = await classModel.getClassId(examInfo.className);
      if (!classId) {
        const grade = examInfo.grade;
        const className = examInfo.className;
        classId = await classModel.createClass(className, grade, connection);
      }
      if (!classId) {
        await connection.rollback();
        const deleteKeys = [];
        if (req.files["main_file"] && req.files["main_file"][0]) {
          deleteKeys.push(req.files["main_file"][0].key);
        }
        if (req.files["ans_file"] && req.files["ans_file"][0]) {
          deleteKeys.push(req.files["ans_file"][0].key);
        }
        if (req.files["sheet_files"]) {
          deleteKeys.push(...req.files["sheet_files"].map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      let sheet_files = [];
      if (req.files["sheet_files"]) {
        sheet_files = req.files["sheet_files"].map((file) => file.location);
      }
      console.log(req.files["main_file"]);
      const mainFileLocation =
        req.files["main_file"] && req.files["main_file"][0]
          ? req.files["main_file"][0].location
          : null;
      const ansFileLocation =
        req.files["ans_file"] && req.files["ans_file"][0]
          ? req.files["ans_file"][0].location
          : null;

      const exam = {
        classId: classId,
        type: examInfo.type,
        teacher: examInfo.teacher,
        year: examInfo.year,
        main_file: mainFileLocation,
        ans_file: ansFileLocation,
        sheet_files: sheet_files.length > 0 ? sheet_files : null,
        has_ans: examInfo.hasAns,
        hide_name: examInfo.hideName? examInfo.hideName : 0,
      };

      console.log(exam);

      const result = await examModel.uploadExam(exam, connection);
      if (!result) {
        await connection.rollback();
        const deleteKeys = [];
        if (req.files["main_file"] && req.files["main_file"][0]) {
          deleteKeys.push(req.files["main_file"][0].key);
        }
        if (req.files["ans_file"] && req.files["ans_file"][0]) {
          deleteKeys.push(req.files["ans_file"][0].key);
        }
        if (req.files["sheet_files"]) {
          deleteKeys.push(...req.files["sheet_files"].map((file) => file.key));
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
  updateExam: async (req, res) => {
    console.log("updateExam");
    let connection;
    try{
      connection = await poolConnection();
      await connection.beginTransaction();

      const requestHeader = contentType.parse(req.headers["content-type"]);
      if (requestHeader.type !== "multipart/form-data") {
        await connection.rollback();
        const [errorCode, errorMessage] = errorRes.contentTypeError();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const examId = req.params ? req.params.examId : null;
      if (!examId) {
        await connection.rollback();
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const exam = await examModel.getExamById(examId);
      if (!exam) {
        await connection.rollback();
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      let classId = req.body.classId;
      const className = req.body.className? req.body.className : null;
      if (className) {
        classId = await classModel.getClassId(className);
      }
      if (!classId) {
        await connection.rollback();
        const deleteKeys = [];
        if (req.files["main_file"] && req.files["main_file"][0]) {
          deleteKeys.push(req.files["main_file"][0].key);
        }
        if (req.files["ans_file"] && req.files["ans_file"][0]) {
          deleteKeys.push(req.files["ans_file"][0].key);
        }
        if (req.files["sheet_files"]) {
          deleteKeys.push(...req.files["sheet_files"].map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      let sheet_files = [];
      if (req.files["sheet_files"]) {
        sheet_files = req.files["sheet_files"].map((file) => file.location);
      }
      console.log(req.files);
      const mainFileLocation =
        req.files["main_file"] && req.files["main_file"][0]
          ? req.files["main_file"][0].location
          : null;
      const ansFileLocation =
        req.files["ans_file"] && req.files["ans_file"][0]
          ? req.files["ans_file"][0].location
          : null;
      if (mainFileLocation) {
        const deleteKeys = [];
        const mainFileKey = exam.main_file.replace("https://ade-stylish.s3.ap-northeast-1.amazonaws.com/", "");
        const examFileKeyDecoded = decodeURIComponent(mainFileKey);
        deleteKeys.push(examFileKeyDecoded);
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
      }
      if (ansFileLocation) {
        const deleteKeys = [];
        const ansFileKey = exam.ans_file.replace("https://ade-stylish.s3.ap-northeast-1.amazonaws.com/", "");
        const ansFileKeyDecoded = decodeURIComponent(ansFileKey);
        deleteKeys.push(ansFileKeyDecoded);
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
      }
      if (sheet_files.length > 0) {
        const deleteKeys = [];
        const sheetFileKeys = exam.sheet_files.map((file) => file.replace("https://ade-stylish.s3.ap-northeast-1.amazonaws.com/", ""));
        const sheetFileKeysDecoded = sheetFileKeys.map((file) => decodeURIComponent(file));
        deleteKeys.push(...sheetFileKeysDecoded);
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
      }
      const newExam = {
        classId: classId,
        type: req.body.type ? req.body.type : exam.type,
        teacher: req.body.teacher ? req.body.teacher : exam.teacher,
        year: req.body.year ? req.body.year : exam.year,
        main_file: mainFileLocation? mainFileLocation : exam.main_file,
        ans_file: ansFileLocation? ansFileLocation : exam.ans_file,
        sheet_files: sheet_files.length > 0 ? sheet_files : exam.sheet_files,
        has_ans: req.body.has_ans ? req.body.has_ans : exam.has_ans,
      };
      console.log(newExam);
      const result = await examModel.updateExam(examId, newExam, connection);
      if (!result) {
        await connection.rollback();
        const deleteKeys = [];
        if (req.files["main_file"] && req.files["main_file"][0]) {
          deleteKeys.push(req.files["main_file"][0].key);
        }
        if (req.files["ans_file"] && req.files["ans_file"][0]) {
          deleteKeys.push(req.files["ans_file"][0].key);
        }
        if (req.files["sheet_files"]) {
          deleteKeys.push(...req.files["sheet_files"].map((file) => file.key));
        }
        await s3Helper.deleteS3Objects(deleteKeys, process.env.AWS_BUCKET);
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }

      await connection.commit();
      res.status(200).json({ data: examId });
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
  deleteExam: async (req, res) => {
    console.log("deleteExam");
    try {
      const examId = req.params ? req.params.examId : null;
      if (!examId) {
        const [errorCode, errorMessage] = errorRes.examIdMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const result = await examModel.deleteExam(examId);
      if (!result) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      res.status(200).json({ data: examId });
    } catch (err) {
      console.error(err);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
};

module.exports = examController;
